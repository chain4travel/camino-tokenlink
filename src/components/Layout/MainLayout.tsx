import { Box } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../NavBar";
import SideBar from "../SideBar";
import { SideBarProps } from "../SideBar";

const MainLayout: FC<SideBarProps> = ({
  coinlinks,
  initialAmount,
  factoryBalance,
  onDeployCoinlink,
}) => {
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
