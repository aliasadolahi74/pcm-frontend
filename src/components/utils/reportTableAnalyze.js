import JDate from "jalali-date";

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
        switch (value) {
          case null:
            item[key] = "بدون داده";
            break;
          case "0":
            item[key] = "خاموش";
            break;
          case "1":
            item[key] = "روشن";
            break;
          case "2":
            item[key] = "ندارد";
            break;
          default:
            item[key] = value;
        }
      }
    }
    result.push(item);
  }
  return result;
}
