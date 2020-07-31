pragma solidity ^0.5.16;

contract Authentication{

    // struct userr{
    //     uint id;
    //     address addr;
    // }

    address public owner;
    modifier _ownerOnly(){

        require(msg.sender == owner,'You are not an ADMIN');
        _;
    }

    constructor() public{
        owner = msg.sender;
        }

    uint private UserCount;

//  creating mapping of user
//  mapping of user id to address
    mapping (address => uint) private UserId;
//  mapping to store users authentication
    mapping (address => bool) private authOrNot;

    function DoAuthenticate (address addr) public  returns(bool){
        UserCount ++;
        UserId[addr] = UserCount;
        authOrNot[addr] = true;

    }

    function RemoveAuthentication(address addr ) public _ownerOnly returns(bool){
        UserCount --;
        UserId[addr] = 0;
        authOrNot[addr] = false;

    }

    function AuthOrNot(address addr) public view returns(bool){
        if(authOrNot[addr] == true){
            return true;
        }
        else {
            return false;
        }
    }

}