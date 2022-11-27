// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ExampleLibrary.sol";

contract Example {
    using ExampleLibrary for uint256;

    function foo(uint256 and) external pure returns (uint256) {
        return and.bar();
    }
}
