/* eslint-disable react/prop-types */
import Grid from "@mui/material/Grid2";
import { grayColor, matBlack } from "../../constants/color";
import {
  Box,
  Drawer,
  IconButton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  Close as CloseIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Groups as GroupsIcon,
  Message as MessageIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../redux/thunks/admin";
export const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "User",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];
const StyledLinkTwo = styled(Link)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;
const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);
  const logoutHandler = () => {
    localStorage.removeItem("adminPath");
    dispatch(logoutAdmin());
  };
  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem("adminPath", location.pathname);
    } 
  }, [location.pathname, isAdmin]);
  return (
    <Stack
      width={w}
      minWidth={"16rem"}
      direction={"column"}
      p={"3rem"}
      spacing={"3rem"}
    >
      <Typography variant="h5" textTransform={"uppercase"}>
        Chat App
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => {
          return (
            <StyledLinkTwo
              key={tab.path}
              to={tab.path}
              sx={
                location.pathname === tab.path && {
                  bgcolor: matBlack,
                  color: "white",
                  ":hover": {
                    color: "white",
                  },
                }
              }
            >
              <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                {tab.icon}
                <Typography>{tab.name}</Typography>
              </Stack>
            </StyledLinkTwo>
          );
        })}
        <StyledLinkTwo onClick={logoutHandler}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon />
            <Typography>Logout</Typography>
          </Stack>
        </StyledLinkTwo>
      </Stack>
    </Stack>
  );
};
const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState();
  const handleMobile = () => {
    setIsMobile(!isMobile);
  };
  const handleClose = () => {
    setIsMobile(false);
  };
  if (!isAdmin) return <Navigate to={"/admin"} />;
  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid
        size={{ md: 4, lg: 3 }}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Sidebar />
      </Grid>
      <Grid
        size={{ xs: 12, md: 8, lg: 9 }}
        sx={{
          bgcolor: grayColor,
          overflowY: "auto",
        }}
        height={"100vh"}
      >
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w={"50vw"} />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
