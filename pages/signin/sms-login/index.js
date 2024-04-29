import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";

function Index() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((res) => {
      if (res.status === 200) {
        router.replace("/dashboard");
      }
    });
  }, []);

  //
  const sendCode = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    if (res.status === 201) {
      setIsCodeSent(true);

      swal({
        title: "Code Sent Successfully",
        icon: "success",
        button: "Enter Code",
      });
    }

    if (res.status === 429) {
      swal({
        title: "Please try again after 2 minutes",
        icon: "error",
        button: "Close",
      });
    }
    if (res.status === 404) {
      swal({
        title: "User Not Found",
        icon: "error",
        button: "close",
      });
    }

    // console.log("res => ", res);
  };

  const verifyCode = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/sms/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, code }),
    });

    if (res.status === 200) {
      swal({
        title: "Login Successfully",
        icon: "success",
        button: "Enter",
      });

      router.push("/dashboard");
    } else if (res.status === 410) {
      swal({
        title: "Code Expierd !!!",
        icon: "error",
        button: "close",
      });
    } else if (res.status === 409) {
      swal({
        title: "Code is Not Correct",
        icon: "error",
        button: "close",
      });
    }

    console.log("res => ", res);
  };

  return (
    <div className="box">
      <h1 align="center">Login Form</h1>
      <form role="form" method="post">
        {isCodeSent ? (
          <>
            <div className="inputBox">
              <input
                type="text"
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(event.target.value)}
                required
              />
              <label>Code</label>
            </div>
            <input
              type="submit"
              className="register-btn"
              onClick={verifyCode}
              value="Verify Code"
            />
          </>
        ) : (
          <>
            <div className="inputBox">
              <input
                type="text"
                autoComplete="off"
                value={phone}
                onChange={(e) => setPhone(event.target.value)}
                required
              />
              <label>Phone Number</label>
            </div>
            <input
              type="submit"
              className="register-btn"
              onClick={sendCode}
              value="Send Code"
            />

            <div
              style={{
                display: "flex ",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <a style={{ marginRight: "20px" }} href="/signin/email-login">
                Login in email
              </a>
              <a style={{ marginLeft: "20px" }} href="/signup">
                Create Account
              </a>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default Index;
