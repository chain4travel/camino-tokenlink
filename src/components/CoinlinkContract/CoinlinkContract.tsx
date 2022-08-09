import React, {FC, useEffect, useState} from 'react';
import './CoinlinkContract.css';
import {ethers} from "ethers";
import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {deployAccount} from "../../services/web3Service";

interface CoinlinkContractProps {
    coinlinkContract: ethers.Contract;
}

const CoinlinkContract: FC<CoinlinkContractProps> = (props) => {
    const [initialAmount, setInitialAmount] = useState('');
    const [reviewReward, setReviewReward] = useState('');
    const [owner, setOwner] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const varInitialAmount = await props.coinlinkContract.vars(0);
            setInitialAmount(ethers.utils.formatEther(varInitialAmount));
            const varReviewReward = await props.coinlinkContract.vars(1);
            setReviewReward(ethers.utils.formatEther(varReviewReward));
            const varOwner = await props.coinlinkContract.owner();
            setOwner(varOwner);
        }
        fetchData().catch(console.error);
    }, []);

    const onDeployAccount = async () => {
        const result = await deployAccount(props.coinlinkContract);
        console.log(result);
    }

    return (
        <Card>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    Owner: {owner}
                </Typography>
                <Typography variant="h5" component="div">
                    Coinlink
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    {props.coinlinkContract.address}
                </Typography>
                <Typography variant="body2">
                    Initial amount: {initialAmount} CAM
                    <br/>
                    Review reward: {reviewReward} CAM
                    <br/>
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onDeployAccount}>Deploy Account</Button>
            </CardActions>
        </Card>
    )
};

export default CoinlinkContract;
