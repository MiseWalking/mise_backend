import * as testRepository from "./test.repository.js";

// 전체 조회
export const getTweets = async (req, res) => {
  const { username } = req.query;
  const tempTweets = username
    ? await testRepository.getAllTweetsByUsername(username)
    : await testRepository.getAllTweets();

  res.status(200).json(tempTweets);
};

// 상세 조회
export const getTweet = async (req, res) => {
  const { id } = req.params;
  const tweet = await testRepository.getTweetById(id);

  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ status: 404, message: `id ${id} NOT FOUND` });
  }
};

// 트윗 생성
export const createTweet = async (req, res) => {
  await testRepository.createTweet(req.body);

  res.sendStatus(201);
};

// 트윗 수정
export const updateTweet = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const tweet = await testRepository.updateTweet(id, text);

  if (tweet) {
    tweet.text = text;

    res.status(200).json(tweet);
  } else {
    res.status(404).json({ status: 404, message: `id ${id} NOT FOUND` });
  }
};

// 트윗 삭제
export const deleteTweet = async (req, res) => {
  const { id } = req.params;
  const deleteResult = await testRepository.deleteTweet(id);

  if (deleteResult) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ status: 404, message: `id ${id} NOT FOUND` });
  }
};
