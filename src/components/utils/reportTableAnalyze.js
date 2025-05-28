import dayjs from 'dayjs';
import jalali from '@zoomit/dayjs-jalali-plugin';
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import {
  faCircle,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import { dateTime } from "./getDateTime";
import {store} from "../../redux/store";

dayjs.extend(jalali);

const itemValue = {
  bimetal: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
  ],
  commandTimer: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
    { key: "2", value: "ندارد" },
  ],
  detector: [
    { key: "0", value: "تحریک نشده" },
    { key: "1", value: "تحریک شده" },
  ],
  device1: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
    { key: "2", value: "ندارد" },
  ],
  device2: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
    { key: "2", value: "ندارد" },
  ],
  device3: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
    { key: "2", value: "ندارد" },
  ],
  doorSensor: [
    { key: "0", value: "تحریک نشده" },
    { key: "1", value: "تحریک شده" },
  ],
  pump: [
    {
      key: "0",
      value: (
        <div
          style={{
            color: "red",
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <span>خاموش</span>
          <FontAwesomeIcon icon={faCircle} />
        </div>
      ),
    },
    {
      key: "1",
      value: (
        <div
          style={{
            color: "blue",
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <span>روشن</span>
          <FontAwesomeIcon icon={faCircle} />
        </div>
      ),
    },
  ],
  controlFaze: [
    {
      key: "0",
      value: (
        <div
          style={{
            color: "red",
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <span>قطع</span>
          <FontAwesomeIcon icon={faCircle} />
        </div>
      ),
    },
    {
      key: "1",
      value: (
        <div
          style={{
            color: "blue",
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <span>وصل</span>
          <FontAwesomeIcon icon={faCircle} />
        </div>
      ),
    },
  ],
  faze1: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
  ],
  faze2: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
  ],
  faze3: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
  ],
  floater: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
    { key: "2", value: "ندارد" },
  ],
  overloadController: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
    { key: "2", value: "ندارد" },
  ],
  photocell: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
    { key: "2", value: "ندارد" },
  ],
  roomEye: [
    { key: "0", value: "تحریک نشده" },
    { key: "1", value: "تحریک شده" },
  ],
  security: [
    {
      key: "0",
      value: (
        <div
          style={{
            color: "orange",
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <span>غیرفعال</span>
          <FontAwesomeIcon icon={faCircle} />
        </div>
      ),
    },
    {
      key: "1",
      value: (
        <div
          style={{
            color: "blue",
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <span>فعال</span>
          <FontAwesomeIcon icon={faCircle} />
        </div>
      ),
    },
    {
      key: "2",
      value: (
        <div
          style={{
            color: "red",
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
          }}
        >
          <span>هشدار</span>
          <FontAwesomeIcon icon={faCircle} />
        </div>
      ),
    },
    { key: "3", value: "خطا" },
  ],
  transSensor: [
    { key: "0", value: "تحریک نشده" },
    { key: "1", value: "تحریک شده" },
  ],
};

export async function analyze(array, updateInterval = null) {
  return new Promise((resolve, reject) => {
    const silenceItems = store.getState().beep.silenceItems;
    dateTime()
      .then((serverDate) => {
        const result = [];
        for (let i = 0; i < array.length; i++) {
          const item = array[i];

          const isSilenced = silenceItems.some(
              silencedItem => silencedItem.deviceID === item.deviceID
          );
          if (isSilenced) {
            item.muted = true;
          }
          if (item.controlFaze === "0") {
            item.hasBeep = true;
          }
          const date = new Date(item.datetime);
          item.datetime = `${dayjs(date).calendar('jalali').format('YYYY/MM/DD')} ${date.toLocaleTimeString("en-GB")}`;
          item.englishDatetime = date;
          if (updateInterval !== null) {
            const diffInMiliSeconds = serverDate.getTime() - date.getTime();
            const diffInSeconds = diffInMiliSeconds / 1000;
            if (diffInSeconds > updateInterval) {
              item.icon = (
                <span style={{ color: "orange" }}>
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                </span>
              );
              item.hasAlert = true;
            }
          }
          for (const [key, value] of Object.entries(item)) {
            if (key !== "analog1" && key !== "analog2" && key !== "analog3") {
              const reportStatusLabelArray = itemValue[key];
              if (reportStatusLabelArray) {
                reportStatusLabelArray.forEach((status) => {
                  /* eslint eqeqeq: 0 */
                  if (status.key == value) {
                    item[key] = status.value;
                  }
                });
              }
            }
          }
          result.push(item);
        }
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
