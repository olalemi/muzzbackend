import { Schema, model } from "mongoose";
import { IBase } from "../../interfaces/IBase";

const roomUsersSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    roomId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export interface IRoomUsers extends IBase {
  userId: string;
  roomId: string;
  userName: string;
}

const RoomUsersSchema = model<IRoomUsers>("RoomUsers", roomUsersSchema);
export { RoomUsersSchema };
