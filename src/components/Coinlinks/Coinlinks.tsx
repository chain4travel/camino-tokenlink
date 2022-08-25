import React from 'react';
import './Coinlinks.css';
import {ethers} from "ethers";
import {Link} from "react-router-dom";

interface CoinlinksParams {
    coinlinks: ethers.Contract[];
}

const Coinlinks = (params: CoinlinksParams) => {
    return (
        <nav>
            {params.coinlinks.map((coinlink: ethers.Contract, index: number) =>
                <Link className={'m-5'} key={index} to={`/coinlinks/${coinlink.address}`}>OTA #{index + 1}</Link>
            )}
        </nav>
    )
};

export default Coinlinks;
