pragma solidity 0.5.0;

import "./Owned.sol";

contract StoppableI is OwnedI {
    function isRunning() public view returns(bool contractRunning);
    function setRunSwitch(bool onOff) public returns(bool success);
}

contract Stoppable is StoppableI, Owned {
    bool private running;

    modifier onlyIfRunning
    {
        require(running);
        _;
    }

    event LogSetRunSwitch(address sender, bool isRunning);

    constructor() public {
        running = true;
    }

    function isRunning()
        public
        view
        returns(bool contractRunning)
    {
        return running;
    }

    function setRunSwitch(bool onOff)
        public
        onlyOwner
        returns(bool success)
    {
        emit LogSetRunSwitch(msg.sender, onOff);
        running = onOff;
        return true;
    }

}
