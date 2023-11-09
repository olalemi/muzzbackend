import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { IUser, UserSchema } from "../database/models/user.models";

const router = Router();

router.post(
  "/createUser",
  [body("userName").not().isEmpty()],
  async (req: Request, res: Response) => {
    try {
      const user = new UserSchema<IUser>({
        userName: req.body.userName
      });

      const savedUser = await user.save();
      return res.json(savedUser);
    } catch (err: any) {
      return res.status(500).send("Something went wrong");
    }
  }
);

router.get("/getUsers", async (req: Request, res: Response) => {
  try {
    const users = await UserSchema.find();

    if (!users) {
      return res.status(404).json({ msg: "No users found" });
    }
    return res.json(users);
  } catch (err: any) {
    return res.status(500).send("Something went wrong");
  }
});

router.get("/getCurrentUser/:id", async (req: Request, res: Response) => {
  try {
    const user = await UserSchema.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }
    return res.json(user);
  } catch (err: any) {
    return res.status(500).send("Something went wrong");
  }
});

module.exports = router;
