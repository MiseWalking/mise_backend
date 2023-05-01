import axios from "axios";

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

export const getMise = async (req, res) => {
  try {
    const response = await axios.get(`${url}?${queryParams}`);
    console.log("Status", response.status);
    console.log("Headers", response.headers);
    console.log("Response received", response.data);

    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
};
