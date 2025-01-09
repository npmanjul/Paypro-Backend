import Transaction from '../model/transaction.model.js';
import User from '../model/user.model.js';

const getAllTransactions = async (req, res) => {
    const userId = req.params.userId;
    try {
        const transactions_from = await Transaction.find({ from: userId });
        const transactions_to = await Transaction.find({ to: userId });

        // money out from account
        const fromTransactions = await Promise.all(
            transactions_from.map(async (transaction) => {
                const fromUser = await User.findById(transaction.to);
                return {
                    transactionId: transaction._id,
                    to: fromUser.name,
                    amount: transaction.amount,
                    timestamp: transaction.timestamp,
                };
            })
        );

        // money in the account
        const toTransactions = await Promise.all(
            transactions_to.map(async (transaction) => {
                const toUser = await User.findOne(transaction.from);
                return {
                    transactionId: transaction._id,
                    from: toUser.name,
                    amount: transaction.amount,
                    timestamp: transaction.timestamp,
                };
            })
        );

        const allTransactions = [...fromTransactions, ...toTransactions];

        if (!allTransactions || allTransactions.length === 0) {
            return res.status(404).json({ message: "No transactions found for this user" });
        }
        const sortedTransactions = allTransactions.sort((a, b) => b.timestamp - a.timestamp);

        res.status(200).json({
            transactions: sortedTransactions,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};
export { getAllTransactions };