// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Account is IERC721Receiver {
    address public owner;
    mapping(address => uint[]) private nfts;

    event CurrencyReceived(address, uint);
    event NftReceived(address, address, address, uint, bytes);

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
        emit CurrencyReceived(msg.sender, msg.value);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
        nfts[msg.sender].push(tokenId);
        emit NftReceived(operator, from, msg.sender, tokenId, data);
        return IERC721Receiver.onERC721Received.selector;
    }

    function changeOwner(address newOwner) public restricted {
        owner = newOwner;
    }

    function retrieveNfts(address nftAddress) public restricted {
        for (uint i = 0; i < nfts[nftAddress].length; i++) {
            uint256 nft = nfts[nftAddress][nfts[nftAddress].length - 1];
            nfts[nftAddress].pop();
            ERC721(nftAddress).transferFrom(address(this), msg.sender, nft);
        }
    }

    // VIEWS
    function getNfts(address nft) public view returns (uint256[] memory nftIds) {
        return nfts[nft];
    }

    //    function withdraw() restricted public {
    //        owner.transfer(address(this).balance);
    //    }
}
