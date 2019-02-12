pragma solidity 0.5.0;

contract SolidifiedDepositable {

  address public mainHub;
  address public userAddress;

  /**
    @dev Constructor functions
    @param _userAddress address The user address that will be credited in main hubDeployer
    @param _mainHub address The address of the main hub
  **/
  constructor(address _userAddress, address _mainHub)
  public
  {
    userAddress = _userAddress;
    mainHub = _mainHub;
  }


  /**
  @dev Fallback to receive ether and transfer to _mainHub
  **/
  function ()
    external
    payable {
    require(msg.value > 0);
    (bool success, bytes memory _) = mainHub.call.value(msg.value)(abi.encodeWithSignature("receiveDeposit(address)",userAddress));
    require(success);
  }
}
