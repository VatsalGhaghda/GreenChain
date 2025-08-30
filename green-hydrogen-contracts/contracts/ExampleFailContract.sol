// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ExampleFailContract {
    string public name;
    uint256 public value;
    
    // Constructor with parameters
    constructor(string memory _name, uint256 _value) {
        name = _name;
        value = _value;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}
