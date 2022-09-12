import { Box } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";
import SideBar from "../SideBar";
import { SideBarProps } from "../SideBar";
import { getAccount, getSigner, getProvider } from "../../store/web3-config";
import Home from "../../pages/Home";
import { useAppSelector } from "../../store";

const MainLayout: FC<SideBarProps> = ({
  coinlinks,
  initialAmount,
  factoryBalance,
  onDeployCoinlink,
}) => {
  const signer = useAppSelector(getSigner);
  const account = useAppSelector(getAccount);
  const provider = useAppSelector(getProvider);
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
