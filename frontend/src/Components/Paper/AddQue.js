import React, { useState, useRef, useEffect } from "react";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { useNavigate } from "react-router-dom";

import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { addToExisting } from "../../config/Myservice";
// import "";
import "../Qmaker/Qmaker.css";
import { Button, Row, Col, Form, Container, Table } from "react-bootstrap";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
const regForName = /^[a-zA-Z ]{2,100}$/;

function AddQue() {
  let { id } = useParams();

  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [alertmsg, setAlertmsg] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [convertedContent, setConvertedContent] = useState(null);
  const [updatebtn, setUpdatebtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allque, setAllque] = useState([]);
  const [question, setQuestion] = useState({
    id: "",
    qtype: "",
    que: "",
    ansA: "",
    ansB: "",
    ansC: "",
    ansD: "",
    ansBrief: "",
    ansBool: "",
    marks: null,
    mcqans: "",
    date: null,
  });
  const [errors, setErrors] = useState({
    subject: "",
    qtype: "",
    que: "",
    ansA: "",
    ansB: "",
    ansC: "",
    ansD: "",
    ansBrief: "",
    ansBool: "",
    marks: "",
    date: "",
  });
  const override = `
    display: block;
    margin: 230px auto;
    border-color: red;
  `;
  const qtype = useRef();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user"))) {
      navigate("/login");
    }
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    convertContentToHTML();
  };
  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  const handler = (e) => {
    const { name, value } = e.target;
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const currentDate = `${year}-${month}-${day}`;

    setQuestion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    switch (name) {
      case "lname":
        let eqtype = regForName.test(value)
          ? ""
          : "Please Enter Valid Question Type";
        setErrors({ ...errors, qtype: eqtype });
        break;
      case "que":
        let eque = value.length > 5 ? "" : "Please Enter Valid Question";
        setErrors({ ...errors, que: eque });
        break;
      case "ansA":
        let eansA = value.length > 2 ? "" : "Enter Valid Option";
        setErrors({ ...errors, ansA: eansA });
        break;
      case "ansB":
        let eansB = value.length > 2 ? "" : "Enter Valid Option";
        setErrors({ ...errors, ansB: eansB });
        break;
      case "ansC":
        let eansC = value.length > 2 ? "" : "Enter Valid Option";
        setErrors({ ...errors, ansC: eansC });
        break;
      case "ansD":
        let eansD = value.length > 2 ? "" : "Enter Valid Option";
        setErrors({ ...errors, ansD: eansD });
        break;
      case "marks":
        let emarks = value > 0 ? "" : "Should be > 0";
        setErrors({ ...errors, marks: emarks });
        break;

      case "date":
        let edate =
          value < currentDate ? "date should be greater than current date" : "";
        setErrors({ ...errors, date: edate });
        break;
      default:
    }
  };
  const addHandlercall = () => {
    let que = {
      id: Math.random(),
      qtype: question.qtype,
      que: question.que,
      ansBrief: convertedContent,
      ansBool: question.ansBool,
      ansA: question.ansA,
      ansB: question.ansB,
      ansC: question.ansC,
      ansD: question.ansD,
      marks: question.marks,
      date: question.date,
      mcqans: question.mcqans,
    };

    setAllque((allque) => [...allque, que]);

    setQuestion({
      ...question,
      qtype: "",
      que: "",
      ansA: "",
      ansB: "",
      ansC: "",
      ansD: "",
      ansBrief: "",
      ansBool: "",
      marks: "",
      date: "",
      mcqans: null,
    });
    EditorState.createEmpty();
    document.getElementById("myForm").reset();

    setConvertedContent("");
    setAlertmsg("Successfully Added");
    setOpen2(true);
    setTimeout(() => {
      setOpen(false);
      setOpen2(false);
    }, 1000);
  };
  const addHandler = () => {
    if (
      validate(errors) &&
      question.qtype &&
      question.que &&
      question.marks &&
      question.date
    ) {
      if (question.qtype === "MCQ") {
        if (question.ansA && question.ansB) {
          if (question.mcqans) {
            addHandlercall();
          } else {
            setAlertmsg("Please Select Correct Ans");
            setOpen(true);
          }
        } else {
          setAlertmsg("Enter Atleast Two Options");
          setOpen(true);
        }
      } else {
        addHandlercall();
      }
    } else {
      setAlertmsg("Enter All Fields");
      setOpen(true);
    }
  };
  const validate = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  const finalSubmit = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user.email;

    if (allque.length > 0) {
      addToExisting({ allque: allque }, id).then((res) => {
        setAlertmsg("Submitted");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      });
    } else {
      setAlertmsg("Please Add Atleast One Question");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setOpen2(false);
      }, 1000);
    }
  };
  const deleteHandler = (que) => {
    const updatedallque = allque.filter((item) => item.que !== que);
    setAllque(updatedallque);
    setOpen(false);
  };
  const editHandler = (que) => {
    setQuestion(que);
    setUpdatebtn(true);
  };
  const updateHandler = (ques) => {
    const index = allque.findIndex((element) => element.id === ques.id);
    let upallque = allque;
    let que = {};
    if (convertedContent) {
      que = {
        ...question,
        ansBrief: convertedContent,
      };
    } else {
      que = question;
    }

    upallque[index] = que;
    setAllque(upallque);
    setAlertmsg("Question Updated");
    setOpen2(true);
    setTimeout(() => {
      setOpen(false);
      setOpen2(false);
    }, 1000);
    setUpdatebtn(false);
    setQuestion({
      ...question,
      qtype: "",
      que: "",
      ansA: "",
      ansB: "",
      ansC: "",
      ansD: "",
      ansBrief: "",
      ansBool: "",
      marks: "",
      mcqans: null,
    });
    EditorState.createEmpty();
    setConvertedContent("");
    document.getElementById("myForm").reset();
  };
  return (
    <div>
      {loading ? (
        <ClimbingBoxLoader
          color={"#D73636"}
          loading={loading}
          css={override}
          size={40}
        />
      ) : (
        <Container className="mt-3">
          <Snackbar
            open={open}
            autoHideDuration={1000}
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
            autoHideDuration={1000}
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
          <div className="formadjustqmaker">
            <Form id="myForm">
              <h1 className="fontapply">Add Question </h1>
              <br />
              <div className="form-group row">
                <label
                  for="inputPassword3"
                  className="col-sm-3 col-form-label font-weight-bold"
                >
                  Question Type
                </label>
                {updatebtn ? (
                  <div className="col-sm-9">
                    <Form.Control
                      type="text"
                      custom
                      ref={qtype}
                      onChange={handler}
                      name="qtype"
                      defaultValue={question.qtype}
                      readOnly
                      isValid={question.qtype !== "" ? true : false}
                      isInvalid={errors.qtype !== "" ? true : false}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.qtype}
                    </Form.Control.Feedback>
                  </div>
                ) : (
                  <div className="col-sm-9">
                    <Form.Control
                      as="select"
                      custom
                      ref={qtype}
                      onChange={handler}
                      name="qtype"
                      defaultValue={question.qtype}
                      isValid={question.qtype !== "" ? true : false}
                      isInvalid={errors.qtype !== "" ? true : false}
                    >
                      <option selected>Choose...</option>
                      <option value="MCQ">MCQ</option>
                      <option value="True/False">True/False</option>
                      <option value="Brief">Brief</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.qtype}
                    </Form.Control.Feedback>
                  </div>
                )}
              </div>
              <div className="form-group row">
                <label
                  for="inputPassword3"
                  className="col-sm-3 col-form-label font-weight-bold"
                >
                  Question
                </label>
                <div className="col-sm-9">
                  <Form.Control
                    type="text"
                    className="form-control"
                    placeholder="Question"
                    onChange={handler}
                    name="que"
                    defaultValue={question.que}
                    isValid={question.que !== "" ? true : false}
                    isInvalid={errors.que !== "" ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.que}
                  </Form.Control.Feedback>
                </div>
              </div>
              {question.qtype === "MCQ" && (
                <div className="form-group row">
                  <label
                    for="inputPassword3"
                    className="col-sm-3 col-form-label font-weight-bold"
                  >
                    Answer
                  </label>
                  <div className="col-sm-9">
                    <Row>
                      <Col className="sm-2 ">
                        <input
                          type="radio"
                          value={question.ansA}
                          name="mcqans"
                          onChange={handler}
                        />{" "}
                      </Col>

                      <Col className="sm-10 radioadjust">
                        <Form.Control
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          placeholder="A"
                          onChange={handler}
                          name="ansA"
                          defaultValue={question.ansA}
                          isValid={question.ansA !== "" ? true : false}
                          isInvalid={errors.ansA !== "" ? true : false}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.ansA}
                        </Form.Control.Feedback>
                      </Col>
                      <Col className="sm-2">
                        <input
                          type="radio"
                          value={question.ansB}
                          name="mcqans"
                          onChange={handler}
                        />{" "}
                      </Col>
                      <Col className="sm-10 radioadjust">
                        <Form.Control
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          placeholder="B"
                          onChange={handler}
                          defaultValue={question.ansB}
                          name="ansB"
                          isValid={question.ansB !== "" ? true : false}
                          isInvalid={errors.ansB !== "" ? true : false}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.ansB}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col className="sm-2">
                        <input
                          type="radio"
                          value={question.ansC}
                          name="mcqans"
                          onChange={handler}
                        />{" "}
                      </Col>
                      <Col className="sm-10 radioadjust">
                        <Form.Control
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          placeholder="C"
                          onChange={handler}
                          defaultValue={question.ansC}
                          name="ansC"
                          isValid={question.ansC !== "" ? true : false}
                          isInvalid={errors.ansC !== "" ? true : false}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.ansC}
                        </Form.Control.Feedback>
                      </Col>
                      <Col className="sm-2">
                        <input
                          type="radio"
                          value={question.ansD}
                          name="mcqans"
                          onChange={handler}
                        />{" "}
                      </Col>
                      <Col className="sm-10 radioadjust">
                        <Form.Control
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          placeholder="D"
                          onChange={handler}
                          defaultValue={question.ansD}
                          name="ansD"
                          isValid={question.ansD !== "" ? true : false}
                          isInvalid={errors.ansD !== "" ? true : false}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.ansD}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}

              {question.qtype === "Brief" && (
                <div className="text-left mt-1 mb-1">
                  <b>&nbsp;Answer:</b>
                  <div className="border bg-white">
                    <Editor
                      editorState={editorState}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={onEditorStateChange}
                    />
                  </div>
                </div>
              )}
              {question.qtype === "True/False" && (
                <div className="form-group row">
                  <label
                    for="inputPassword3"
                    className="col-sm-3 col-form-label font-weight-bold"
                  >
                    Answer
                  </label>
                  <div className="col-sm-9">
                    <div onChange={handler}>
                      {" "}
                      <Row>
                        <Col>
                          <input type="radio" value="True" name="ansBool" />{" "}
                          True &nbsp;
                        </Col>
                        <Col>
                          <input type="radio" value="False" name="ansBool" />{" "}
                          False
                        </Col>
                      </Row>
                      &nbsp;
                    </div>
                  </div>
                </div>
              )}
              <div className="form-group row mt-2">
                <label
                  for="inputPassword3"
                  className="col-sm-3 col-form-label font-weight-bold"
                >
                  Marks
                </label>
                <div className="col-sm-9">
                  <Form.Control
                    type="Number"
                    className="form-control"
                    placeholder="Marks"
                    onChange={handler}
                    name="marks"
                    defaultValue={question.marks}
                    isValid={question.marks !== "" ? true : false}
                    isInvalid={errors.marks !== "" ? true : false}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.marks}
                  </Form.Control.Feedback>
                </div>
              </div>
              <div className="form-group row mt-2">
                <label
                  for="inputPassword3"
                  className="col-sm-3 col-form-label font-weight-bold"
                >
                  Date
                </label>
                <div className="col-sm-9">
                  <Form.Control
                    type="date"
                    className="form-control"
                    placeholder="Enter date"
                    onChange={handler}
                    name="date"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.date}
                  </Form.Control.Feedback>
                </div>
              </div>
              <div className="form-group row">
                <div className="justify-content-center">
                  {updatebtn ? (
                    <button
                      type="button"
                      className="btn btn-success  w-100 "
                      onClick={() => updateHandler(question)}
                    >
                      Update
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btnqmaker  w-100 "
                      onClick={addHandler}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </Form>
          </div>
          <br />
          <Table striped bordered hover className="tableqmaker">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Question Type</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Marks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allque &&
                allque.map((que, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{que.qtype}</td>
                    <td>{que.que}</td>
                    {que.ansBool && <td>{que.ansBool} </td>}
                    {que.ansBrief && (
                      <td
                        dangerouslySetInnerHTML={{ __html: que.ansBrief }}
                      ></td>
                    )}
                    {que.ansA && (
                      <td>
                        {"(A)"}
                        {que.ansA} {", (B)"}
                        {que.ansB} {", (C)"}
                        {que.ansC} {", (D)"}
                        {que.ansD}
                        <br />
                        <b>Answer: </b>
                        {que.mcqans}
                      </td>
                    )}
                    <td>{que.marks}</td>
                    <td>
                      <Button
                        className="btn-success mt-1"
                        onClick={() => editHandler(que)}
                      >
                        <i className="fa fa-edit"></i>
                      </Button>
                      &nbsp;
                      <Button
                        className="btn-danger mt-1"
                        onClick={() => deleteHandler(que.que)}
                      >
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={finalSubmit}
          >
            Submit
          </button>
        </Container>
      )}{" "}
    </div>
  );
}

export default AddQue;
