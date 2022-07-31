// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract Coinlink {

    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier restricted() {
        _restricted();
        _;
    }

    function changeOwner(address newOwner) public restricted {
        owner = newOwner;
    }

    function _restricted() internal view {
        require(owner == msg.sender, "Not owner");
    }

    function withdraw() restricted public {
        require(owner == msg.sender);
        owner.transfer(address(this).balance);
    }
}
