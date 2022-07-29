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

//    function initialize(address payable _owner) initializer public {
//        owner = _owner;
//    }
//
//    function withdraw() public {
//        require(owner == msg.sender);
//        owner.transfer(address(this).balance);
//    }
//
//    modifier restricted() {
//        _restricted();
//        _;
//    }
//
//    function _restricted() internal view {
//        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "NA");
//    }

}
