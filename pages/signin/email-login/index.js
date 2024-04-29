import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Index() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then((res) => {
      if (res.status === 200) {
        router.replace("/dashboard");
      }
    });
  }, []);

  const signIn = async (event) => {
    event.preventDefault();

    const user = { identifier, password };

    const res = await fetch(`/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.status === 200) {
      alert("User signed in successfully");
      router.replace("/dashboard");
    } else if (res.status === 422) {
      alert("Password or Email is Not correct!");
    } else if (res.status === 404) {
      alert("User not found");
    } else if (res.status === 500) {
      alert("Internal Server Error");
    }
  };

  return (
    <div className="box">
      <h1 align="center">Login Form</h1>
      <form role="form" method="post">
        <div className="inputBox">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Username</label>
        </div>
        <div className="inputBox">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Password</label>
        </div>

        <input
          type="submit"
          className="register-btn"
          onClick={signIn}
          value="Sign In"
        />

        <div
          style={{
            display: "flex ",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <a style={{ marginRight : "20px"}} href="/signin/sms-login">Login in phone</a>
          <a style={{ marginLeft : "20px"}} href="/signup">Create Account</a>
        </div>
      </form>
    </div>
  );
}

export default Index;
