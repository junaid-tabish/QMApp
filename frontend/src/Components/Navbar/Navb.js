import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navb.css";
import { useDispatch, useSelector } from "react-redux";

function Navb() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = useSelector((state) => state.login);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch({ type: "isuser" });
    }
  }, []);
  const logouthandler = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("user");
    localStorage.removeItem("_token");
    dispatch({ type: "isuser" });
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark addhovor fontapplynav">
        <div className="container-fluid">
          <a className="navbar-brand font-weight-bold" href="#">
            Q
            <span style={{ color: "rgb(0, 177, 106)", textAlign: "center" }}>
              Maker
            </span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <NavLink
                  to="/"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <a className="nav-link ml-3 mr-3">
                    Home
                    <span className="sr-only">(current)</span>
                  </a>
                </NavLink>{" "}
              </li>
              {!login ? (
                <>
                  <li className="nav-item active">
                    <NavLink
                      to="/login"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <a className="nav-link ml-3 mr-3">
                        Login
                        <span className="sr-only">(current)</span>
                      </a>
                    </NavLink>{" "}
                  </li>
                  <li className="nav-item active">
                    <NavLink
                      to="/signup"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <a className="nav-link ml-3 mr-3">
                        SignUp
                        <span className="sr-only">(current)</span>
                      </a>
                    </NavLink>{" "}
                  </li>
                </>
              ) : (
                <div></div>
              )}
            </ul>
            &nbsp; &nbsp;
            <ul className="navbar-nav">
              {login ? (
                <>
                  <li className="nav-item active">
                    <NavLink
                      to="/qmaker"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <a className="nav-link ml-3 mr-3">
                        Question Maker
                        <span className="sr-only">(current)</span>
                      </a>
                    </NavLink>{" "}
                  </li>

                  <li className="nav-item active dropdown mr-3 ">
                    <a
                      onClick={() => logouthandler()}
                      variant="outline-dark"
                      className="btn w-100 text-white"
                    >
                      Log Out
                    </a>
                  </li>
                </>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navb;
