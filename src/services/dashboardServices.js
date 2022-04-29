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

  if (!authData.isAdmin) {
    try {
      const hardwareStatusResponse = await axios.post(
        "/getStatistics.php",
        qs.stringify({
          ...authData,
        })
      );

      if (hardwareStatusResponse.data.status) {
        const hardwareStatus = hardwareStatusResponse.data.body;
        returnData.numberOfUserDevices =
          hardwareStatusResponse.data.deviceCount;
        const data = [];

        hardwareStatus.forEach((item, index) => {
          const {
            deviceName,
            datetime,
            controlFaze,
            pump,
            security,
            deviceID,
          } = item;

          data.push({
            deviceName,
            datetime,
            key: deviceID + index,
            controlFaze,
            pump,
            security,
          });
        });
        returnData.data = data;
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    returnData.data = [];

    returnData.numberOfUserDevices = 0;
    const { data: resonseData } = await axios.post(
      "/userDeviceCount.php",
      qs.stringify({
        ...authData,
      })
    );
    returnData.usersDeviceCountData = resonseData.body;
  }

  return returnData;
}

export default init;
