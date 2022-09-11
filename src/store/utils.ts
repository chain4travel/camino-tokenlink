import { createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../index";
import { ethers, providers } from "ethers";

interface web3ResourcesType {
  provider?: providers.Web3Provider;
  signer?: ethers.Signer;
  account?: string;
}

export const connectWeb3 = createAsyncThunk("web3Resources", async () => {
  const instance = await store.getState().web3Resources.web3Modal?.connect();
  const _provider = new providers.Web3Provider(instance);
  const signer = await _provider.getSigner();
  const account = await signer.getAddress();
  return { provider: _provider, signer, account };
});
