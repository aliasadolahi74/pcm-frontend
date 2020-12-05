import JDate from "jalali-date";

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
  controlFaze: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
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
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
  ],
  engine: [
    { key: "0", value: "قطع" },
    { key: "1", value: "وصل" },
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
    { key: "0", value: "غیرفعال" },
    { key: "1", value: "فعال" },
    { key: "2", value: "هشدار" },
    { key: "3", value: "خطا" },
  ],
  transSensor: [
    { key: "0", value: "تحریک نشده" },
    { key: "1", value: "تحریک شده" },
  ],
};

export function analyze(array) {
  const result = [];
  console.log(array);
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const date = new Date(Date.parse(item.datetime));
    const jdate = new JDate(date);
    item.datetime = `${jdate.format("YYYY/MM/DD")} ${date.toLocaleTimeString(
      "en-GB"
    )}`;
    for (const [key, value] of Object.entries(item)) {
      if (key !== "analog1" && key !== "analog2" && key !== "analog3") {
        const reportStatusLabelArray = itemValue[key];
        if (reportStatusLabelArray) {
          reportStatusLabelArray.forEach((status) => {
            if (status.key === value) {
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
