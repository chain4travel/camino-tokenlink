import React, {FC} from 'react';
import './CoinlinkContract.css';
import {ethers} from "ethers";
import {Button} from "@mui/material";
import {deployAccount} from "../../services/web3Service";

interface CoinlinkContractProps {
    coinlinkContract: ethers.Contract;
}

const CoinlinkContract: FC<CoinlinkContractProps> = (props) => {
    const onDeployAccount = async () => {
        const result = await deployAccount(props.coinlinkContract);
        console.log(result);
    }

    return (
        <div>
            {props.coinlinkContract.address}
            <Button variant="contained" onClick={onDeployAccount}>Deploy Account</Button>
        </div>
    )
};

export default CoinlinkContract;
