const chatModel = require("../Models/chatModel");
const userModel = require("../Models/userModel");
const messageModel = require("../Models/messageModel");
const latestChat = require("../Models/latestMsgModel");
const mongoose = require("mongoose");
const app = require("../FireBase");

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { v4: uuidv4 } = require("uuid");
const {
  getReceiverSocketId,
  sendNewMessageToUser,
  sendNewChatToUser,
  io,
} = require("../socket/socket");
const storage = getStorage(app);

const sendmessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, senderName } = req.body;
    const image = req.files?.image?.[0];
    if (message == "" && !image) {
      return res
        .status(400)
        .json({ message: "Message cannot be empty", success: false });
    }

    let convo = await chatModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!convo) {
      convo = await chatModel.create({
        participants: [senderId, receiverId],
      });
    }

    let users = await userModel.find({
      _id: { $in: [senderId, receiverId] },
    });

    let newChat = await latestChat.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    let newFriend = false;

    if (!newChat) {
      newFriend = true;
      newChat = await latestChat.create({
        participants: [senderId, receiverId],
      });
    }

    if (message || image) {
      newChat.latestMessage = message || "📷";
    }

    if (mongoose.Types.ObjectId.isValid(newChat._id)) {
      // For the sender
      if (!users[0].newMessage.includes(newChat._id)) {
        users[0].newMessage.push(newChat._id);
      }

      // For the receiver
      if (!users[1].newMessage.includes(newChat._id)) {
        users[1].newMessage.push(newChat._id);
      }
    }

    if (!users[0].friends.includes(receiverId)) {
      users[0].friends.push(receiverId);
    }

    if (!users[1].friends.includes(senderId)) {
      users[1].friends.push(senderId);
    }

    let imageUrl;
    if (image) {
      const imageRef = ref(
        storage,
        `/chatImages/${uuidv4() + "." + image.originalname.split(".")[1]}`
      );

      const avatarSnapshot = await uploadBytesResumable(
        imageRef,
        image.buffer,
        {
          contentType: image.mimetype,
        }
      );

      imageUrl = await getDownloadURL(avatarSnapshot.ref);
    }

    const newMessage = new messageModel({
      senderId,
      receiverId,
      message,
      imageUrl,
      senderName,
    });

    if (newMessage) {
      convo.messages.push(newMessage._id);
    }

    await Promise.all([
      convo.save(),
      newMessage.save(),
      users[0].save(),
      users[1].save(),
      newChat.save(),
    ]);

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      sendNewMessageToUser(receiverId, newMessage);
      sendNewChatToUser(receiverId, newChat);
      // io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // if (receiverSocketId) {
    // sendNewChatToUser(receiverSocketId, newChat);
    // io.to(receiverSocketId).emit("newChat", newChat);
    // }

    res.status(200).json({
      newMessage,
      success: true,
      receiverId,
      senderId,
      newChat,
      newFriend,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",

      success: false,
    });
  }
};

const share = async (req, res) => {
  try {
    const { senderId, receiverId, imageUrl, message } = req.body;

    // Log the received data for debugging

    // Basic validation
    if (!senderId || !receiverId || (!message && !imageUrl)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    // Find existing conversation or create a new one
    let convo = await chatModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!convo) {
      convo = await chatModel.create({
        participants: [senderId, receiverId],
      });
    }
    let users = await userModel.find({
      _id: { $in: [senderId, receiverId] },
    });

    let newChat = await latestChat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!newChat) {
      newChat = await latestChat.create({
        participants: [senderId, receiverId],
      });
    }

    newChat.latestMessage = "📷";

    if (mongoose.Types.ObjectId.isValid(newChat._id)) {
      // For the sender
      if (!users[0].newMessage.includes(newChat._id)) {
        users[0].newMessage.push(newChat._id);
      }

      // For the receiver
      if (!users[1].newMessage.includes(newChat._id)) {
        users[1].newMessage.push(newChat._id);
      }
    }

    if (!users[0].friends.includes(receiverId)) {
      users[0].friends.push(receiverId);
    }

    if (!users[1].friends.includes(senderId)) {
      users[1].friends.push(senderId);
    }

    // Create a new message
    const newMessage = new messageModel({
      senderId,
      receiverId,
      message,
      imageUrl,
    });

    if (newMessage) {
      convo.messages.push(newMessage._id);
    }

    // Save the conversation and the new message
    await Promise.all([
      convo.save(),
      users[0].save(),
      users[1].save(),
      newMessage.save(),
      newChat.save(),
    ]);

    // Check if the receiver is connected via socket and send the new message
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      sendNewMessageToUser(receiverId, newMessage);
      // sendNewChatToUser(receiverId, newChat);
      // io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Respond with success and the new message details
    res.status(200).json({ newMessage, success: true, receiverId, senderId });
  } catch (error) {
    // Handle any errors that occurred
    console.error("Error in share function:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getmessage = async (req, res) => {
  const { senderId, receiverId } = req.query;
  try {
    const convo = await chatModel
      .findOne({
        participants: { $all: [senderId, receiverId] },
      })
      .populate("messages");

    if (!convo) return res.status(200).json({ success: true, message: [] });

    const message = convo.messages;
    res
      .status(200)
      .json({ success: true, message, chatId: convo.participants });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const user = async (req, res) => {
  const { id } = req.query;
  try {
    const user = await userModel.findById(id).select("-password");
    res.status(200).json({ message: "users", success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const getusers = async (req, res) => {
  const { id } = req.query;
  try {
    const user = await userModel
      .find({ _id: { $ne: id } })
      .select("-password")
      .populate("newMessage");

    res.status(200).json({ message: "users", success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "users", error: error });
  }
};
module.exports = { sendmessage, getmessage, user, getusers, share };
