import axios from "axios";
import { config } from "../../config.js";

// 미세먼지 정보 조회
/**
 * @swagger
 *
 * /data/mise:
 *   get:
 *     tags:
 *      - 공공 데이터
 *     summary: 미세먼지 정보 조회
 *     parameters:
 *       - in: query
 *         name: gu
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회하고자 하는 구 이름
 *     responses:
 *       200:
 *         description: 미세먼지 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gu:
 *                   type: string
 *                   description: 구 이름
 *                 pm10:
 *                   type: string
 *                   description: 미세먼지(PM10) 농도
 *       500:
 *         description: 미세먼지 정보 조회 실패
 */
export const getMise = async (req, res) => {
  const key = config.seoulKey;
  const { gu } = req.query;
  const url = `http://openAPI.seoul.go.kr:8088/${key}/json/ListAirQualityByDistrictService/1/5/${gu}`;

  try {
    const response = await axios.get(`${url}`);
    res.json({
      gu: response.data.ListAirQualityByDistrictService.row[0].MSRSTENAME,
      pm10: response.data.ListAirQualityByDistrictService.row[0].PM10,
    });
  } catch (error) {
    console.error(error);
  }
};

// 기온 정보 조회
/**
 * @swagger
 *
 * /data/weather:
 *   get:
 *     tags:
 *      - 공공 데이터
 *     summary: 날씨 정보 조회
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회하고자 하는 기준 날짜(yyyyMMdd)
 *     responses:
 *       200:
 *         description: 기온 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 TMP:
 *                   type: string
 *                   description: 기온 정보
 *       500:
 *         description: 기온 정보 조회 실패
 */
export const getWeather = async (req, res) => {
  const { date } = req.query;
  const queryParams = new URLSearchParams({
    serviceKey: config.weatherKey,
    pageNo: 1,
    numOfRows: 50,
    dataType: "JSON",
    base_date: date,
    base_time: "1100",
    nx: 55,
    ny: 127,
  });

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?${queryParams.toString()}`;

  try {
    const response = await axios.get(`${url}`);
    let result = {
      TMP: "test",
    };

    response.data.response.body.items.item.forEach((item) => {
      if (item.category === "TMP") {
        result.TMP = item.fcstValue;
      }
    });

    res.json(result);
  } catch (error) {
    console.error(error);
  }
};

// 강수량 조회
/**
 * @swagger
 *
 * /data/gang:
 *   get:
 *     tags:
 *      - 공공 데이터
 *     summary: 강수량 정보 조회
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회하고자 하는 기준 날짜(yyyyMMdd)
 *     responses:
 *       200:
 *         description: 강수량 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 POP:
 *                   type: string
 *                   description: 강수 확률
 *                 REH:
 *                   type: string
 *                   description: 습도
 *                 PCP:
 *                   type: string
 *                   description: 강수량
 *       500:
 *         description: 강수량 정보 조회 실패
 */
export const getGang = async (req, res) => {
  const { date } = req.query;
  const queryParams = new URLSearchParams({
    serviceKey: config.weatherKey,
    pageNo: 1,
    numOfRows: 50,
    dataType: "JSON",
    base_date: date,
    base_time: "1100",
    nx: 55,
    ny: 127,
  });

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?${queryParams.toString()}`;

  try {
    const response = await axios.get(`${url}`);
    let result = {
      POP: "test",
      REH: "test",
      PCP: "test",
    };

    response.data.response.body.items.item.forEach((item) => {
      if (item.category === "POP") {
        result.POP = item.fcstValue;
        console.log(result);
      } else if (item.category === "REH") {
        result.REH = item.fcstValue;
      } else if (item.category === "PCP") {
        result.PCP = item.fcstValue;
      }
    });

    res.json(result);
  } catch (error) {
    console.error(error);
  }
};
