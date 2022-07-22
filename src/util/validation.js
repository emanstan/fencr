// eslint-disable-next-line
const emailPattern = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i;

const isError = (errors, id) => {
  if (!errors) return false;
  return (errors[id] || []).length > 0;
};

const getErrorText = (errors, id) => {
  if (!errors || !Array.isArray(errors[id])) return "";
  return errors[id].join("\n");
};

const addError = (errors, id, obj) => {
  if (!errors) errors = {};
  if (!Array.isArray(errors[id])) errors[id] = [];
  errors[id].push(obj);
  return errors[id];
};

export { emailPattern, isError, getErrorText, addError };