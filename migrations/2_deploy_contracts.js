var SolidifiedMain = artifacts.require('./SolidifiedMain.sol');
var SolidifiedVault = artifacts.require('./SolidifiedVault.sol');
var SolidifiedDepositableFactory = artifacts.require('./SolidifiedDepositableFactory.sol');

module.exports = function (deployer, network, accounts) {

  console.log('Network', network);
  console.log('Accounts', accounts);

  let owner = accounts[0];
  let controller = accounts[1];
  let mainAddress;
  let factoryAddress;

  deployer.then(function(){
    return SolidifiedDepositableFactory.new()
  }).then(function (instance){
    factoryAddress = instance.address
    return SolidifiedMain.new(controller, factoryAddress, "0x004")
  }).then(function(instance){
     main = instance;
     console.log("Main address", main.address);
     return SolidifiedVault.new([owner,main.address], 2)
  }).then(function(vaultInstance){
    main.changeVaultAddress(vaultInstance.address, {from: owner})
  })

};
