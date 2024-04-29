import { serialize } from "cookie";

const handler = (req, res) => {
  if (req.method !== "GET") {
    return false;
  }

  return res
  .status(200)
  .setHeader(
    "Set-Cookie",
    serialize("token", "", {
      path: "/",
      maxAge: 0,
    })
  )
  .json({ message: `User Login successfully :) ` });
};

export default handler;
