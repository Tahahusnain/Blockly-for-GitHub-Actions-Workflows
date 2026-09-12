export const healthController = {
  check(req, res) {
    res.json({ status: "ok", message: "Backend connected successfully!" });
  },
};
