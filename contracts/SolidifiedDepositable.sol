pragma solidity 0.4.18;

contract SolidifiedDepositable {

  address public mainHub;
  address public userAddress;

  /**
    @dev Constructor functions
    @param _userAddress address The user address that will be credited in main hubDeployer
    @param _mainHub address The address of the main hub
  **/
  function SolidifiedDepositable(address _userAddress, address _mainHub)
  public
  {
    userAddress = _userAddress;
    mainHub = _mainHub;
  }


  /**
  @dev Fallback to receive ether and transfer to _mainHub
  **/
  function ()
    public
    payable {
    require(msg.value > 0);
    require(mainHub.call.value(msg.value)(bytes4(keccak256("receiveDeposit(address)")),userAddress));
  }
}
