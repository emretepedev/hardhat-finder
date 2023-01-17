// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ExampleLibrary.sol";

contract Example {
    using ExampleLibrary for uint256;

    function srcFoo(uint256 and) external pure returns (uint256) {
        return and.srcBar();
    }
}
