import { createSlice } from "@reduxjs/toolkit";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnect from "@walletconnect/web3-provider";
// import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { connectWeb3 } from "./utils";
import { RootState } from ".";
// import { RootState } from "./index";

export interface AdminPanelProps {
  coinlinks: any[];
  //   setCoinlinks: any;
  balance: string;
  //   setBalance: any;
  initialAmount: string;
  //   setInitialAmount: any;
}
let initialState: AdminPanelProps = {
  coinlinks: [],
  balance: "",
  initialAmount: "",
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setBalance(state, action) {
      state.balance = action.payload;
    },
    setCoinLinks(state, action) {
      state.coinlinks = [...action.payload];
    },
    setInitialAmount(state, action) {
      state.initialAmount = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(connectWeb3.pending, (state, action) => {
      console.log(action);
    });
    builder.addCase(
      connectWeb3.fulfilled,
      (state, { payload: { provider, signer, account } }) => {
        // state.account = account;
        // state.provider = provider;
        // state.signer = signer;
      }
    );
    builder.addCase(connectWeb3.rejected, (state, action) => {
      console.log(action);
    });
  },
});

// Select Signer
export const getSigner = (state: RootState) => state.web3Resources.signer;
// Select Provider
export const getProvider = (state: RootState) => state.web3Resources.provider;
// Select Account
export const getAccount = (state: RootState) => state.web3Resources.account;

export const { setBalance, setCoinLinks, setInitialAmount } =
  walletSlice.actions;
export default walletSlice.reducer;
