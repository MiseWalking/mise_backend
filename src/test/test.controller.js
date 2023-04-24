import express from "express";
import * as testService from "./test.service.js";

const testController = express.Router();

// 전체 조회
testController.get("/", testService.getTweets);

// 상세 조회
testController.get("/:id", testService.getTweet);

// 트윗 생성
testController.post("/", testService.createTweet);

// 트윗 수정
testController.put("/:id", testService.updateTweet);

// 트윗 삭제
testController.delete("/:id", testService.deleteTweet);

export default testController;
