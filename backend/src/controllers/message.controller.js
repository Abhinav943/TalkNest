import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getAllcontacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userChatToID } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userChatToID },
        { senderId: userChatToID, receiverId: myId },
      ],
    }).populate({
      path: "replyTo",
      populate: {
        path: "senderId",
        select: "fullName",
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body;
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    if (!image && !text) {
      return res
        .status(400)
        .json({ message: "Message text or image is required" });
    }

    if (receiverId === senderId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot send message to yourself" });
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      replyTo,
    });

    const savedMessage = await (await newMessage.save()).populate({
      path: "replyTo",
      populate: {
        path: "senderId",
        select: "fullName",
      },
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", savedMessage);
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId
            : msg.senderId,
        ),
      ),
    ];
    const chatPartners = await User.find({
      _id: { $in: Array.from(chatPartnerIds) },
    }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error fetching chat partners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.emoji === emoji && r.userId.toString() === userId.toString(),
    );

    if (existingReactionIndex > -1) {
      // Remove reaction if it exists
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add reaction if it doesn't exist
      message.reactions.push({ emoji, userId });
    }

    await message.save();

    // Notify both users in the conversation
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    const senderSocketId = getReceiverSocketId(message.senderId);

    const updatePayload = {
      messageId: message._id,
      reactions: message.reactions,
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageReactionUpdate", updatePayload);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageReactionUpdate", updatePayload);
    }

    res.status(200).json(message.reactions);
  } catch (error) {
    console.error("Error reacting to message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
