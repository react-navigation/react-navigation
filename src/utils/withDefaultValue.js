export default (obj, key, defaultValue) => {
  if (obj.hasOwnProperty(key) && typeof obj[key] !== 'undefined') {
    return obj;
  }

  obj[key] = defaultValue;
  return obj;
};
