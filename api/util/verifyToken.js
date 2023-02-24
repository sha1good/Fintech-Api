const jwt = require("jsonwebtoken");
const createError = require("./error.js");

const verifyToken = (req, res, next) => {
  // let cookiesObject = {};
  // const cookiesArray = req.headers.cookie.split(";");

  // cookiesArray.forEach((cookie) => {
  //   const [key,value] = cookie.trim().split("=");
  //    cookiesObject[key] = value;
  // });
  // console.log(cookiesObject.accessToken);
 
  const token = req.cookies.accessToken;

  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT_SECRET, (error, userId) => {
    if (error) return next(createError(403, "Your token is not Valid!"));
    req.user = userId;
    next();
  });
};

module.exports = verifyToken;
