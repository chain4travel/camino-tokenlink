// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract Account {
    address public owner;

    event Received(address, uint);

    constructor(address _owner) {
        owner = _owner;
    }

    modifier restricted() {
        _restricted();
        _;
    }

    function _restricted() internal view {
        require(owner == msg.sender, "Not owner");
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function changeOwner(address newOwner) public restricted {
        owner = newOwner;
    }

    //    function withdraw() restricted public {
    //        owner.transfer(address(this).balance);
    //    }
}
