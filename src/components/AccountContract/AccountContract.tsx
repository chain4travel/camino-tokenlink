import React, {FC, useEffect, useState} from 'react';
import './AccountContract.css';
import {ethers, providers} from "ethers";
import {Card, CardContent, Typography} from "@mui/material";
import Web3Modal from "web3modal";

interface AccountContractProps {
    accountContract: ethers.Contract;
    web3Modal: Web3Modal;
}

const AccountContract: FC<AccountContractProps> = (props) => {
    const [owner, setOwner] = useState('');
    const [balance, setBalance] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const varOwner = await props.accountContract.owner();
            setOwner(varOwner);
            await fetchBalance();
        }
        fetchData().catch(console.error);
    }, []);

    const fetchBalance = async () => {
        const provider = new providers.Web3Provider(await props.web3Modal.connect());
        const balance = await provider.getBalance(props.accountContract.address);
        setBalance(ethers.utils.formatEther(balance));
    }

    return (
        <Card className={'bg-black'}>
            <CardContent>
                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                    Owner: {owner}
                </Typography>
                <Typography variant="h5" component="div">
                    Account
                </Typography>
                <Typography sx={{mb: 1.5}} color="text.secondary">
                    {props.accountContract.address}
                </Typography>
                <Typography variant="body2">
                    Balance: {balance} CAM
                </Typography>
            </CardContent>
        </Card>
    )
};

export default AccountContract;
