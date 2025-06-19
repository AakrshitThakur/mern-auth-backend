import jwt from "jsonwebtoken";

export default function checkAuth(req, res, next) {
    console.log("Under checkAuth middleware");
  const jwtToken = req.cookies.jwt;
  console.log(req.cookies.jwt);
  if (!jwtToken) {
    return res.status(400).json({
      msg: "Access Denied: Please register for an account or log in to proceed.",
    });
  }
  jwt.verify(jwtToken, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error("Token verification failed:", error);
      return res.status(400).json({
        msg: error,
      });
    } else {
      console.log("Token is valid. Decoded payload:", decoded);
      // Proceed with the decoded data
      req.userId = decoded.userId;
      return next();
    }
  });
}
