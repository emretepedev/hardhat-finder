// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ExampleLibrary {
    function bar(uint256 number) public pure returns(uint256) {
        return number ** 2;
    }
}