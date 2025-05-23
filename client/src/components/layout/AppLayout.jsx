/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigate, useParams } from "react-router-dom";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";
import Grid from "@mui/material/Grid2";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { Drawer, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectDeleteChat,
} from "../../redux/reducers/misc";
import {
  incrementNotifications,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../socket";
import {
  NEW_REQUEST,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
  ONLINE_USERS,
} from "../../constants/events";
import { useCallback, useEffect, useRef, useState } from "react";
import { getOrSaveFromStorage } from "../../lib/features";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const navigate = useNavigate();
    const socket = getSocket();
    const params = useParams();
    const chatId = params.chatId;
    const deletMenuAnchor = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    // console.log(socket.id);
    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const dispatch = useDispatch();
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
    useErrors([{ isError, error }]);
    const handleDeleteChat = (e, chatId, groupChat) => {
      // console.log(e.target , e.currentTarget)
      deletMenuAnchor.current = e.currentTarget;
      dispatch(setSelectDeleteChat({ chatId, groupChat }));
      dispatch(setIsDeleteMenu(true));
      e.preventDefault();
    };
    useEffect(() => {
      // console.log("app layout 1")
      getOrSaveFromStorage({
        key: NEW_MESSAGE_ALERT,
        value: newMessagesAlert,
      });
    }, [newMessagesAlert]);
    const handleMobileClose = () => {
      dispatch(setIsMobile(false));
    };
    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId, dispatch]
    );
    const newRequestListener = useCallback(() => {
      dispatch(incrementNotifications());
    }, [dispatch]);
    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);
    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);
    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };
    useSocketEvents(socket, eventHandlers);
    return (
      <>
        <Title title={"Chat App"} />
        <Header />
        <DeleteChatMenu dispatch={dispatch} deletMenuAnchor={deletMenuAnchor} />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              newMessagesAlert={newMessagesAlert}
              handleDeleteChat={handleDeleteChat}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}
        <Grid container height={"calc(100vh - 4rem)"} spacing={0}>
          <Grid
            size={{ sm: 4, md: 3 }}
            height={"100%"}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}
                handleDeleteChat={handleDeleteChat}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 8, md: 5, lg: 6 }} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            size={{ md: 4, lg: 3 }}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
