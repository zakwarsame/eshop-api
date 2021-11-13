const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
      const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) res.status(403).json("Token not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You're not authenticated");
  }
};

const verifyTokenAndAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    //   console.log(req.user);
    if (req.user.id === req.params.id || req.user.isAdmin) {
        next()
    }else {
        res.status(403).json("Unauthorized request!")
    }

  });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      //   console.log(req.user);
      if (req.user.isAdmin) {
          next()
      }else {
          res.status(403).json("Unauthorized request!")
      }
  
    });
  };

module.exports = { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin };
