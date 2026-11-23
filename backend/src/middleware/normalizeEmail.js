export const normalizeEmail = (req, res, next) => {
  req.body.email = req.body.email.trim().toLowerCase();
  next();
};

export default normalizeEmail;
