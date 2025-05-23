// avatar = [],
// name,
// _id,
// groupChat = false,
// sameSender,
// isOnline,
// newMessageAlert,
// index = 0,
// handleDeleteChatOpen,

export const sampleChats = [
  {
    avatar: ["https://w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2", "3", "4", "5"],
  },
  {
    avatar: ["https://w3schools.com/howto/img_avatar.png"],
    name: "Johnny Depp",
    _id: "2",
    groupChat: false,
    members: ["1", "2", "3", "4", "5"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://w3schools.com/howto/img_avatar.png"],
    name: "John Doe",
    _id: "1",
  },
  {
    avatar: ["https://w3schools.com/howto/img_avatar.png"],
    name: "Johnny Depp",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: ["https://w3schools.com/howto/img_avatar.png"],
      name: "John Doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://w3schools.com/howto/img_avatar.png"],
      name: "John Depp",
    },
    _id: "2",
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "asdsad",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "L*uda ka Message hai",
    _id: "snfasdfkaf",
    sender: {
      _id: "user._id",
      name: "Chaman",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.6302",
  },
  {
    attachments: [
      {
        public_id: "asdsad",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "L*uda 2 ka Message hai",
    _id: "snfasdfka",
    sender: {
      _id: "adfd",
      name: "Chaman",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.6302",
  },
];

export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "1",
      username: "john doe",
      friends: 20,
      groups: 5,
    },
    {
      name: "Johnny Depp",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "2",
      username: "john doe",
      friends: 20,
      groups: 25,
    },
  ],
  chats: [
    {
      name: "LabadBass Group",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "1",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "3", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creator: {
        name: "John Doe",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
  ],
  messages: [
    {
      attachments: [
        {
          public_id: "asdsad",
          url: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      content: "L*uda ka Message hai",
      _id: "snfasdfkaf",
      groupChat: false,
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Chaman",
      },
      chat: "chatId",
      createdAt: "2024-02-12T10:41:30.6302",
    },
    {
      attachments: [],
      content: "L*uda 2 ka Message hai",
      _id: "snfasdfka",
      groupChat: true,

      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Chaman 2",
      },
      chat: "chatId",
      createdAt: "2024-02-12T10:41:30.6302",
    },
  ],
};
