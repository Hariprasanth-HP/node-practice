const userDB = {
  users: require("../model/user.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");
const path = require("path");
const fsPromises = require("fs").promises;
const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username or passaword is not provide" });
  const duplicate = userDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409);
  try {
    const hashedpwd = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hashedpwd };
    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "user.json"),
      JSON.stringify(userDB.users)
    );
    console.log(userDB.users);
    await res.status(201).json({ success: `New user of ${user} is created` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = { handleNewUser };
