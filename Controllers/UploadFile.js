const userModal = require("../Models/userModel");
const cloudinary = require("../config/cloudinary");

const userDp = async (req, res) => {
  const { name, email, userId } = req.body;
  const avatarFile = req.files?.avatar?.[0];
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

    // ✅ Avatar upload
    if (avatarFile) {
      const avatarResult = await uploadBufferToCloudinary(avatarFile.buffer, {
        folder: `avatar/${email.split("@")[0]}`,
        public_id: userId,
        overwrite: true,
        resource_type: "image",
      });

      user.dp = avatarResult.secure_url;
    }

    // ✅ Background upload
    if (backgroundFile) {
      const backgroundResult = await uploadBufferToCloudinary(
        backgroundFile.buffer,
        {
          folder: `background/${email.split("@")[0]}`,
          public_id: userId,
          overwrite: true,
          resource_type: "image",
        }
      );

      user.backgroundImg = backgroundResult.secure_url;
    }

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
