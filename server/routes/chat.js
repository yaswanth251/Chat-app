import express from "express";
import {
  addmembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChat,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachmentsValidator,
  validateHandler,
} from "../lib/validators.js";
import isAuthenticated from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

app.use(isAuthenticated);

//authenticated routes
app.post("/new", newGroupValidator(), validateHandler, newGroupChat);
app.get("/my", getMyChat);
app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMemberValidator(), validateHandler, addmembers);
app.put(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMember
);
app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);
//send attachment
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validateHandler,
  sendAttachments
);
//get messages
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);
//get chat details , rename , delete ,
app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameValidator(), validateHandler,renameGroup)
  .delete(chatIdValidator(), validateHandler,deleteChat);
export default app;
