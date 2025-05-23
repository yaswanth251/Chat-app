import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { TryCatch } from "./error.js";
import { adminToken, myToken } from "../constants/config.js";
import { User } from "../models/user.js";
const isAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies[myToken];
  if (!token) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }
  const userId = jwt.verify(token, process.env.JWT_SECRET);
  req.user = userId._id;
  next();
});
export const adminOnly = async (req, res, next) => {
  const token = req.cookies[adminToken];
  if (!token) {
    return next(new ErrorHandler("Only admin can access this route", 401));
  }
  const secretKey = jwt.verify(token, process.env.JWT_SECRET);
  const isMatched = secretKey === adminSecretKey;
  if (!isMatched) {
    return next(new ErrorHandler("Invalid adminkey", 401));
  }
  // console.log("admin authenticated", token);
  next();
};
export const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const authToken = socket.request.cookies[myToken];
    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 400));
    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await User.findById(decodedData._id);
    if (!user) return next(new ErrorHandler("User not found", 401));
    socket.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};
export default isAuthenticated;
