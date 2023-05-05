import axios from "axios";
import { config } from "../../config.js";

export const getMise = async (req, res) => {
  const url =
    "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth";
  const serviceKey =
    "yCFGi/AdePeartwnSyutSDnXXjxxtEbyJl+pEL5UbXWo44mWh/hro79GeWq4L/WGR3wlcdSO4ubOIOAShWjuAQ==";
  const queryParams = new URLSearchParams({
    serviceKey,
    returnType: "json",
    numOfRows: "1",
    pageNo: "1",
    searchDate: "2023-05-01",
    InformCode: "PM10",
  }).toString();

  try {
    const response = await axios.get(`${url}?${queryParams}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const getMise2 = async (req, res) => {
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
