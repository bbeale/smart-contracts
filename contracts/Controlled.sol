pragma solidity 0.5.0;

import "./Owned.sol";

/*
Manage a privileged user "controllerAddress" which is expected to be a centralized server.
*/

contract ControlledI is OwnedI {

    function getController() public view returns(address controller);
    function changeController(address newController) public returns(bool success);
}

contract Controlled is ControlledI, Owned {

    address private controllerAddress;

    event LogControllerChanged(
        address sender,
        address oldController,
        address newController);

    modifier onlyController {
        require(msg.sender == controllerAddress, "Controlled:Sender is not controller");
        _;
    }

    constructor(address controller) public {
        controllerAddress = controller;
        if(controllerAddress == address(0)) controllerAddress = msg.sender;
    }

    function getController() public view returns(address controller) {
        return controllerAddress;
    }

    function changeController(address newController)
        public
        onlyOwner
        returns(bool success)
    {
        require(newController != address(0), "Controlled:Invalid address");
        require(newController != controllerAddress, "Controlled:New controller should be different than controller");
        emit LogControllerChanged(msg.sender, controllerAddress, newController);
        controllerAddress = newController;
        return true;
    }

}
