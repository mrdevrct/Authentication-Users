import { serialize } from "cookie";
import connectToDB from "@/configs/db";
import usersModel from "@/models/user";
import { verifyPassword } from "@/utils/auth";
import { generateToken } from "@/utils/auth";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return false;
  }

  try {
    connectToDB();
    const { identifier, password } = req.body;
    if (!identifier.trim() || !password.trim()) {
      return res.status(422).json({ message: "Data is not valid !!" });
    }

    const user = await usersModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res
        .status(422)
        .json({ message: "Password or Email is Not correct!" });
    }

    const token = generateToken({ email: user.email });

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res
      .status(200)
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
      )
      .json({ message: `User Login successfully :) ` });
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error : ${err}` });
  }
};

export default handler;
