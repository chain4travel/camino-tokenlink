import { createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../index";
import { ethers, providers } from "ethers";
import {
  getCoinlinkFactoryBalance,
  getCoinlinkFactoryInitialAmount,
  getDeployedCoinlinks,
  getWalletNfts,
} from "../services/web3Service";
import { setBalance, setCoinLinks, setInitialAmount } from "./wallet";
import { RootState } from ".";

const connectWallet = createAsyncThunk(
  "connectWallet",
  async (_, { getState, dispatch }) => {
    console.log("tagneee");
    const state: any = getState();
    try {
      const initialAmount = await getCoinlinkFactoryInitialAmount(
        state.web3Resources.signer
      );
      dispatch(setInitialAmount(ethers.utils.formatEther(initialAmount)));
      const balance = await getCoinlinkFactoryBalance(
        state.web3Resources.provider
      );
      dispatch(setBalance(ethers.utils.formatEther(balance)));
      const nfts = await getWalletNfts(
        state.web3Resources.signer,
        state.web3Resources.provider.account
      );
      // dispatch(set)
      const coinlinks = await getDeployedCoinlinks(state.web3Resources.signer);
      dispatch(setCoinLinks(coinlinks));
      return { initialAmount, balance, nfts, coinlinks };
    } catch (e) {
      console.log(e);
    }
  }
);

export const connectWeb3 = createAsyncThunk(
  "web3Resources",
  async (_, thunkAPI) => {
    const instance = await store.getState().web3Resources.web3Modal?.connect();
    const _provider = new providers.Web3Provider(instance);
    const signer = await _provider.getSigner();
    const account = await signer.getAddress();
    thunkAPI.dispatch(connectWallet);
    return { provider: _provider, signer, account };
  }
);
