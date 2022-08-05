// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Account.sol";

contract Coinlink {
    using Counters for Counters.Counter;

    Counters.Counter private accountIds;
    address public owner;
    IERC20 public camToken;
    mapping(uint256 => uint256) public vars;
    uint8 public constant VAR_INITIAL_AMOUNT = 0;
    uint8 public constant VAR_REVIEW_REWARD = 1;

    event Deploy(address addr);

    constructor(address _owner, uint _initialAmount) {
        owner = _owner;
        vars[VAR_INITIAL_AMOUNT] = _initialAmount;
    }

    function deploy() public {
        accountIds.increment();
        Account _contract = new Account{salt : bytes32(accountIds.current())}(msg.sender);
        camToken.transfer(address(_contract), vars[VAR_INITIAL_AMOUNT]);
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
        bytes memory bytecode = type(Account).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_owner));
    }

}
