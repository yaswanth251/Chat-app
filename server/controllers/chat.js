import {
  ALERT,
  NEW_MESSAGE_ALERT,
  NEW_MESSSAGE,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import {
  deleteFilesFromcloudinary,
  emitEvent,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { v4 as uuid } from "uuid";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  if (members.length < 2) {
    return next(new ErrorHandler("Group chat must have at least 3 members"));
  }
  const allMembers = [...members, req.user];
  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });
  emitEvent(
    req,
    ALERT,
    allMembers,
    `Welcom to ${name} group
    `
  );
  emitEvent(req, REFETCH_CHATS, members);
  return res.status(201).json({
    success: true,
    message: "Group Created",
  });
});
const getMyChat = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name  avatar"
  );
  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMember(members, req.user);
    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((accum, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          accum.push(curr._id);
        }
        return accum;
      }, []),
    };
  });
  return res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", " name avatar");
  const groups = chats.map(({ members, _id, groupChat, name }) => {
    return {
      _id,
      name,
      groupChat,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    };
  });

  return res.status(200).json({
    success: true,
    groups,
  });
});
const addmembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;
  if (!members || members.length < 1) {
    return next(new ErrorHandler("Please provide members", 400));
  }
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a groupChat", 400));
  if (chat.creator.toString() !== req.user.toString()) {
    // console.log(chat.creator, req.user);
    return next(new ErrorHandler("you are not allowed to add members", 403));
  }
  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));
  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers.map((i) => i._id));
  if (chat.members.length > 100) {
    return next(new ErrorHandler("Group members limit reached", 400));
  }
  await chat.save();
  const allUsersName = allNewMembers.map((i) => i.name).join(",");
  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added in the group`
  );
  emitEvent(req, REFETCH_CHATS, chat.members);
  return res.status(200).json({
    success: true,
    message: "Members added succesfully",
  });
});
const removeMember = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;
  const [chat, userThatWillBeRemoved] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a groupChat", 400));
  if (chat.creator.toString() !== req.user.toString()) {
    // console.log(chat.creator, req.user);
    return next(new ErrorHandler("you are not allowed to remove members", 403));
  }
  if (chat.members.length <= 3) {
    return next(new ErrorHandler("Group must atleast have 3 members", 400));
  }
  const allChatMembers = chat.members.map((i) => i.toString());
  chat.members = chat.members.filter(
    (member) => member._id.toString() !== userId.toString()
  );
  await chat.save();
  emitEvent(
    req,
    ALERT,
    chat.members,
    {
      message: `${userThatWillBeRemoved.name} has been removed from the group`,
      chatId,
    }
  );
  emitEvent(req, REFETCH_CHATS, allChatMembers);
  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});
const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group  chat", 400));
  }
  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );
  if (remainingMembers.length < 3) {
    return next(new ErrorHandler("Group must have at least 3 members", 400));
  }

  if (chat.creator.toString() === req.user.toString()) {
    const newCreator = remainingMembers[0];
    chat.creator = newCreator;
  }
  chat.members = remainingMembers;
  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);
  emitEvent(req, ALERT, chat.members,
    {
      message: `${user.name} has left the group`,
      chatId,
    }
  );
  return res.status(200).json({
    success: true,
    message: "Group Left successfully",
  });
});
const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];
  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);
  if (!chat || !me) return next(new ErrorHandler("chat not found", 404));
  if (files.length < 1) {
    return next(new ErrorHandler("Please Upload attachments", 400));
  }
  if (files.length > 5)
    return next(new ErrorHandler("Files can't be more than 5", 400));
  //upload files here
  const attachments = await uploadFilesToCloudinary(files);
  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };
  // console.log(messageForDB);
  const messageForRealTime = {
    ...messageForDB,
    _id: uuid(),
    sender: {
      _id: me._id,
      name: me.name,
    },
    createdAt: new Date().toISOString(),
  };
  const message = await Message.create(messageForDB);
  emitEvent(req, NEW_MESSSAGE, chat.members, {
     messageForRealTime,
    chatId,
  });
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
    chatId,
  });
  return res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();
    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    const userFound = chat.members.find(
      (member) => member._id.toString() === req.user.toString()
    );
    if (!userFound) {
      return next(new ErrorHandler("Not Permitted to access this route", 403));
    }
    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));
    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    const userFound = chat.members.find(
      (member) => member.toString() === req.user.toString()
    );
    if (!userFound) {
      return next(new ErrorHandler("Not Permitted to access this route", 403));
    }
    if (!chat) return next(new ErrorHandler("Chat not found", 404));
    return res.status(200).json({ success: true, chat });
  }
});

const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) {
    return next(new ErrorHandler("This is not a group chat", 400));
  }
  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not allowed to rename the group", 403)
    );
  }
  chat.name = name;
  await chat.save();
  emitEvent(res, REFETCH_CHATS, chat.members);
  return res
    .status(200)
    .json({ success: true, message: "Grop renamed successfully" });
});
const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler("You are not allowed to rename the group", 403)
    );
  }
  if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
    return next(
      new ErrorHandler("You are not allowed to delete the chat", 403)
    );
  }
  //here we have to delete all messages as well as attachments or files from the cloudinary
  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });
  const public_ids = [];
  messagesWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => public_ids.push(public_id));
  });
  await Promise.all([
    deleteFilesFromcloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);
  emitEvent(req, REFETCH_CHATS, chat.members);
  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessages = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { page = 1 } = req.query;
  const limit = 20;
  const skip = (page - 1) * limit;
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat Not Found", 404));
  if (!chat.members.includes(req.user.toString())) {
    return next(
      new ErrorHandler("You are not allowed to access this chat", 403)
    );
  }
  const [messages, totalMessagesCount] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name ")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);
  const totalPages = Math.ceil(totalMessagesCount / limit) || 0;
  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});
export {
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
};
