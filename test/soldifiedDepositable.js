const { hubDeployer } = require('./helpers/hubDeployer');

const SolidifiedDepositable = artifacts.require('./SolidifiedDepositable.sol');
const BN = web3.utils.BN;

contract('Solidified Depositable', (accounts) => {
  let hub = {};

  const ownerAddress = accounts[0];
  const controllerAddress = accounts[1];
  const userAddress = accounts[5];

  before(async () => {
    hub = await hubDeployer(ownerAddress, controllerAddress);
  });

  it('Deploys correctly', async () => {
    await hub.main.deployDepositableContract(userAddress, { from: controllerAddress });
    const depositableAddress = await hub.main.deployedContracts(await hub.main.getDeployedContractsCount() - 1);
    const depositable = await SolidifiedDepositable.at(depositableAddress);
    const address = await depositable.userAddress();
    const mainAddress = await depositable.mainHub();
    assert.equal(address, userAddress);
    assert.equal(mainAddress, hub.main.address);
  });

  it('Users can correctly send ether', async () => {
    const userBalanceBefore = await hub.main.userStructs(userAddress);
    const vaultBalanceBefore = new BN(await web3.eth.getBalance(hub.vault.address));
    const depositableAddress = await hub.main.deployedContracts(await hub.main.getDeployedContractsCount() - 1);
    const depositable = await SolidifiedDepositable.at(depositableAddress);
    await web3.eth.sendTransaction({ from: userAddress, to: depositable.address, value: 3000000 });
    const userBalanceAfter = await hub.main.userStructs(userAddress);
    const vaultBalanceAfter = new BN(await web3.eth.getBalance(hub.vault.address));
    assert.equal(userBalanceBefore[0].toNumber() + 3000000, userBalanceAfter[0].toNumber(), 'User should have received 300000');
    assert.isTrue(vaultBalanceBefore.add(new BN(3000000)).eq(vaultBalanceAfter), 'Vault should have received 300000');
  });

});
