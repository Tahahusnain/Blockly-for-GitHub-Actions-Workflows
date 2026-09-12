export const createApiError = (status, data) => {
  const error = new Error(typeof data === "string" ? data : JSON.stringify(data));
  error.status = status;
  error.data = data;
  error.isApiError = true;
  return error;
};
