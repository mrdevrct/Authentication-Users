import React, { useEffect, useState } from "react";
import Link from "next/link";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faSignOut, faSolarPanel, faBars} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userAuth = async () => {
      const res = await fetch("/api/auth/me");

      if (res.status === 200) {
        setIsLogin(true);
        const {data : user } = await res.json();
        if (user.role === "ADMIN") {
          setIsAdmin(true);
        }
      }
    };
    userAuth();
  }, []);

  const logoutHandler = async () => {
    const res = await fetch("/api/auth/signout");
    const data = await res.json();
    // console.log("res => " , res);
    // console.log("data => " , data);

    if (res.status === 200) {
      alert("user logout successfully :)");
      setIsLogin(false);
      setIsAdmin(false);

      router.replace('/signin')
    }
  }

  return (
    <div className="container">
      <aside className="sidebar">
        <h3 className="sidebar-title">Sidebar</h3>

        <ul className="sidebar-links">
          <>
            {/* User is login */}
            {isLogin && (
              <>
                <li>
                  <Link href="/dashboard">
                    <span>
                      <FontAwesomeIcon icon={faBars} />
                    </span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" onClick={logoutHandler}>
                    <span>
                      <FontAwesomeIcon icon={faSignOut} />
                    </span>
                    Logout
                  </Link>
                </li>
              </>
            )}
            {/* User is login */}
          </>
          <>
            {/* User not login */}
            {!isLogin && (
              <>
                <li>
                  <Link href="/signin/email-login">
                    <span>
                      <FontAwesomeIcon icon={faSignIn} />
                    </span>
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/signup">
                    <span>
                      <FontAwesomeIcon icon={faSignIn} />
                    </span>
                    Sign up
                  </Link>
                </li>
              </>
            )}
            {/* User not login */}
          </>
          {/* User is login & admin */}
          {isAdmin && (
            <>
              <li>
                <Link href="/p-admin">
                  <span>
                    <FontAwesomeIcon icon={faSolarPanel} />
                  </span>
                  Admin panel
                </Link>
              </li>
            </>
          )}
        </ul>
      </aside>
      <main className="main"></main>
    </div>
  );
}

export default Index;
