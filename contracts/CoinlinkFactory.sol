// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Coinlink.sol";

contract CoinlinkFactory is Initializable {
    using Counters for Counters.Counter;
    event Received(address, uint);

    Counters.Counter private coinlinkIds;
    Coinlink[] public coinlinks;
    mapping(uint256 => uint256) public vars;
    uint8 public constant VAR_INITIAL_AMOUNT = 0;

    event Deploy(address addr);

    function initialize() public initializer {
        vars[VAR_INITIAL_AMOUNT] = 5 ether;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    function deploy(uint _initialAmount) public {
        coinlinkIds.increment();
        Coinlink _contract = new Coinlink{salt : bytes32(coinlinkIds.current())}(msg.sender, _initialAmount);
        payable(_contract).transfer(vars[VAR_INITIAL_AMOUNT]);
        coinlinks.push(_contract);
        emit Deploy(address(_contract));
    }

    function setVar(uint _key, uint _value) public {
        vars[_key] = _value;
    }

    // VIEWS

    function getAddress(bytes memory bytecode, uint _salt) public view returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode)));
        return address(uint160(uint(hash)));
    }

    function getBytecode(address _owner) public pure returns (bytes memory) {
        bytes memory bytecode = type(Account).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_owner));
    }

    function getDeployedContracts() public view returns (address[] memory addresses) {
        addresses = new address[](coinlinks.length);
        for (uint i = 0; i < coinlinks.length; i++) {
            addresses[i] = address(coinlinks[i]);
        }
        return addresses;
    }

    function getLastDeployed() public view returns (address) {
        return address(coinlinks[coinlinks.length - 1]);
    }

}
