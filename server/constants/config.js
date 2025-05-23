const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL,
  ],
  credentials: true,
};
const myToken = "chat-token";
const adminToken ="chat-admin-token";
export { corsOptions , myToken,adminToken};
