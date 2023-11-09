import crypto from "crypto";
import { Schema, model } from "mongoose";
import { IBase } from "../../interfaces/IBase";

const userMessageSchema = new Schema({
  userId: String,
  userName: String,
  message: String,
  messageTime: Number,
  iv: String
});

const roomMessagesSchema = new Schema<IRoomMessage>(
  {
    roomId: {
      type: String,
      ref: "Room",
      required: true
    },
    name: {
      type: String
    },
    messages: {
      type: [userMessageSchema]
    }
  },
  { timestamps: true }
);

function encryptMessage(message: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.MESSAGE_SECRET_KEY!, "hex"),
    iv
  );
  let encryptedMessage = cipher.update(message, "utf-8", "hex");
  encryptedMessage += cipher.final("hex");
  return {
    encryptedMessage,
    iv: iv.toString("hex")
  };
}

function decryptMessage(encryptedMessage: string, iv: string) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.MESSAGE_SECRET_KEY!, "hex"),
    Buffer.from(iv, "hex")
  );
  let decryptedMessage = decipher.update(encryptedMessage, "hex", "utf-8");
  decryptedMessage += decipher.final("utf-8");
  return decryptedMessage;
}

export interface IRoomMessage {
  roomId: string;
  name: string;
  messages: IUserMessage[];
}

export interface IUserMessage {
  userId: string;
  userName: string;
  message: string;
  messageTime: Number;
  iv: string;
}

const RoomMessagesSchema = model<IRoomMessage>(
  "RoomMessages",
  roomMessagesSchema
);
export { RoomMessagesSchema, decryptMessage, encryptMessage };
