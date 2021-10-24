import jwtDecode from "jwt-decode";
import axios from "axios";
import qs from "qs";
import "./httpServices";
import config from "../config.json";
import { authData } from "./authServices";

async function init() {
  const returnData = {};
  try {
    const user = jwtDecode(localStorage.getItem("token"));
    returnData.user = user;
  } catch (ex) {}

  const hardwareStatusOption = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: qs.stringify({
      ...authData,
    }),
    url: `${config.apiBaseURL}/getStatistics.php`,
  };

  if (!authData.isAdmin) {
    const hardwareStatusResponse = await axios(hardwareStatusOption);

    if (hardwareStatusResponse.data.status) {
      const hardwareStatus = hardwareStatusResponse.data.body;
      returnData.numberOfUserDevices = hardwareStatusResponse.data.deviceCount;
      const pumpData = [];
      const securityData = [];
      const analogData = [];

      hardwareStatus.forEach((item, index) => {
        const {
          deviceName,
          datetime,
          controlFaze,
          pump,
          analog1,
          analog2,
          analog3,
          security,
          deviceID,
        } = item;

        analogData.push({
          deviceName,
          datetime,
          key: deviceID + index,
          analog1,
          analog2,
          analog3,
        });
        securityData.push({
          deviceName,
          datetime,
          key: deviceID + index,
          security,
        });
        pumpData.push({
          deviceName,
          datetime,
          key: deviceID + index,
          pump,
          controlFaze,
        });
      });
      returnData.pumpData = pumpData;
      returnData.securityData = securityData;
      returnData.analogData = analogData;
    }
  } else {
    returnData.pumpData = [];
    returnData.securityData = [];
    returnData.analogData = [];
    returnData.numberOfUserDevices = 0;

    const userDeviceCountOption = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({
        ...authData,
      }),
      url: `${config.apiBaseURL}/userDeviceCount.php`,
    };
    const { data: resonseData } = await axios(userDeviceCountOption);
    returnData.usersDeviceCountData = resonseData.body;
  }
  return returnData;
}

export default init;
