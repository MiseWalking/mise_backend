import mongoose from "mongoose";
import { useVirtualId } from "../db/database.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  url: String,
});

useVirtualId(userSchema);
const User = mongoose.model("User", userSchema);

export async function findByUsername(username) {
  return User.findOne({ username });
}

export async function createUser(user) {
  const newUser = new User(user);
  await newUser.save();
  return newUser.id;
}
