import ConnectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const sendConnectionRequest = async (req, res) => {
  const userId = req.params.userId;
  const senderId = req.user._id;
  if (senderId.toString === userId) {
    return res
      .status(400)
      .json({ message: "You can't send a request to yourself" });
  }
  if (req.user.connections.includes(userId)) {
    return res.status(400).json({ message: "You are already connected" });
  }
  try {
    const existingRequest = await ConnectionRequest.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A connection request already exists" });
    }
    const newRequest = new ConnectionRequest({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });
    await newRequest.save();
    res.status(201).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error("Error in sendConnectionRequest controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;
  try {
    const request = await ConnectionRequest.findById(requestId)
      .populate("sender", "name email username")
      .populate("recipient", "name username");
    if (!request) {
      return res
        .status(404)
        .json({ message: "Connection request cannot be found" });
    }
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }
    request.status = "accepted";
    await request.save();
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });
    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });

    const notification = new Notification({
      recipient: request.sender._id,
      relatedUser: userId,
      type: "connectionAccepted",
    });
    await notification.save();
    res.json({ message: "Connection accepted successfully" });
  } catch (error) {
    console.error(
      "Error in acceptConnectionRequest controller: ",
      error.message,
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  const { requestId } = req.params;
  const userId = req.user._id;
  try {
    const request = await ConnectionRequest.findById(requestId)
      .populate("sender", "name email username")
      .populate("recipient", "name username");
    if (!request) {
      return res
        .status(404)
        .json({ message: "Connection request cannot be found" });
    }
    if (request.status !== "pending") {
      return res
        .status(400)
        .json({ message: "This request has already been processed" });
    }
    request.status = "rejected";
    await request.save();
    await User.findByIdAndUpdate(userId, {
      $addToSet: { connections: request.sender._id },
    });
    await User.findByIdAndUpdate(request.sender._id, {
      $addToSet: { connections: userId },
    });

    res.json({ message: "Connection rejected successfully" });
  } catch (error) {
    console.error(
      "Error in rejectConnectionRequest controller: ",
      error.message,
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConnectionRequests = async (req, res) => {
  const userId = req.user._id;
  try {
    const requests = await ConnectionRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "name username profilePicture headline connections");
    return res.json(requests);
  } catch (error) {
    console.error("Error in getConnectionRequests controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserConnections = async (req, res) => {
  const userId = req.user._id;
  try {
    const connections = await User.findById(userId).populate(
      "connections",
      "name username profilePicture headline connections",
    );
    return res.json(connections);
  } catch (error) {
    console.error("Error in getUserConnections controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeConnection = async (req, res) => {
  const id = req.user._id;
  const { userId } = req.params;
  try {
    await User.findByIdAndUpdate(id, { $pull: { connections: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { connections: id } });
    return res.json({ message: "Connection removed successfully" });
  } catch (error) {
    console.error("Error in removeConnection controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getConnectionStatus = async (req, res) => {
  const { userId } = req.params;
  const id = req.user._id;
  const currentUser = req.user;
  if (currentUser.connections.includes(userId)) {
    return res.json({ status: "connected" });
  }
  try {
    const pendingRequest = await ConnectionRequest.findOne({
      $or: [
        { sender: userId, recipient: id },
        { sender: id, recipient: userId },
      ],
      status: "pending",
    });
    if (pendingRequest) {
      if (pendingRequest.sender.toString() === id.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }
    res.json({ status: "not_connected" });
  } catch (error) {
    console.error("Error in getConnectionStatus controller: ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
