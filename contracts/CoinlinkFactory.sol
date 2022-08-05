// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Coinlink.sol";

contract CoinlinkFactory is Initializable {
    using Counters for Counters.Counter;

    Counters.Counter private coinlinkIds;
    Coinlink[] public coinlinks;
    IERC20 public camToken;
    mapping(uint256 => uint256) public vars;
    uint8 public constant VAR_INITIAL_AMOUNT = 0;

    event Deploy(address addr);

    function initialize(address _camToken) public initializer {
        camToken = IERC20(_camToken);
        vars[VAR_INITIAL_AMOUNT] = 1000 ether;
    }

    function deploy(uint _initialAmount) public {
        coinlinkIds.increment();
        Coinlink _contract = new Coinlink{salt : bytes32(coinlinkIds.current())}(msg.sender, _initialAmount);
        camToken.transfer(address(_contract), vars[VAR_INITIAL_AMOUNT]);
        coinlinks.push(_contract);
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

    function getLastDeployed() public view returns (Coinlink) {
        return coinlinks[coinlinks.length - 1];
    }

}
