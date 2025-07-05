import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import genToken from '../config/token.js'

// ✅ Helper: remove password before sending user data
const sanitizeUser = (user) => {
  const { password, __v, ...rest } = user._doc;
  return rest;
};

// -----------------------------
// SIGNUP
// -----------------------------
export const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const checkUserByUserName = await User.findOne({ userName });
    if (checkUserByUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const checkUserByUserEmail = await User.findOne({ email });
    if (checkUserByUserEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@#$%^&+=!]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must have letters, numbers, @ # .."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ STEP: Create user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword
    });

    // ✅ STEP: Log the user object
    console.log("✅ New user saved to DB:", user);

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true
    });

    return res.status(201).json({
      message: "User created",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      }
    });

  } catch (error) {
    console.log("❌ Signup error:", error);
    return res.status(500).json({ message: "Signup error" });
  }
};


// -----------------------------
// LOGIN
// -----------------------------
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
     sameSite: "None",
      secure: true
    });

    return res.status(200).json(sanitizeUser(user));

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login error" });
  }
};

// -----------------------------
// LOGOUT
// -----------------------------
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout error" });
  }
};
