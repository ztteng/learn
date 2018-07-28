pragma solidity ^0.4.24;

contract Proof {
    struct FileDetail
    {
        uint timestamp;
        string owner;
    }
    
    mapping (string => FileDetail) files;
    
    event logFileAddedStatus(bool status,uint timestamp,string owner,string fileHash);
    
    function set(string owner,string fileHash) public
    {
        if(files[fileHash].timestamp == 0)
        {
            files[fileHash] = FileDetail(block.timestamp,owner);
            emit logFileAddedStatus(true,block.timestamp,owner,fileHash);
        }
        else
        {
            emit logFileAddedStatus(false,block.timestamp,owner,fileHash);
        }
    }
    
    //constant 当用constant修饰之后，此方法在被调用时不会进行存储的变更，同样不会产生交易和gas花费
    function get(string fileHash) public constant returns (uint timestamp,string owner)
    {
        return (files[fileHash].timestamp, files[fileHash].owner);
    }
}