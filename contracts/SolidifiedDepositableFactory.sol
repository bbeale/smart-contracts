pragma solidity 0.4.18;

import "./SolidifiedDepositable.sol";
import "./SolidifiedDepositableFactoryI.sol";

contract SolidifiedDepositableFactory is SolidifiedDepositableFactoryI {

  /**
  @dev Deploys a new depoitable contract
  @param _userAddress address Address of the user
  @param _mainHub address Address of the main hub
  @return The address of the new contract
  **/
  function deployDepositableContract(address _userAddress, address _mainHub)
    public
    returns(address depositable){

      SolidifiedDepositable d = new SolidifiedDepositable(_userAddress, _mainHub);
      return d;
  }

}
