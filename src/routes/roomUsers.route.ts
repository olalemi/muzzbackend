import express, { Request, Response } from "express";
import { RoomUsersSchema, IRoomUsers } from "../database/models/roomUsers.model";

const router = express.Router();

router.post("/createRoomUser", async (req: Request, res: Response) => {
  const { userId, roomId, userName} =
    req.body;

  const roomUsers = new RoomUsersSchema<IRoomUsers>({
    userId,
    roomId,
    userName,
  });

  try {
    const existingUserRoom = await RoomUsersSchema.findOne({
      roomId: roomId,
      userId: userId
    });

    if (existingUserRoom) {
      return res.json(existingUserRoom);
    }
    const savedRoomusers = await roomUsers.save();
    res.status(201).json(savedRoomusers);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Something went wrong");
  }
});

router.get("/roomUsers/:roomId", async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const roomUsersInRoom: IRoomUsers[] = await RoomUsersSchema.find({
      roomId
    });

    if (!roomUsersInRoom) {
      return res.status(404).send({ message: "No roomusers here" });
    }
    res.json(roomUsersInRoom);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send("Something went wrong");
  }
});

module.exports = router;