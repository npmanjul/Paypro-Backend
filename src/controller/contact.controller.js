import Wallet from "../model/wallet.model.js";
import User from "../model/user.model.js";

const getContact = async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await User.findOne({ user: userId });

    res.status(200).json({
      message: "Contacts fetched successfully",
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export default getContact;
