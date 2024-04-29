import { verifyToken } from "@/utils/auth";
import usersModel from "@/models/user";
import React from "react";

function PAdmin({ user }) {
  return (
    <div className="font-sans">
      <h1>
        Welcome To Admin Panel ❤️ {user.firstname} - {user.lastname}
      </h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  const tokenPayload = verifyToken(token);
  // console.log(isValidToken);

  if (!tokenPayload) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  // const user = await usersModel.findOne({ email: tokenPayload.email})
  const user = await usersModel.findOne(
    { email: tokenPayload.email },
    "-_id firstname lastname role"
  );

  if (user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}

export default PAdmin;
