import { serialize } from "cookie";
import connectToDB from "@/configs/db";
import usersModel from "@/models/user";
import { hashPassword } from "@/utils/auth";
import { generateToken } from "@/utils/auth";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return false;
  }

  try {
    connectToDB();

    const { firstname, lastname, username, email, password , phone} = req.body;

    // Validation
    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() || 
      !phone.trim()
    ) {
      return res.status(422).json({ message: "Data is not valid !!" });
    }

    const isUserExist = await usersModel.findOne({
      $or: [{ username }, { email } , { phone }],
    });

    if (isUserExist) {
      return res
        .status(422)
        .json({ message: "This Username or email exit already !" });
    }

    const hashedPassword = await hashPassword(password);
    const token = generateToken({ email });
    const users = await usersModel.find({});

    await usersModel.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      phone,
      role: users.length > 0 ? "USERS" : "ADMIN",
    });

    return res
      .setHeader(
        "Set-Cookie",
        serialize("token", token, {
          httpOnly: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
      )
      .status(201)
      .json({ message: `User created successfully :) ` });
  } catch (err) {
    return res.status(500).json({ message: `Internal Server Error : ${err}` });
  }
};

export default handler;
