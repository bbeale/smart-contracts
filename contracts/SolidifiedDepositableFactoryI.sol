pragma solidity 0.4.18;

contract SolidifiedDepositableFactoryI {

  function deployDepositableContract(address _userAddress, address _mainHub)
    public
    returns(address depositable);
}
