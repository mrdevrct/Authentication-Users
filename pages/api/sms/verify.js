const otpModel = require("@/models/otp");
import { serialize } from "cookie";
import UserModel from "@/models/user";
import { generateToken } from "@/utils/auth";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return false;
  }

  const { phone, code } = req.body;

  const otp = await otpModel.findOne({ phone, code });

  if (otp) {
    const date = new Date();
    const now = date.getTime();

    if (otp.expTime > now) {
      const user = await UserModel.findOne({ phone });
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
    } else {
      return res.status(410).json({ message: "Code Expierd !!!" });
    }
  } else {
    return res.status(409).json({ message: "Code is Not Correct" });
  }
};

export default handler;
