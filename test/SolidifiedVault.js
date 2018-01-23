const { hubDeployer } = require('./helpers/hubDeployer');

contract('SolidifiedVault', (accounts) => {
  let hub = {};

  const ownerAddress = accounts[0];
  const controllerAddress = accounts[1];
  const userAddress = accounts[3];
  const amount = 10 ** 18;

  before(async () => {
    hub = await hubDeployer(ownerAddress, controllerAddress);
    //Fund vault
    await web3.eth.sendTransaction({ to: hub.vault.address, from: accounts[8], value: amount });
    await hub.main.depositUserCredit(userAddress, amount, 'reference', { from: controllerAddress });
  });

  it('Refuse withdrawal request from other addresses', async () => {
    let isError = false;
    try {
      await hub.main.requestWithdraw(user, amount / 4, { from: accounts[9] });
    } catch (error) {
      isError = true;
    }
    assert.isTrue(isError, 'should give an error message since sale has not started');
  });

  it('Main can Correctly create a transaction', async () => {
    await hub.main.requestWithdraw(userAddress, amount, { from: controllerAddress });
    const transaction = await hub.vault.transactions(0);
    const destination = transaction[0];
    const value = transaction[1];
    const confirmation = await hub.vault.getConfirmations(0);
    assert.equal(destination, userAddress, 'Transaction should have correct destination');
    assert.equal(value.toNumber(), amount, 'Transaction should have correct amount');
    assert.equal(confirmation[0], hub.main.address, 'Main should have confirmed transaction');
  });

  it('Correctly check transaction status', async () => {
    const status = await hub.vault.isConfirmed(0);
    assert.isFalse(status, 'Transaction shouldn\'t have a confirmed status');
  });

  it('Owner should be able to confirm transaction', async () => {
    const userBalanceBefore = await web3.eth.getBalance(userAddress);
    const vaultBalanceBefore = await web3.eth.getBalance(hub.vault.address);
    await hub.vault.confirmTransaction(0, { from: ownerAddress });
    const userBalanceAfter = await web3.eth.getBalance(userAddress);
    const vaultBalanceAfter = await web3.eth.getBalance(hub.vault.address);
    assert.equal(userBalanceBefore.toNumber() + amount, userBalanceAfter.toNumber(), 'User should have received ether amount');
    assert.equal(vaultBalanceBefore.toNumber() - amount, vaultBalanceAfter.toNumber(), 'Vault should have transferred the amount');
  });

});
