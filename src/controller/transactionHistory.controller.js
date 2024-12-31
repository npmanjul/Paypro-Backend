import Transaction from '../model/transaction.model.js';
import User from '../model/user.model.js';

const getAllTransactions = async (req, res) => {
    const userId = req.params.userId;
    try {
        const transactions_from = await Transaction.find({ from: userId });
        const transactions_to = await Transaction.find({ to: userId });

        const allTransactions=[...transactions_from,...transactions_to];


        if (!allTransactions || allTransactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this user" });
        }

        const getTransactions = await Promise.all(
            allTransactions.map(async (transaction) => {
                const fromUser = await User.findById(transaction.from);
                const toUser = await User.findById(transaction.to);

                return {
                    transactionId: transaction._id,
                    from: fromUser ? fromUser.name : "Unknown Sender",
                    fromId: fromUser ? fromUser._id : "Unknown Sender",
                    to: toUser ? toUser.name : "Unknown Recipient",
                    toId: toUser ? toUser._id : "Unknown Recipient",
                    amount: transaction.amount,
                    timestamp: transaction.timestamp,
                    transactionType: transaction.transactionType,
                };
            })
        );

        res.status(200).json({
            message: "Transaction history fetched successfully",
            transactions: getTransactions,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};
export { getAllTransactions };