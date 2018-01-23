const { hubDeployer } = require('./helpers/hubDeployer');

// Truffle v3 method of importing the contract source code abstractions for this process

const SolidifiedDepositable = artifacts.require('./SolidifiedDepositable.sol');


// Pass in "accounts[]" (comes from Truffle's test suite) and use it near 30.

contract('Solidified Main', function (accounts) {

  let hub = {};

  const ownerAddress = accounts[0];
  const controllerAddress = accounts[1];
  const userAddress = accounts[3];

  context('Deploying a depositable contract', async () => {

    before(async () => {
      hub = await hubDeployer(ownerAddress, controllerAddress);
    });

    it('should deploy a correct depositable contract', async () => {
      await hub.main.deployDepositableContract(userAddress, { from: controllerAddress });
      const reportedDeployedContractsCount = await hub.main.getDeployedContractsCount();
      const deployedContractAddress = await hub.main.deployedContracts(0);
      hub.depositable = await SolidifiedDepositable.at(deployedContractAddress);
      const reportedContractMain = await hub.depositable.mainHub();
      const reportedContractUser = await hub.depositable.userAddress();

      assert.equal(reportedDeployedContractsCount, 1, 'There was not exactly 1 reported deployed escrow contract after exactly 1 insert.');
      assert.strictEqual(reportedContractMain, hub.main.address, 'The depositable is does not have the correct Main address');
      assert.strictEqual(reportedContractUser, userAddress, 'The depositable does not have the correct user address.');
    });

    it('Should register depositable contract corectly', async () => {
      const address = await hub.main.getDepositAddressForUser(userAddress);
      assert.equal(address, hub.depositable.address, 'User has the wrong deposit contract address');
    });

    it('shouldn\'t deploy second depositable for same user', async () => {
      let isError = false;
      try {
        await hub.main.deployDepositableContract(userAddress, { from: controllerAddress });
      } catch (error) {
        isError = true;
      }
      assert.isTrue(isError, 'should have thrown');
    });
  }); // context


  context('Setting up and managing main variables', async () => {
    before(async () => {
      hub = await hubDeployer(ownerAddress, controllerAddress);
    });

    it('Can change depositable factory', async () => {
      const newFactoryAddress = accounts[9];
      await hub.main.changeDespositableFactoryAddress(newFactoryAddress, { from: controllerAddress });
      const factoryAddress = await hub.main.depositableFactoryAddress();
      assert.equal(factoryAddress, newFactoryAddress, 'escrow factory should have changed');
    });

    it('Can\'t change depositable factory for null address', async () => {
      let isError = false;
      try {
        await hub.main.changeDespositableFactoryAddress('0x0', { from: controllerAddress });
      } catch (error) {
        isError = true;
      }
      assert.isTrue(isError, 'should have thrown');
    });

    it('Owner can change vault address', async () => {
      const newVaultAddress = accounts[9];
      await hub.main.changeVaultAddress(newVaultAddress, { from: ownerAddress });
      const vaultAddress = await hub.main.getVaultAddress();
      assert.equal(vaultAddress, newVaultAddress, 'Vault should have changed');
    });

    it('Can\'t change vault factory for null address', async () => {
      let isError = false;
      try {
        await hub.main.changeVaultAddress('0x0', { from: ownerAddress });
      } catch (error) {
        isError = true;
      }
      assert.isTrue(isError, 'should have thrown');
    });

    it('Non owner can\'t change vault address', async () => {
      let isError = false;
      try {
        await hub.main.changeVaultAddress('0x044', { from: controllerAddress });
      } catch (error) {
        isError = true;
      }
      assert.isTrue(isError, 'should have thrown');
    });

    it('Can add a new user', async () => {
      const newUserAddress = accounts[6];
      await hub.main.insertNewUser(newUserAddress, { from: controllerAddress });
      assert.equal(await hub.main.isUser(newUserAddress), true, 'user should have been addded');
    });
  }); //context

  context('Recieving and redirecting ether', async () => {

    const amount = 10 ** 18;

    before(async () => {
      //Deploying main hub
      hub = await hubDeployer(ownerAddress, controllerAddress);

      //deploying Depositable contract
      await hub.main.deployDepositableContract(userAddress, { from: controllerAddress });
      const deployedContractAddress = await hub.main.deployedContracts(0);
      hub.depositable = await SolidifiedDepositable.at(deployedContractAddress);
    });

    it('Can receive user funds correctly', async () => {
      await web3.eth.sendTransaction({ to: hub.depositable.address, from: userAddress, value: amount });
      const balance = await hub.main.userStructs(userAddress);
      assert.equal(balance[0].toNumber(), amount, 'user should have correct balance');
    });

    it('Redirects correctly to vault', async () => {
      const balance = await web3.eth.getBalance(hub.vault.address);
      assert.equal(balance.toNumber(), amount, 'Vault should have received correct amount');
    });

    it('Deposit correctly to user regardless of sender', async () => {
      await web3.eth.sendTransaction({ to: hub.depositable.address, from: accounts[8], value: amount });
      const userBalance = await hub.main.userStructs(userAddress);
      const vaultBalance = await web3.eth.getBalance(hub.vault.address);
      assert.equal(vaultBalance.toNumber(), amount * 2, 'Vault should have received correct amount');
      assert.equal(userBalance[0].toNumber(), amount * 2, 'user should have correct balance');
    });

    it('correctly request vault for withdraw', async () => {
      await hub.main.requestWithdraw(userAddress, amount, { from: controllerAddress });
      const balance = await hub.main.userStructs(userAddress);
      const confirmation = await hub.vault.getConfirmations(0);
      assert.equal(confirmation[0], hub.main.address, 'Main should have confirmed transaction');
      assert.equal(balance[0].toNumber(), amount, 'Amout should be withdraw from user balance');
    });

    it('Owner should be able to confirm transaction', async () => {
      const userBalanceBefore = await web3.eth.getBalance(userAddress);
      const vaultBalanceBefore = await web3.eth.getBalance(hub.vault.address);
      await hub.vault.confirmTransaction(0, { from: ownerAddress });
      const userBalanceAfter = await web3.eth.getBalance(userAddress);
      const vaultBalanceAfter = await web3.eth.getBalance(hub.vault.address);
      assert.equal(userBalanceBefore.toNumber() + amount, userBalanceAfter, 'User should have received ether amount');
      assert.equal(vaultBalanceBefore.toNumber() - amount, vaultBalanceAfter.toNumber(), 'Vault should have transferred the amount');
    });

    it('Shouldn\'t allow request withdraw for non-user', async () => {
      let isError = false;
      try {
        await hub.main.requestWithdraw(accounts[7], 10, { from: controllerAddress });
      } catch (error) {
        isError = true;
      }
      assert.isTrue(isError, 'should have thrown');
    });

    it('Shouldn\'t request more than user balance', async () => {
      let isError = false;
      try {
        await hub.main.requestWithdraw(userAddress, amount + 1000, { from: controllerAddress });
      } catch (error) {
        isError = true;
      }
      assert.isTrue(isError, 'should have thrown');
    });

    it('Controller can collect user credit', async () => {
      const balanceBefore = await hub.main.userStructs(userAddress);
      await hub.main.collectUserCredit(userAddress, amount / 2, 'reference', { from: controllerAddress });
      const balanceAfter = await hub.main.userStructs(userAddress);
      assert.equal(balanceBefore[0].toNumber(), balanceAfter[0].toNumber() + amount / 2, 'controller did not collect funds');
    });

    it('Controller can\'t collect more than user has', async () => {
      let isError = false;
      try {
        await hub.main.collectUserCredit(userAddress, amount * 3, 'reference', { from: controllerAddress });
      } catch (error) {
        isError = true;
      }
      assert.isTrue(isError, 'should have thrown');
    });

    it('Controller can deposit credit for user', async () => {
      const balanceBefore = await hub.main.userStructs(userAddress);
      await hub.main.depositUserCredit(userAddress, amount / 2, 'reference', { from: controllerAddress });
      const balanceAfter = await hub.main.userStructs(userAddress);
      assert.equal(balanceBefore[0].toNumber(), balanceAfter[0].toNumber() - amount / 2, 'controller did not collect funds');
    });

  }); //context

}); // contract
