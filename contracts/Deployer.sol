pragma solidity 0.4.18;

import "./SafeMath.sol";

contract DeployerI {
    
    mapping(address => uint) public deployedContractPointers;
    address[] public deployedContracts;
    
    function getDeployedContractsCount() public constant returns(uint count);
    function isDeployedContract(address deployed) public constant returns(bool isIndeed);
       
}

contract Deployer is DeployerI {

    using SafeMath for uint;

    mapping(address => uint) public deployedContractPointers;
    address[] public deployedContracts;
    
    event LogDeployedContract(address sender, address deployed);

    modifier onlyDeployed {
        require(isDeployedContract(msg.sender));
        _;
    }
    
    function getDeployedContractsCount() public constant returns(uint count) {
        return deployedContracts.length;
    }
    
    function insertDeployedContract(address deployed) internal returns(bool success) {
        require(!isDeployedContract(deployed));
        deployedContractPointers[deployed] = deployedContracts.push(deployed).sub(uint(1));
        LogDeployedContract(msg.sender, deployed);
        return true;
    }
    
    function isDeployedContract(address deployed) public constant returns(bool isIndeed) {
        if(deployedContracts.length == 0) return false;
        return deployedContracts[deployedContractPointers[deployed]] == deployed;
    }
    
}
