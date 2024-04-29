import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Index() {
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(()=>{
    fetch("/api/auth/me").then((res)=>{
      if (res.status === 200) {
        router.replace("/dashboard")
      }
    })
  },[])


  const addNewUser = async (event) => {
    event.preventDefault();
    const user = { firstname, lastname, username, password, email , phone};
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.status === 201) {
      setFirstname("");
      setLastname("");
      setUsername("");
      setPassword("");
      setEmail("");
      setPhone("");

      alert("User created successfully");
      router.replace("/dashboard");
    } else if (res.status === 422) {
      alert("This Username or email or phone exit already !");
    } else if (res.status === 500) {
      alert("Internal Server Error");
    }

    // console.log(res);
  };

  return (
    <div className="box">
      <h1 align="center">SignUp Form</h1>
      <form role="form" method="post">
        <div className="inputBox">
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Firstname</label>
        </div>
        <div className="inputBox">
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Lastname</label>
        </div>
        <div className="inputBox">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Username</label>
        </div>
        <div className="inputBox">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Email</label>
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
        <div className="inputBox">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Phone</label>
        </div>

        <input
          type="submit"
          className="register-btn"
          value="Sign Up"
          onClick={addNewUser}
        />

        <a style={{ display: "flex ", justifyContent : "center" , marginTop : "20px" }} href="/signin/email-login">Login in email</a>
      </form>
    </div>
  );
}

export default Index;
