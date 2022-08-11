import React, {FC, useEffect, useState} from 'react';
import './CoinlinkContract.css';
import {ethers, providers} from "ethers";
import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {deployAccount, getDeployedAccounts} from "../../services/web3Service";
import Web3Modal from "web3modal";
import AccountContract from "../AccountContract/AccountContract";

interface CoinlinkContractProps {
    coinlinkContract: ethers.Contract;
    web3Modal: Web3Modal;
}

const CoinlinkContract: FC<CoinlinkContractProps> = (props) => {
    const [initialAmount, setInitialAmount] = useState('');
    const [reviewReward, setReviewReward] = useState('');
    const [balance, setBalance] = useState('');
    const [owner, setOwner] = useState('');
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const varInitialAmount = await props.coinlinkContract.vars(0);
            setInitialAmount(ethers.utils.formatEther(varInitialAmount));
            const varReviewReward = await props.coinlinkContract.vars(1);
            setReviewReward(ethers.utils.formatEther(varReviewReward));
            const varOwner = await props.coinlinkContract.owner();
            setOwner(varOwner);
            await fetchAccounts();
            await fetchBalance();
        }
        fetchData().catch(console.error);
    }, []);

    const fetchBalance = async () => {
        const provider = new providers.Web3Provider(await props.web3Modal.connect());
        const balance = await provider.getBalance(props.coinlinkContract.address);
        setBalance(ethers.utils.formatEther(balance));
    }

    const onDeployAccount = async () => {
        const result = await deployAccount(props.coinlinkContract);
        console.log(result);
        await fetchAccounts();
        await fetchBalance();
    }

    const fetchAccounts = async () => {
        const provider = await props.web3Modal.connect();
        const accounts = await getDeployedAccounts(props.coinlinkContract, provider);
        console.log(accounts);
        setAccounts(accounts);
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
                    Balance: {balance} CAM
                </Typography>
                <div className={'flex flex-col gap-2 m-2 justify-center flex-wrap'}>
                    {accounts.map((account, index) => <AccountContract key={index} accountContract={account}
                                                                       web3Modal={props.web3Modal}/>)}
                </div>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onDeployAccount}>Deploy Account</Button>
                <Button size="small" onClick={fetchAccounts}>Fetch Accounts</Button>
            </CardActions>
        </Card>
    )
};

export default CoinlinkContract;
