// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Account is IERC721Receiver  {
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

    function onERC721Received(address, address, uint256, bytes calldata) pure external override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function changeOwner(address newOwner) public restricted {
        owner = newOwner;
    }

    //    function withdraw() restricted public {
    //        owner.transfer(address(this).balance);
    //    }
}
