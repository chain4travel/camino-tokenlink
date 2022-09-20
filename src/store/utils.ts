import {createAsyncThunk} from '@reduxjs/toolkit'
import {store} from '../index'
import {BigNumber, ethers, providers} from 'ethers'
import {
    getOwnedAccounts,
    getOwnedTokenlinks,
    getTokenlinkFactoryBalance,
    getTokenlinkFactoryInitialAmount,
    getWalletNfts, isTokenlinkFactoryAdmin,
} from '../services/web3Service'
import {setAccounts, setBalance, setInitialAmount, setIsAdmin, setNfts, setTokenlinks} from './wallet'

export const connectWallet = createAsyncThunk(
    'connectWallet',
    async (_, {getState, dispatch}) => {
        const state: any = getState()
        try {
            const initialAmount = await getTokenlinkFactoryInitialAmount(
                state.web3Resources.signer
            )
            dispatch(setInitialAmount(ethers.utils.formatEther(initialAmount)))
            const balance = await getTokenlinkFactoryBalance(
                state.web3Resources.provider
            )
            dispatch(setBalance(ethers.utils.formatEther(balance)))
            const nfts = await getWalletNfts(
                state.web3Resources.signer,
                state.web3Resources.account
            )
            dispatch(setNfts(nfts.map((nft: BigNumber) => nft.toString())));
            const tokenlinks = await getOwnedTokenlinks(
                state.web3Resources.signer
            )
            dispatch(setTokenlinks(tokenlinks))
            const accounts = await getOwnedAccounts(
                state.web3Resources.signer
            )
            dispatch(setAccounts(accounts))
            const isAdmin = await isTokenlinkFactoryAdmin(state.web3Resources.signer);
            dispatch(setIsAdmin(isAdmin))
        } catch (e) {
            console.error(e)
        }
    }
)

export const connectWeb3 = createAsyncThunk(
    'web3Resources',
    async (_, thunkAPI) => {
        const instance = await store
            .getState()
            .web3Resources.web3Modal?.connect()
        const _provider = new providers.Web3Provider(instance)
        const signer = await _provider.getSigner()
        const account = await signer.getAddress()
        thunkAPI.dispatch(connectWallet)
        return {provider: _provider, signer, account}
    }
)
