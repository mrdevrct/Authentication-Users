import React from "react";
import { verifyToken } from "@/utils/auth";
import usersModel from "@/models/user"

function Dashboard({ user }) {
  return (
    <>
      <h1 className="font-sans">{user.firstname} - {user.lastname} - Welcome To Dashboard</h1>
    </>
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
  const user = await usersModel.findOne({ email: tokenPayload.email},"-_id firstname lastname")

  
  console.log(user);

  return {
    props: {
      user : JSON.parse(JSON.stringify(user))
    },
  };
}

export default Dashboard;
