const userModal = require("../Models/userModel");
const app = require("../FireBase");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const storage = getStorage(app);

const userDp = async (req, res) => {
  const { name, email, userId } = req.body;
  const avatarFile = req.files?.avatar?.[0];
  const backgroundFile = req.files?.background?.[0];

  if (!avatarFile && !backgroundFile && !name) {
    return res.status(400).json({ message: "empty fields", success: false });
  }

  try {
    const user = await userModal.findOne({ _id: userId });

    // Handle avatar upload
    if (avatarFile) {
      const avatarRef = ref(
        storage,
        `/avatar/${email.split("@")[0]}/${
          userId + "." + avatarFile.originalname.split(".")[1]
        }`
      );

      const avatarSnapshot = await uploadBytesResumable(
        avatarRef,
        avatarFile.buffer,
        {
          contentType: avatarFile.mimetype,
        }
      );

      const avatarUrl = await getDownloadURL(avatarSnapshot.ref);
      user.dp = avatarUrl;
    }

    // Handle background upload
    if (backgroundFile) {
      const backgroundRef = ref(
        storage,
        `/background/${email.split("@")[0]}/${
          userId + "." + backgroundFile.originalname.split(".")[1]
        }`
      );

      const backgroundSnapshot = await uploadBytesResumable(
        backgroundRef,
        backgroundFile.buffer,
        {
          contentType: backgroundFile.mimetype,
        }
      );

      const backgroundUrl = await getDownloadURL(backgroundSnapshot.ref);
      user.backgroundImg = backgroundUrl;
    }

    // Update user name
    if (name) {
      user.name = name;
    }

    await user.save();

    res.status(200).json({
      message: "Updated successfully",
      success: true,
      dp: user.dp,
      background: user.backgroundImg,
      name: user.name,
    });
  } catch (error) {
    console.error("Failed to update", error);
    res.status(500).json({
      message: "Failed to update ",
      success: false,
    });
  }
};

module.exports = userDp;
