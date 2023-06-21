const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Error creating user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ err: "Invalid credentials" });
    } else {
      res.status(200).json({ message: "User logged in successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Error logging in user" });
  }
};

exports.login = login;
exports.register = register;
