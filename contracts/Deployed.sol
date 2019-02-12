pragma solidity 0.5.0;

import "./Owned.sol";

contract DeployedI is OwnedI {
    function getDeployer() public view returns(address deployer);
    function changeDeployer(address newDeployer) public returns(bool success);
}

contract Deployed is DeployedI, Owned {

    address private deployerAddress;

    event LogDeployerChanged(
        address sender,
        address oldDeployerr,
        address newDeployer);

    modifier onlyDeployer {
        require(msg.sender == address(deployerAddress));
        _;
    }

    constructor(address deployer) public {
        deployerAddress = deployer;
        if(deployerAddress == address(0)) deployerAddress = msg.sender;
    }

    function getDeployer() public view returns(address deployer) {
        return deployerAddress;
    }

    function changeDeployer(address newDeployer)
        public
        onlyOwner
        returns(bool success)
    {
        require(newDeployer != address(0));
        require(newDeployer != deployerAddress);
        emit LogDeployerChanged(msg.sender, deployerAddress, newDeployer);
        deployerAddress = newDeployer;
        return true;
    }
}
