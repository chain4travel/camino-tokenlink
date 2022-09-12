import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

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
});

// Select Balance
export const getBalance = (state: RootState) => state.wallet.balance;
// Select CoinLinks
export const getCoinLinks = (state: RootState) => state.wallet.coinlinks;
// Select InitialAmount
export const getInitialAmount = (state: RootState) =>
  state.wallet.initialAmount;

export const { setBalance, setCoinLinks, setInitialAmount } =
  walletSlice.actions;
export default walletSlice.reducer;
