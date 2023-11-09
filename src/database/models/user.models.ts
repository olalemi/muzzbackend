import { Schema, model } from "mongoose";
import { IBase } from "../../interfaces/IBase";

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export interface IUser extends IBase {
  userName: string;
}

const UserSchema = model<IUser>("Users", userSchema);
export { UserSchema };
