export default (obj, key, defaultValue) => {
  if (obj.hasOwnProperty(key)) {
    return obj;
  }

  obj[key] = defaultValue;
  return obj;
};
