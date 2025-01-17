import User from '../model/user.model.js';
import { deleteFromCloudinary, extractPublicId, uploadOnCloudinary } from '../utils/cloudinary.js';

const getProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId, {password:0});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            profile: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
}

const updateProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, phone } = req.body;
        let imageUploadedUrl = null;

        if (req.file) {
            const currentImage = await User.findById(userId).select('image');
            if (currentImage && currentImage.image) {
                const publicId = extractPublicId(currentImage.image);

                if (publicId) {
                    const imageDeleted = await deleteFromCloudinary(publicId);
                    if (!imageDeleted) {
                        return res.status(400).json({ message: "Failed to delete the existing image" });
                    }
                }
            }

            const updateImage = req.file.path;
            if (!updateImage) {
                return res.status(400).json({ message: "Please upload a valid image" });
            }

            const imageUploaded = await uploadOnCloudinary(updateImage);
            if (!imageUploaded) {
                return res.status(400).json({ message: "Failed to upload new image" });
            }

            imageUploadedUrl = imageUploaded.url;
        }

        const updateData = { name, phone };
        if (imageUploadedUrl) {
            updateData.image = imageUploadedUrl;
        }

        const updateUser = await User.updateOne({ _id: userId }, updateData);
        if (updateUser.modifiedCount === 0) {
            return res.status(400).json({ message: "Failed to update profile" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};




export { getProfile, updateProfile };