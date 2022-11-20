import JDate from "jalali-date";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

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

export function analyze(array, updateInterval = null) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const date = new Date(Date.parse(item.datetime));
    const jdate = new JDate(date);
    item.datetime = `${jdate.format("YYYY/MM/DD")} ${date.toLocaleTimeString(
      "en-GB"
    )}`;
    if (updateInterval !== null) {
      const diffInMiliSeconds = Date.now() - date.getTime();
      const diffInSeconds = diffInMiliSeconds / 1000;
      if (diffInSeconds > updateInterval) {
        item.icon = (
          <span style={{ color: "orange" }}>
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </span>
        );
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
  return result;
}
