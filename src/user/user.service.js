import * as userRepository from "./user.repository.js";

/**
 * @swagger
 *
 * /signup:
 *   post:
 *     tags:
 *      - User
 *     summary: User signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Signup successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: Username is already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 message:
 *                   type: string
 */
export async function signup(req, res) {
  const { username, password } = req.body;

  const isUsernameTaken = await userRepository.findByUsername(username);
  if (isUsernameTaken) {
    return res
      .status(409)
      .json({ success: false, message: "The username is already taken" });
  }

  await userRepository.createUser({
    username,
    password,
    name,
    email,
    url,
  });

  res.status(201).json({ message: "Signup successful" });
}

/**
 * @swagger
 *
 * /login:
 *   post:
 *     tags:
 *      - User
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 message:
 *                   type: string
 */
export async function login(req, res) {
  const { username, password } = req.body;

  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  const isValidPassword = password === user.password;
  if (!isValidPassword) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  res.status(200).json({ success: true, message: "Login successful" });
}

/**
 * @swagger
 *
 * /user-info:
 *   post:
 *     tags:
 *      - User
 *     summary: Create user information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               gender:
 *                 type: string
 *               height:
 *                 type: number
 *               objective:
 *                 type: string
 *             required:
 *               - username
 *               - name
 *               - age
 *               - gender
 *               - height
 *               - objective
 *     responses:
 *       201:
 *         description: User information created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: true
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   default: false
 *                 message:
 *                   type: string
 */
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

export async function getUserInfo(req, res) {
  try {
    const { username } = req.params;

    const user = await userRepository.findByUsername(username);

    // 인증 체크
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 유저 정보 반환
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error retrieving user information:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function updateUserInfo(req, res) {
  try {
    const { username } = req.params;
    const { name, age, gender, height, objective } = req.body;

    const user = await userRepository.findByUsername(username);

    // 인증 체크
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 유저 정보 업데이트
    user.name = name || user.name;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.height = height || user.height;
    user.objective = objective || user.objective;

    await user.save();

    // 응답 반환
    res
      .status(200)
      .json({ success: true, message: "User information updated" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
