const SolidifiedMain = artifacts.require('./SolidifiedMain.sol');
const SolidifiedDepositableFactory = artifacts.require('./SolidifiedDepositableFactory.sol');
const SolidifiedVault = artifacts.require('./SolidifiedVault.sol');

const hubDeployer = async function (owner, controller) {

  const main = await SolidifiedMain.new(controller, '0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002', { from: owner });
  const depositableFactory = await SolidifiedDepositableFactory.new();
  const vault = await SolidifiedVault.new([owner, main.address], 2, { from: owner });

  await main.changeDespositableFactoryAddress(depositableFactory.address, { from: controller });
  await main.changeVaultAddress(vault.address, { from: owner });

  return {
    main,
    depositableFactory,
    vault
  };

};

module.exports = { hubDeployer };
