import React, {FC, useEffect, useState} from 'react';
import './AccountContract.css';
import {BigNumber, ethers, providers} from "ethers";
import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import Web3Modal from "web3modal";
import {getNfts, retrieveNfts} from "../../services/web3Service";

interface AccountContractProps {
    accountContract: ethers.Contract;
    web3Modal: Web3Modal;
}

const AccountContract: FC<AccountContractProps> = (props) => {
    const [owner, setOwner] = useState('');
    const [balance, setBalance] = useState('');
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const varOwner = await props.accountContract.owner();
            setOwner(varOwner);
            await fetchBalance();
            await fetchNfts();
        }
        fetchData().catch(console.error);
    }, []);

    const fetchBalance = async () => {
        const provider = new providers.Web3Provider(await props.web3Modal.connect());
        const balance = await provider.getBalance(props.accountContract.address);
        setBalance(ethers.utils.formatEther(balance));
    }

    const fetchNfts = async () => {
        const nfts = await getNfts(props.accountContract);
        setNfts(nfts.map((nft: BigNumber) => nft.toString()));
    }

    const onRetrieveNfts = async () => {
        const result = await retrieveNfts(props.accountContract);
        console.log(result);
        await fetchNfts();
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
                <div className={'flex gap-2 m-2 justify-center flex-wrap'}>
                    {nfts.map((nft, index) =>
                        <Card key={index}>
                            <CardContent>
                                <Typography variant="body2">
                                    {nft}
                                </Typography>
                            </CardContent>
                        </Card>)}
                </div>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onRetrieveNfts} disabled={nfts.length === 0}>Retrieve Nfts</Button>
            </CardActions>
        </Card>
    )
};

export default AccountContract;
