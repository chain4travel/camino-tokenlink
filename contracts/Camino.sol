// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Camino is ERC20 {
    constructor() ERC20("Camino", "CAM") {
        _mint(address(this), 1000000 * (10 ** uint256(decimals())));
        _approve(address(this), msg.sender, totalSupply());
    }
}
