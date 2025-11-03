export const protectRoute = (req, res, next) => {
  if (!req.auth().isAuthenticated) {
    return req
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
  }

  next();
};
