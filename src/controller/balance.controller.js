import User from '../model/user.model.js';

const getBalance = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Balance fetched successfully",
            balance: user.balance
        });
    }catch(error){
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

export { getBalance };