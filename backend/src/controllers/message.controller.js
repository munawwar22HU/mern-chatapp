import User from "../models/user.model.js";
import Message from "../models/message.model.js";
export const getUsersForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const users = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.id;
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user._id },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;

    let imageUrl;
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);
      imageUrl = uploadResult.secure_url;
    }

    const newMessage = new Message({
      senderId: req.user._id,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    // todo: real-time via socket.io
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
