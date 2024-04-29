const request = require("request");
const otpModel = require("@/models/otp");

import connectToDB from "@/configs/db";
import usersModel from "@/models/user";

// اضافه کردن متغیر global برای ذخیره زمان آخرین درخواست
let lastRequestTime = 0;

const handler = async (req, res) => {
  connectToDB();

  if (req.method !== "POST") {
    return false;
  }

  const { phone } = req.body;

  const user = await usersModel.findOne({ phone });

  if (!user) {
    return res.status(404).json({ message: "کاربری با این شماره یافت نشد" });
  }

  const currentTime = Date.now();

  // بررسی زمان گذشته از آخرین درخواست (2 دقیقه)
  if (currentTime - lastRequestTime < 120000) {
    return res.status(429).json({ message: "لطفاً پس از 2 دقیقه دوباره تلاش کنید" });
  }

  const date = new Date();
  const expTime = date.getTime() + 300000;

  const code = Math.floor(Math.random() * 99999);

  request.post(
    {
      url: "http://ippanel.com/api/select",
      body: {
        op: "pattern",
        user: "u09023883441",
        pass: "Faraz@1427240372938515",
        fromNum: "30002349233430",
        toNum: phone,
        patternCode: "2m3l9rwnh9veqmv",
        inputData: [{ "verification-code": code }],
      },
      json: true,
    },
    async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // ذخیره زمان فعلی به عنوان آخرین درخواست موفق
        lastRequestTime = currentTime;

        await otpModel.create({
          phone,
          code,
          expTime,
        });

        return res.status(201).json({ message: "کد با موفقیت ارسال شد :))" });
      } else {
        // console.log("whatever you want");
        return res.status(500).json({ message: "خطای نامشخص !!" });
      }
    }
  );
};

export default handler;
