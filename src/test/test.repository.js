let tweets = [
  {
    id: 1,
    createdAt: new Date().toLocaleString(),
    name: "SeokHyun Yu",
    username: "ysh",
    text: "Hello",
  },
];

export const getAllTweets = async () => {
  return tweets;
};

export const getAllTweetsByUsername = async (username) => {
  return tweets.filter((tweet) => tweet.username === username);
};

export const getTweetById = async (id) => {
  return tweets.find((tweet) => `${tweet.id}` === id);
};

export const createTweet = async ({ name, username, text }) => {
  const newTweet = {
    id: (tweets[0]?.id || 0) + 1,
    createdAt: Date.now().toLocaleString(),
    name,
    username,
    text,
  };

  tweets = [newTweet, ...tweets];

  return tweets;
};

export const updateTweet = async (id, text) => {
  const tweet = tweets.find((tweet) => `${tweet.id}` === id);

  if (tweet) {
    tweet.text = text;
  }

  return tweet;
};

export const deleteTweet = async (id) => {
  const prevLength = tweets.length;

  tweets = tweets.filter((tweet) => `${tweet.id}` !== id);

  return prevLength !== tweets.length;
};
