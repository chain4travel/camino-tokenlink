// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Coinlink.sol";

contract CoinlinkFactory is Initializable {

    IERC20 public camToken;
    uint public initialAmount = 100 ether;

    event Deploy(address addr);

    function deploy(uint _salt) public {
        Coinlink _contract = new Coinlink{salt : bytes32(_salt)}(msg.sender);
        camToken.transfer(address(_contract), initialAmount);
        emit Deploy(address(_contract));
    }

    function setCamTokenAddress(address _camToken) public {
        camToken = IERC20(_camToken);
    }

    function getAddress(bytes memory bytecode, uint _salt) public view returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(bytecode)));
        return address(uint160(uint(hash)));
    }

    function getBytecode(address _owner) public pure returns (bytes memory) {
        bytes memory bytecode = type(Coinlink).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_owner));
    }

}
