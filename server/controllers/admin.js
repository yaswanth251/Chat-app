import jwt from "jsonwebtoken";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/features.js";
import { adminSecretKey } from "../app.js";

const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;
  const isMatched = secretKey === adminSecretKey;
  if (!isMatched) {
    return next(new ErrorHandler("Invalid adminkey", 401));
  } else {
    const token = jwt.sign(secretKey, process.env.JWT_SECRET);
    return res
      .status(200)
      .cookie("chat-admin-token", token, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60,
      })
      .json({
        success: true,
        message: "Authentication successful, Welcome ",
      });
  }
});

const getAdminData = TryCatch(async (req, res, next) => {
  return res.status(200).json({ admin: true });
});

const allUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  const transformedUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id, createdAt }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);
      return {
        name,
        username,
        _id,
        avatar: avatar.url,
        groups,
        friends,
        createdAt: createdAt.toLocaleDateString(),
      };
    })
  );
  return res.status(200).json({
    status: "success",
    transformedUsers,
  });
});

const allChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });

      return {
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => {
          return {
            _id,
            name,
            avatar: avatar.url,
          };
        }),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar.url || "",
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );
  return res.status(200).json({
    status: "success",
    chats: transformedChats,
  });
});

const allMessages = TryCatch(async (req, res, next) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  if (!messages.length) {
    return res.status(200).json({ success: true, messages: [] });
  }

  const transformedMessages = messages.map(
    ({ content, attachments, _id, sender, createdAt, chat }) => ({
      content,
      _id,
      attachments,
      createdAt,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar?.url || null, // Handle possible undefined avatar
      },
      chat: chat?._id || null, // Handle undefined chat
      groupChat: chat?.groupChat || false, // Handle missing groupChat field
    })
  );

  return res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
});


const getDashboardStats = TryCatch(async (req, res, next) => {
  const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);
  const today = new Date();
  const last7days = new Date();
  last7days.setDate(last7days.getDate() - 7);
  const last7daysMessages = await Message.find({
    createdAt: {
      $gte: last7days,
      $lte: today,
    },
  }).select("createdAt");
  const messages = new Array(7).fill(0);
  const dayInMilliSeconds = 1000 * 60 * 60 * 24;
  last7daysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMilliSeconds;
    const index = Math.floor(indexApprox);
    messages[6 - index]++;
  });
  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalChatsCount,
    messagesChart: messages,
  };
  return res.status(200).json({
    success: true,
    stats,
  });
});
const adminLogout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("chat-admin-token", "", {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Logged out successfully ",
    });
});
export {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData,
};
