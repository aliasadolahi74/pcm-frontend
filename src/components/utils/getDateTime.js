import axios from "axios";

export const dateTime = async () => {
  const API = "https://timeapi.io/api/Time/current/zone?timeZone=Asia/Tehran";
  const response = await axios.get(API);

  return new Promise((resolve, reject) => {
    if (response.status === 200) {
      const { data } = response;
      return resolve(new Date(data.dateTime));
    } else {
      return reject("Error");
    }
  });
};