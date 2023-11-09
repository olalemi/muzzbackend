import mongoose, { Document, Model, Schema, model } from "mongoose";
import { IBase } from "../../interfaces/IBase";

const roomSchema = new Schema<IRoom>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export interface IRoom extends IBase {
  name: string;
}

const RoomSchema = model<IRoom>("Rooms", roomSchema);
export { RoomSchema };
