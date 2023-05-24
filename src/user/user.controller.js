import express from "express";
import * as userService from "./user.service.js";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";

const userController = express.Router();

const validateSignup = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  validate,
];

const validateLogin = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  validate,
];

userController.post("/signup", validateSignup, userService.signup);
userController.post("/login", validateLogin, userService.login);
userController.post("/", userService.createUserInfo);

export default userController;
