import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./database";
import errorHandler from "./src/middlewares/errors/errorHandler";
import { notFound } from "./src/middlewares/errors/notFound";
import { IRoomUsers } from "./src/database/models/roomUsers.model";
import { IUser, UserSchema } from "./src/database/models/user.models";


dotenv.config();

const app = express();
const http = require("http").Server(app);
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/room", require("./src/routes/room.route"));
app.use("/api/user", require("./src/routes/user.route"));
app.use("/api/roomMessages", require("./src/routes/roomMessages.route"));

connectDB();

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world"
  });
});

app.get('/test-db-connection', async (req, res) => {
  try {
    // Perform a simple database operation
    const result = await UserSchema.findOne();

    // Log the result
    console.log('Database Connection Successful:', result);

    // Send a response
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    // Log any errors
    console.error('Database Connection Error:', error);
    res.status(500).json({ success: false, message: 'Database connection error' });
  }
});


const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*"
  }
});

let users: IRoomUsers[] = [];

socketIO.on("connection", (socket) => {
  const socketUsers = {};

  socket.on("user", (data: IRoomUsers) => {

    const { _id: userId, roomId: roomId, userName: userName } = data;
    socket.userId = userId!;
    socket.roomId = roomId;
    socket.userName = userName;

    if (!socket.userName || !data._id) {
      return;
    }

    if (socketUsers[userId!]) {
      socket = socketUsers[userId!];
    } else {
      socketUsers[userId!] = socket;
    }

    const existingUserInRoom = users.some(
      (user) => user._id === data._id && user.roomId === data.roomId
    );

    if (!existingUserInRoom) {
      users.push(data);
    }

    const roomUsers = users.filter((user) => user.roomId === data.roomId);
    socket.join(data.roomId);

    socketIO.to(data.roomId).emit("userResponse", roomUsers);
  });

  socket.on("getAllUsers", () => {
    socketIO.emit("allUsersResponse", users);
  });

  socket.on("sendRoomMessage", (data) => {
    socketIO.to(data.roomId).emit("sendRoomMessageResponse", data);
  });

  socket.on("disconnect", () => {
    users = users.filter(
      (user) => !(user._id === socket.userId && user.roomId === socket.roomId)
    );
    socketIO.emit("userResponse", users);
    socket.disconnect();
  });
});

http.listen(PORT, () => {
});
