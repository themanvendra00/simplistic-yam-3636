// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const key=process.env.key;

// const authenticate = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (token) {
//     const decoded = jwt.verify(token, "key");
//     if (decoded) {
//       const userID = decoded.userID;
//       req.body.userID = userID;
//       next();
//     } else {
//       res.send("Something want wrong");
//     }
//   } else {
//     res.send("Mising Something");
//   }
// };

// module.exports = {
//   authenticate,
// };
