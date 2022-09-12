import { Box } from "@mui/material";
import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";
import SideBar from "../SideBar";
import { SideBarProps } from "../SideBar";
import { getAccount, getSigner, getProvider } from "../../store/web3-config";
import Home from "../../pages/Home";
import { useAppDispatch, useAppSelector } from "../../store";
import { connectWallet } from "../../store/utils";

const MainLayout: FC<SideBarProps> = ({
  coinlinks,
  initialAmount,
  factoryBalance,
  onDeployCoinlink,
}) => {
  const dispatch = useAppDispatch();
  const signer = useAppSelector(getSigner);
  const account = useAppSelector(getAccount);
  const provider = useAppSelector(getProvider);
  useEffect(() => {
    if (account) dispatch(connectWallet());
  }, [account]);
  if (!provider || !account || !signer)
    return (
      <>
        <NavBar />
        <Home />
      </>
    );
  return (
    <>
      <NavBar />
      <Box sx={{ display: "flex" }}>
        <SideBar
          coinlinks={coinlinks}
          initialAmount={initialAmount}
          factoryBalance={factoryBalance}
          onDeployCoinlink={onDeployCoinlink}
        />
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;
