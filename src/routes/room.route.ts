import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { IRoom, RoomSchema } from "../database/models/room.model";
import {RoomMessagesSchema} from "../database/models/roomMessages.model"

const router = Router();

router.post(
  "/createRoom",
  [body("name").not().isEmpty()],
  async (req: Request, res: Response) => {
    try {
      const room = new RoomSchema<IRoom>({
        name: req.body.name
      });
      const savedRoom = await room.save();
      return res.json(savedRoom);
    } catch (err: any) {
      return res.status(500).send("Something went wrong");
    }
  }
);

router.get("/getRooms", async (req: Request, res: Response) => {
  try {
    const rooms = await RoomSchema.find().sort({
      timestamps: "asc"
    });

    if (!rooms) {
      return res.status(404).json({ msg: "No rooms found" });
    }
    return res.json(rooms);
  } catch (err: any) {
    return res.status(500).send("Something went wrong");
  }
});

router.delete("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    // Find the room first to ensure it exists
    const room = await RoomSchema.findById(roomId);
    if (!room) {
      return res.status(404).send("Room not found");
    }

    // Delete all messages associated with the room
    await RoomMessagesSchema.deleteMany({ roomId });

    // After confirming that messages are deleted, delete the room
    await RoomSchema.findByIdAndDelete(roomId);

    res.json({ message: `Room with ID ${roomId} and all associated messages have been deleted.` });
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
});


module.exports = router;
