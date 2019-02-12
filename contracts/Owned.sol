pragma solidity 0.5.0;

contract OwnedI {
    function getOwner() public view returns(address owner);
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

    constructor() public {
        contractOwner = msg.sender;
    }

    function getOwner() public view returns(address owner) {
        return contractOwner;
    }

    function changeOwner(address newOwner)
        public
        onlyOwner
        returns(bool success)
    {
        require(newOwner != address(0));
        emit LogOwnerChanged(contractOwner, newOwner);
        contractOwner = newOwner;
        return true;
    }

}
