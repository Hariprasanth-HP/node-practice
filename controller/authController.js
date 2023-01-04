const userDB = {
  users: require("../model/user.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  console.log("user", user);
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username or passaword is not provide" });
  const foundUser = userDB.users.find((person) => person.username === user);
  console.log("foundUser", foundUser);

  if (!foundUser) return res.sendStatus(401);
  console.log("data", foundUser.password, pwd);

  const match = await bcrypt.compare(pwd, foundUser.pwd);
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const otherUsers = userDB.users.filter(
      (fil) => fil.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "user.json"),
      JSON.stringify(userDB.users)
    ),
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
  console.log(userDB.users);
};
module.exports = { handleLogin };
