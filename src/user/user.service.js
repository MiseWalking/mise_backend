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

export async function createUserInfo(req, res) {
  try {
    const { username, name, age, gender, height, objective } = req.body;

    const user = await userRepository.findByUsername(username);

    // 인증 체크
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 요청 형식 검사
    if (!username || !name || !age || !gender || !height || !objective) {
      return res.status(400).json({ success: false, message: "Bad Request" });
    }

    // 유저 정보 입력
    await userRepository.createUserInfo({
      username,
      name,
      age,
      gender,
      height,
      objective,
    });

    res
      .status(201)
      .json({ success: true, message: "User information created" });
  } catch (error) {
    console.error("Error creating user information:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
