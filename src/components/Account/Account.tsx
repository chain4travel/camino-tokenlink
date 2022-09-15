import React, {useEffect, useState} from 'react';
import './Account.css';
import {useParams} from "react-router-dom";
import {BigNumber, ethers} from "ethers";
import {changeAccountOwner, getNfts, retrieveNfts} from "../../services/web3Service";
import {Button, Divider, FormControl, TextField, Typography} from "@mui/material";
import account from '@coinlink/contracts/Account.json';
import {useWeb3} from "../../Web3ModalContext";
// @ts-ignore
import Identicon from 'react-identicons';
import NftDisplay from "../NftDisplay/NftDisplay";

const Account = () => {
    const web3 = useWeb3();
    const params = useParams();
    const [owner, setOwner] = useState('');
    const [newOwner, setNewOwner] = useState('');
    const [balance, setBalance] = useState('');
    const [nfts, setNfts] = useState([]);
    const [accountContract, setAccountContract] = useState<ethers.Contract>(new ethers.Contract(params.address as string, account.abi, web3.provider));

    useEffect(() => {
        const fetchData = async () => {
            await web3.connect();
        };
        fetchData().catch(console.error);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!web3.signer || !web3.provider || !web3.account) return;
            try {
                setAccountContract(new ethers.Contract(params.address as string, account.abi, web3.signer));
                await fetchOwner();
                await fetchBalance();
                await fetchNfts();
            } catch (error) {
                console.error(error);
            }
        };
        fetchData().catch(console.error);
    }, [web3, params.address]);

    const fetchBalance = async () => {
        if (!web3.provider) return;
        const balance = await web3.provider.getBalance(accountContract.address);
        setBalance(ethers.utils.formatEther(balance));
    }

    const fetchNfts = async () => {
        const nfts = await getNfts(accountContract);
        setNfts(nfts.map((nft: BigNumber) => nft.toString()));
    }

    const fetchOwner = async () => {
        const varOwner = await accountContract.owner();
        setOwner(varOwner);
    }

    const onRetrieveNfts = async () => {
        const result = await retrieveNfts(accountContract);
        console.log(result);
        await fetchNfts();
    }

    const onChangeOwner = async () => {
        await changeAccountOwner(accountContract, newOwner);
        await fetchOwner();
    }

    const handleOwnerChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewOwner(event.target.value);
    }

    return (
        <div className="flex flex-col items-start text-white gap-3 mx-5 flex-1" key={params.address}>
            <Typography variant="h5">Account</Typography>
            <Typography variant="body1" className='green-text uppercase'>Address</Typography>
            <Typography variant="body1">
                {accountContract.address}
            </Typography>
            <Typography variant="body1" className='green-text uppercase'>
                Owner
            </Typography>
            <Typography variant="body1">{owner}</Typography>
            <FormControl className="w-full">
                <TextField placeholder='e.g. 0xa218...77e8' label="New owner" value={newOwner}
                           onChange={handleOwnerChange} fullWidth
                           sx={{
                               color: 'white',
                               backgroundColor: '#1E293B',
                           }}/>
                <Button onClick={onChangeOwner} disabled={!ethers.utils.isAddress(newOwner)} variant={'contained'}>Change
                    Owner</Button>
            </FormControl>
            <Divider className="divider" flexItem/>
            <Typography variant="h5">Balances</Typography>
            <div className='flex w-full gap-10'>
                <div className='flex flex-col items-start'>
                    <Typography variant="body1" className='green-text uppercase'>Balance</Typography>
                    <Typography variant="body1" className='uppercase'>{balance} CAM</Typography>
                </div>
            </div>
            {nfts.length > 0 && (
                <div>
                    <Typography variant="body1" className="green-text uppercase">
                        Account NFTs
                    </Typography>
                    <div className={"flex gap-3 m-2 justify-start flex-wrap w-full"}>
                        {nfts.map((nft, index) => (
                            <NftDisplay key={index} nft={nft}/>
                        ))}
                    </div>
                    <div className='flex w-full gap-10'>
                        <Button className={'whitespace-nowrap'} variant="contained" onClick={onRetrieveNfts}
                                disabled={nfts.length === 0}>Retrieve Nfts</Button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default Account;
