import React, { useState, useEffect } from "react";
import { addSignup } from "../../config/Myservice";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = /^[a-zA-Z ]{2,100}$/;
const regForUsername = RegExp(
  /^(?=.{4,20}$)(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/
);
const regForPassword = RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);
const regForcontactNumber = RegExp(
  /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
);
function Signup() {
  const navigate = useNavigate();

  const [alertmsg, setAlertmsg] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    contactNumber: "",
    pimg: "",
    password: "",
    repeatpassword: "",
  });
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    contactNumber: "",
    pimg: "",
    password: "",
    repeatpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const override = `
  display: block;
  margin: 230px auto;
  border-color: red;
`;
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  const handler = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "fname":
        let efname = regForName.test(value) ? "" : "Please Enter Valid Name";
        setErrors({ ...errors, fname: efname });

        break;
      case "lname":
        let elname = regForName.test(value) ? "" : "Please Enter Valid Name";
        setErrors({ ...errors, lname: elname });
        break;
      case "email":
        let eemail = regForEmail.test(value) ? "" : "Enter Valid Email";
        setErrors({ ...errors, email: eemail });
        break;
      case "contactNumber":
        let cno = regForcontactNumber.test(value)
          ? ""
          : "Enter Valid Mobile Number";
        setErrors({ ...errors, contactNumber: cno });
        break;
      case "password":
        let epassword = regForPassword.test(value)
          ? ""
          : "Enter Valid Password";
        setErrors({ ...errors, password: epassword });
        break;
      case "repeatpassword":
        let erepeatpassword =
          value !== user.password ? "Password Dont Match" : "";
        setErrors({ ...errors, repeatpassword: erepeatpassword });
        break;

      default:
    }
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const formSubmit = async (event) => {
    event.preventDefault();
    let pimg = document.querySelector('input[type="file"]').files[0];

    if (
      validate(errors) &&
      user.fname &&
      user.lname &&
      user.email &&
      user.contactNumber &&
      user.password &&
      user.repeatpassword &&
      pimg
    ) {
      let formdata = new FormData(); //formdata object

      const email = user.email;
      formdata.append("fname", user.fname);
      formdata.append("lname", user.lname);
      formdata.append("password", user.password);
      formdata.append("contactNumber", user.contactNumber);
      formdata.append("myfile", pimg);
      formdata.append("email", user.email);

      const config = {
        headers: {
          "Content-Type":
            "multipart/form-data; boundary=AaB03x" +
            "--AaB03x" +
            "Content-Disposition: file" +
            "Content-Type: png" +
            "Content-Transfer-Encoding: binary" +
            "...data... " +
            "--AaB03x--",
          Accept: "application/json",
          type: "formData",
          Authentication: `Bearer ${localStorage.getItem("_token")}`,
        },
      };

      addSignup(formdata, config).then((res) => {
        if (res.data.err === 0) {
          setAlertmsg("Registered Succesfully");
          setOpen2(true);

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else if (res.data.err === 2) {
          setAlertmsg("User Already Exist. Please Login");
          setOpen(true);

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setAlertmsg("Something Went Wrong");
          setOpen(true);
        }
      });
    } else {
      setAlertmsg("Please Enter Valid Data");
      setOpen(true);
    }
  };
  const validate = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  if (localStorage.getItem("login")) {
    return <h1>You Are Logged In</h1>;
  } else {
    return (
      <div>
        {loading ? (
          <ClimbingBoxLoader
            color={"rgb(147, 250, 165)"}
            loading={loading}
            css={override}
            size={40}
          />
        ) : (
          <Container className="mt-3">
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%", height: "100%" }}
              >
                {alertmsg}
              </Alert>
            </Snackbar>
            <Snackbar
              open={open2}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: "100%", height: "100%" }}
              >
                {alertmsg}
              </Alert>
            </Snackbar>
            <div className="formadjustsignup">
              <Form id="myForm ">
                <h1 className="fontapply">Register to QMaker</h1>
                <br />

                <Form.Group>
                  <Form.Label></Form.Label>
                  <Row className="justify-content-md-center">
                    <Col xs lg="5">
                      <Form.Control
                        placeholder="First name"
                        name="fname"
                        id="fname"
                        onChange={handler}
                        isValid={user.fname !== "" ? true : false}
                        isInvalid={errors.fname !== "" ? true : false}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.fname}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs lg="5">
                      <Form.Control
                        placeholder="Last name"
                        name="lname"
                        id="lname"
                        onChange={handler}
                        isValid={user.lname !== "" ? true : false}
                        isInvalid={errors.lname !== "" ? true : false}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lname}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group>
                  <Row className="justify-content-md-center">
                    <Col xs lg="10">
                      <Form.Label></Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        id="email"
                        onChange={handler}
                        isValid={user.email !== "" ? true : false}
                        isInvalid={errors.email !== "" ? true : false}
                      />
                      <Form.Group>
                        <Row className="justify-content-md-center">
                          <Col xs lg="10">
                            <Form.Label></Form.Label>
                            <Form.Control
                              type="tel"
                              placeholder="Enter Contact No"
                              name="contactNumber"
                              id="contactNumber"
                              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                              onChange={handler}
                              isValid={user.contactNumber !== "" ? true : false}
                              isInvalid={
                                errors.contactNumber !== "" ? true : false
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.contactNumber}
                            </Form.Control.Feedback>
                          </Col>
                        </Row>
                      </Form.Group>
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group>
                  <Form.Label></Form.Label>
                  <Row className="justify-content-md-center">
                    <Col xs lg="5">
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        id="password"
                        onChange={handler}
                        isValid={user.password !== "" ? true : false}
                        isInvalid={errors.password !== "" ? true : false}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs lg="5">
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        name="repeatpassword"
                        id="repeatpassword"
                        onChange={handler}
                        isValid={user.repeatpassword !== "" ? true : false}
                        isInvalid={errors.repeatpassword !== "" ? true : false}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.repeatpassword}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group>
                  <Row className="justify-content-md-center">
                    <Col xs lg="10">
                      <Form.Group controlId="formFile" className="mb-3">
                        <br />
                        <Form.Label className="font-weight-bold">
                          Profile Picture
                        </Form.Label>
                        <Form.Control
                          type="file"
                          placeholder="Profile Picture"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form.Group>
                <br />

                <Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={formSubmit}
                    className="submitBtnsignup"
                  >
                    SignUp
                  </Button>
                </Form.Group>
                <br />
              </Form>
            </div>
          </Container>
        )}{" "}
      </div>
    );
  }
}

export default Signup;
