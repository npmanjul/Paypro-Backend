import User from "../model/user.model.js";
import Transaction from "../model/transaction.model.js";
import Wallet from "../model/wallet.model.js";
import mongoose from "mongoose";

const addAmount = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    if (!amount || !userId) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    wallet.balance += Number(amount);
    await wallet.save();

    res.status(200).json({
      message: "Amount added successfully",
      currBalance: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const accountDetails = async (req, res) => {
  try {
    const { userId, email, phone } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { phone: phone }, { _id: userId }],
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      name: user.name,
      image: user.image,
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid request",
      error: error.message,
    });
  }
};

const transferAmount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount, from, to, phone, email } = req.body;

    if (!amount || !from || (!to && !phone && !email)) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    const fromUser = await User.findById(from);
    if (!fromUser) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const toUser = await User.findOne({
      $or: [{ email }, { phone }, { _id: to }],
    });
    if (!toUser) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    const fromWallet = await Wallet.findOne({ user: fromUser._id });
    if (!fromWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const toWallet = await Wallet.findOne({ user: toUser._id });
    if (!toWallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (fromWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    fromWallet.balance -= amount;
    toWallet.balance += amount;

    const transaction = await Transaction.create({
      from: fromWallet.user,
      to: toWallet.user,
      amount: amount,
      timestamp: Date.now(),
      status: true,
    });

    fromWallet.transaction.push(transaction._id);
    toWallet.transaction.push(transaction._id);

    await fromWallet.save({ session });
    await toWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Amount transferred successfully",
      transactionId: transaction._id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: "Transaction failed, rolled back",
      error: error.message,
    });
  }
};

export { addAmount, transferAmount, accountDetails };
