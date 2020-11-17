export function getErrorString(errors) {
  let errorString = "";
  errors.map((item) => (errorString += item.message + "\n"));
  return errorString;
}
