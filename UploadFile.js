const userModal = require("../Models/userModel");
const cloudinary = require("../config/cloudinary");

const userDp = async (req, res) => {
  const { name, email, userId } = req.body;
  const avatarFile = req.files?.avatar?.[0]; // multer array of files
  const backgroundFile = req.files?.background?.[0];

  if (!avatarFile && !backgroundFile && !name) {
    return res.status(400).json({ message: "Empty fields", success: false });
  }

  try {
    const user = await userModal.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Upload avatar
    if (avatarFile) {
      const avatarResult = await cloudinary.uploader.upload_stream(
        {
          folder: `avatar/${email.split("@")[0]}`,
          public_id: userId,
          overwrite: true,
        },
        async (error, result) => {
          if (error) throw error;
          user.dp = result.secure_url;
        }
      );
      avatarResult.end(avatarFile.buffer);
    }

    // Upload background
    if (backgroundFile) {
      const backgroundResult = await cloudinary.uploader.upload_stream(
        {
          folder: `background/${email.split("@")[0]}`,
          public_id: userId,
          overwrite: true,
        },
        async (error, result) => {
          if (error) throw error;
          user.backgroundImg = result.secure_url;
        }
      );
      backgroundResult.end(backgroundFile.buffer);
    }

    // Update name
    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      message: "Updated successfully",
      success: true,
      dp: user.dp,
      background: user.backgroundImg,
      name: user.name,
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).json({
      message: "Failed to update user",
      success: false,
    });
  }
};

module.exports = userDp;
