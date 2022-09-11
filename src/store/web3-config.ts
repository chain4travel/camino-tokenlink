import { createSlice } from "@reduxjs/toolkit";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
// import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { connectWeb3 } from "./utils";
// import { RootState } from "./index";

interface IWeb3Context {
  provider?: providers.Web3Provider;
  signer?: ethers.Signer;
  account?: string;
  web3Modal?: Web3Modal;
}
let initialState: IWeb3Context = {
  web3Modal: new Web3Modal({
    cacheProvider: true,
    providerOptions: {
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: "Web 3 Modal Demo",
          infuraId: process.env.REACT_APP_INFURA_KEY,
        },
      },
      walletconnect: {
        package: WalletConnect,
        options: {
          infuraId: process.env.REACT_APP_INFURA_KEY,
        },
      },
    },
  }),
};

const web3ConfigSlice = createSlice({
  name: "web3Config",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(connectWeb3.pending, (state, action) => {
      console.log(action);
    });
    builder.addCase(
      connectWeb3.fulfilled,
      (state, { payload: { provider, signer, account } }) => {
        state.account = account;
        state.provider = provider;
        state.signer = signer;
      }
    );
    builder.addCase(connectWeb3.rejected, (state, action) => {
      console.log(action);
    });
  },
});

// export const {} = web3ConfigSlice.actions;
export default web3ConfigSlice.reducer;
