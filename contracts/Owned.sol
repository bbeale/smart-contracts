pragma solidity 0.4.18;

contract OwnedI {
    function getOwner() public constant returns(address owner);
    function changeOwner(address newOwner) public returns (bool success);
}

contract Owned is OwnedI {
    
    address private contractOwner;
  
    event LogOwnerChanged(
        address oldOwner, 
        address newOwner);

    modifier onlyOwner {
        require(msg.sender == contractOwner);
        _;
    } 
  
    function Owned() public {
        contractOwner = msg.sender;
    }

    function getOwner() public constant returns(address owner) {
        return contractOwner;
    }
  
    function changeOwner(address newOwner) 
        public 
        onlyOwner 
        returns(bool success) 
    {
        require(newOwner != 0);
        LogOwnerChanged(contractOwner, newOwner);
        contractOwner = newOwner;
        return true;
    }
  
}
