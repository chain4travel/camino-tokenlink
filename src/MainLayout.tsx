import HomeIcon from "@mui/icons-material/HomeOutlined";
import { Box } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { SideBarProps } from "./components/SideBar";

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
