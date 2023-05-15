import bcrypt from "bcrypt";
import * as userRepository from "./user.repository.js";

export async function signup(req, res) {
  const { username, password } = req.body;

  const isUsernameTaken = await userRepository.findByUsername(username);
  if (isUsernameTaken) {
    return res
      .status(409)
      .json({ success: false, message: "The username is already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userRepository.createUser({
    username,
    password: hashedPassword,
    name,
    email,
    url,
  });

  res.status(201).json({ message: "Signup successful" });
}

export async function login(req, res) {
  const { username, password } = req.body;

  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  res.status(200).json({ success: true, message: "Login successful" });
}
