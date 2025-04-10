import User from "../model/user.model.js";
import Wallet from "../model/wallet.model.js";

const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const userExist = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (userExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    //generate random profile image
    const profileImage = `https://ui-avatars.com/api/?name=${name}&background=random&size=256`;

    const createUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim(),
      image: profileImage,
    });

    await Wallet.create({
      balance: 0,
      pin: "",
      user: createUser._id,
    });

    res.status(201).json({
      message: "signup successfully",
      token: await createUser.generateToken(),
      userId: createUser._id,
      name: createUser.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if ((!email && !phone) || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: "Login successful",
      token: await user.generateToken(),
      userId: user._id,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// google auth
const googleAuth = async (req, res) => {
  try {
    const { email, name, uid } = req.body;

    let user = await User.findOne({ email });

    const image = `https://ui-avatars.com/api/?name=${name}&background=random&size=256`;

    if (!user) {
      user = await User.create({
        email,
        name,
        image,
        phone: "",
        password: uid,
        isGoogleAuth: true,
      });

      await Wallet.create({
        balance: 0,
        pin: "",
        user: user._id,
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        token: await user.generateToken(),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Pin verification
const verifyPin = async (req, res) => {
  try {
    const { pin, userId } = req.body;
    if (!pin || !userId) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const isPinCorrect = await wallet.isPinCorrect(pin);
    if (!isPinCorrect) {
      return res.status(401).json({ message: "Invalid pin" });
    }

    res.status(200).json({ message: "Pin verified successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// Pin Update
const updatePin = async (req, res) => {
  try {
    const { pin, userId } = req.body;
    if (!pin || !userId) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    wallet.pin = pin;
    await wallet.save();
    res.status(200).json({ message: "Pin updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export { login, signup, googleAuth, verifyPin, updatePin };
