pragma solidity 0.4.18;

import "./Owned.sol";

contract StoppableI is OwnedI {
    function isRunning() public constant returns(bool contractRunning);
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

    function Stoppable() public {
        running = true;
    }

    function isRunning() 
        public 
        constant 
        returns(bool contractRunning) 
    {
        return running;
    }

    function setRunSwitch(bool onOff) 
        public
        onlyOwner
        returns(bool success)
    {
        LogSetRunSwitch(msg.sender, onOff);
        running = onOff;
        return true;
    }

}
