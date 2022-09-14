import {createSlice} from "@reduxjs/toolkit";
import {RootState} from ".";

export interface AdminPanelProps {
    coinlinks: any[];
    accounts: any[];
    nfts: string[];
    //   setCoinlinks: any;
    balance: string;
    //   setBalance: any;
    initialAmount: string;
    //   setInitialAmount: any;
}

let initialState: AdminPanelProps = {
    coinlinks: [],
    accounts: [],
    nfts: [],
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
        setNfts(state, action) {
            state.nfts = [...action.payload];
        },
        setCoinLinks(state, action) {
            state.coinlinks = [...action.payload];
        },
        setAccounts(state, action) {
            state.accounts = [...action.payload];
        },
        setInitialAmount(state, action) {
            state.initialAmount = action.payload;
        },
    },
});

// Select Balance
export const getBalance = (state: RootState) => state.wallet.balance;
// Select CoinLinks
export const getCoinLinks = (state: RootState) => state.wallet.coinlinks;
// Select Accounts
export const getAccounts = (state: RootState) => state.wallet.accounts;
// Select InitialAmount
export const getInitialAmount = (state: RootState) =>
    state.wallet.initialAmount;
// Select Nfts
export const getNfts = (state: RootState) => state.wallet.nfts;

export const {setBalance, setNfts, setCoinLinks, setAccounts, setInitialAmount} =
    walletSlice.actions;
export default walletSlice.reducer;
