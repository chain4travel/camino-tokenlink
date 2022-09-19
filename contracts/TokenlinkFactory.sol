// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Tokenlink.sol";

contract TokenlinkFactory is Initializable {
    using Counters for Counters.Counter;

    address public owner;
    Counters.Counter private tokenlinkIds;
    Tokenlink[] public tokenlinks;
    mapping(uint256 => uint256) public vars;
    uint8 public constant VAR_INITIAL_AMOUNT = 0;

    event Deploy(address addr);
    event CurrencyReceived(address, uint);

    function initialize() public initializer {
        owner = msg.sender;
        vars[VAR_INITIAL_AMOUNT] = 5 ether;
    }

    modifier restricted() {
        _restricted();
        _;
    }

    function _restricted() internal view {
        require(owner == msg.sender, "Not owner");
    }

    receive() external payable {
        emit CurrencyReceived(msg.sender, msg.value);
    }

    function deploy() public restricted {
        tokenlinkIds.increment();
        Tokenlink _contract = new Tokenlink{salt : bytes32(tokenlinkIds.current())}(msg.sender, vars[VAR_INITIAL_AMOUNT]);
        payable(_contract).transfer(vars[VAR_INITIAL_AMOUNT]);
        tokenlinks.push(_contract);
        emit Deploy(address(_contract));
    }

    function setVar(uint _key, uint _value) public restricted {
        vars[_key] = _value;
    }

    // VIEWS

    function getAddress(bytes memory bytecode, uint _salt) public view returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode)));
        return address(uint160(uint(hash)));
    }

    function getBytecode(address _owner) public pure returns (bytes memory) {
        bytes memory bytecode = type(Tokenlink).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_owner));
    }

    function getDeployedContracts() public view returns (address[] memory addresses) {
        addresses = new address[](tokenlinks.length);
        for (uint i = 0; i < tokenlinks.length; i++) {
            addresses[i] = address(tokenlinks[i]);
        }
        return addresses;
    }

    function getLastDeployed() public view returns (address) {
        return address(tokenlinks[tokenlinks.length - 1]);
    }

}
