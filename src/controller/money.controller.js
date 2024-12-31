import User from '../model/user.model.js';
import Transaction from '../model/transaction.model.js';

const addAmount = async (req, res) => {
    try {
        const { amount, userId } = req.body;
        if (!amount || !userId) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.balance += amount;
        await user.save();
        res.status(200).json({ 
            message: "Amount added successfully", 
            currBalance: user.balance
         });
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

const transferAmount = async (req, res) => {
    try {
        const { amount, from, to } = req.body;

        if (!amount || !from || !to) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        const fromUser = await User.findById(from);
        if (!fromUser) {
            return res.status(404).json({ message: "Sender not found" });
        }

        const toUser = await User.findById(to);
        if (!toUser) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        if (fromUser.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        fromUser.balance -= amount;
        toUser.balance += amount;

        const transaction = await Transaction.create({
            from: fromUser._id,
            to: toUser._id,
            amount: amount,
            timestamp: Date.now(),
        });

        fromUser.transaction.push(transaction._id);
        toUser.transaction.push(transaction._id);

        await fromUser.save();
        await toUser.save();

        res.status(200).json({
            message: "Amount transferred successfully",
            transactionId: transaction._id,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export { addAmount, transferAmount };