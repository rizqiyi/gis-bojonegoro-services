export default (response, message, status = 500) => {
  return response.status(status).json({
    success: false,
    message,
    status,
  });
};
