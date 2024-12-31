import User from '../model/user.model.js';

const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Please provide all the required fields' });
        }

        const userExist = await User.findOne({
            $or: [{ email }, { phone }],
        });

        if (userExist) {
            return res.status(409).json({ message: 'User already exists' });
        }

        //generate random profile image
        const profileImage=`https://ui-avatars.com/api/?name=${name}&background=random&size=256`;

        const createUser = await User.create({
            name,
            email,
            password,
            phone,
            image:profileImage,
        });
        res.status(201).json({
            message: 'signup successfully',
            token: await createUser.generateToken(),
            userId: User._id,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all the required fields" });
        }

        const user = await User.findOne({ email });
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
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export { login, signup };