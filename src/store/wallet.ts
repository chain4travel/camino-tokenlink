import {createSlice} from "@reduxjs/toolkit";
import {RootState} from ".";

export interface AdminPanelProps {
    tokenlinks: any[];
    accounts: any[];
    nfts: string[];
    //   setTokenlinks: any;
    balance: string;
    //   setBalance: any;
    initialAmount: string;
    //   setInitialAmount: any;
    isAdmin: boolean;
}

let initialState: AdminPanelProps = {
    tokenlinks: [],
    accounts: [],
    nfts: [],
    balance: "",
    initialAmount: "",
    isAdmin: false,
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
        setTokenlinks(state, action) {
            state.tokenlinks = [...action.payload];
        },
        setAccounts(state, action) {
            state.accounts = [...action.payload];
        },
        setInitialAmount(state, action) {
            state.initialAmount = action.payload;
        },
        setIsAdmin(state, action) {
            state.isAdmin = action.payload;
        }
    },
});

// Select Balance
export const getBalance = (state: RootState) => state.wallet.balance;
// Select Tokenlinks
export const getTokenlinks = (state: RootState) => state.wallet.tokenlinks;
// Select Accounts
export const getAccounts = (state: RootState) => state.wallet.accounts;
// Select InitialAmount
export const getInitialAmount = (state: RootState) =>
    state.wallet.initialAmount;
// Select Nfts
export const getNfts = (state: RootState) => state.wallet.nfts;
// Select IsAdmin
export const getIsAdmin = (state: RootState) => state.wallet.isAdmin;

export const {setBalance, setNfts, setTokenlinks, setAccounts, setInitialAmount, setIsAdmin} =
    walletSlice.actions;
export default walletSlice.reducer;
