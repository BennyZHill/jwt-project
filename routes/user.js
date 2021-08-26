const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const router = express.Router();
const session = { session: false };

const profile = async (req, res, next) => {
  res
    .status(200)
    .json({ msg: "profile", user: req.user, token: req.query.secret_token });
};

const register = async (req, res, next) => {
  req.user.name
    ? res.status(200).json({ msg: "registered successfully", user: req.user })
    : res.status(401).json({ msg: "user already exists" });
};

const login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) {
        res.status(500).json({ msg: "Internal server error" });
      } else if (!user) {
        res.status(401).json({ msg: "user not found" });
      } else {
        req.login(user, session, async (error) =>
          error
            ? next(error)
            : res.status(200).json({
                user,
                token: jwt.sign({ user: { id: user.id, name: user.name } }),
              })
        );
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

router.post("/register", passport.authenticate("register", session), register);
router.get("/profile", passport.authenticate("jwt", session), profile);
router.post("/login", login);

module.exports = router;
