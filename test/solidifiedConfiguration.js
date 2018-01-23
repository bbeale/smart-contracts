const { hubDeployer } = require('./helpers/hubDeployer');

contract('Solidified Configuration', function (accounts) {

  let hub = {};

  const ownerAddress = accounts[0];
  const controllerAddress = accounts[1];

  before(async () => {
    hub = await hubDeployer(ownerAddress, controllerAddress);
  });


  it('should set the depositable factory in the SolidifiedMain Hub', async () => {
    const address = hub.depositableFactory.address;
    const addressFromMain = await hub.main.getDepositableFactoryAddress();
    assert.equal(address, addressFromMain);
  });

  it('should set the vault factory in the SolidifiedMain Hub', async () => {
    const address = hub.vault.address;
    const addressFromMain = await hub.main.getVaultAddress();
    assert.equal(address, addressFromMain, 'The address should be equal');
  });

  it('Main should have the correct owner', async () => {
    const address = await hub.main.getOwner();
    assert.equal(address, ownerAddress, 'Main has the incorrect owner');
  });

  it('Main should have the correct controller', async () => {
    const address = await hub.main.getController();
    assert.equal(address, controllerAddress, 'Main has the incorrect controller');
  });

  it('Vault should have the correct owners', async () => {
    const addresses = await hub.vault.getOwners();
    const owner1 = addresses[0];
    const owner2 = addresses[1];
    assert.equal(owner1, ownerAddress);
    assert.equal(owner2, hub.main.address);
  });

  it('Vault should have the correct requirement', async () => {
    const requirement = await hub.vault.required();
    assert.equal(requirement.toNumber(), 2, 'Vault has the incorrect requirements');
  });

});
