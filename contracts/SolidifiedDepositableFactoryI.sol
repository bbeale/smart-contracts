pragma solidity 0.5.0;

contract SolidifiedDepositableFactoryI {
  function deployDepositableContract(address _userAddress, address _mainHub)
   public
   returns(address depositable);
}
