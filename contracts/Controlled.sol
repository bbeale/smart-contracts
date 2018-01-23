pragma solidity 0.4.18;

import "./Owned.sol";

/*
Manage a privileged user "controllerAddress" which is expected to be a centralized server.
*/

contract ControlledI is OwnedI {

    function getController() public constant returns(address controller);
    function changeController(address newController) public returns(bool success);
}

contract Controlled is ControlledI, Owned {

    address private controllerAddress;

    event LogControllerChanged(
        address sender,
        address oldController,
        address newController);

    modifier onlyController {
        require(msg.sender == controllerAddress);
        _;
    }

    function Controlled(address controller) public {
        controllerAddress = controller;
        if(controllerAddress == address(0)) controllerAddress = msg.sender;
    }

    function getController() public constant returns(address controller) {
        return controllerAddress;
    }

    function changeController(address newController)
        public
        onlyOwner
        returns(bool success)
    {
        require(newController != 0);
        require(newController != controllerAddress);
        LogControllerChanged(msg.sender, controllerAddress, newController);
        controllerAddress = newController;
        return true;
    }

}
