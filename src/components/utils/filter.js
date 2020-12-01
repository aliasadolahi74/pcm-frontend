export function filterDatetime(startTime, endTime, dataArray) {
  const startDateTime = Date.parse(startTime.slice(0, -3) + "T00:00:00");
  const endDateTime = Date.parse(endTime.slice(0, -3) + "T23:59:59");
  return dataArray.filter((item) => {
    const itemDateTime = Date.parse(item.datetime);
    if (itemDateTime >= startDateTime && endDateTime >= itemDateTime) {
      return true;
    }
    return false;
  });
}
