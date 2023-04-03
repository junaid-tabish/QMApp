import React, { useState, useEffect, useRef } from "react";
import "./PaperQue.css";
import { useParams } from "react-router-dom";
import { getAllqueSub, delAndUpdate } from "../../config/Myservice";
import { Button, Row, Col, Form, Modal } from "react-bootstrap";
import PaperEdit from "./PaperEdit";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

function PaperQue() {
  const [convertedContent, setConvertedContent] = useState(null);

  let { subject } = useParams();
  let { id } = useParams();
  const [allquesub, setAllquesub] = useState([]);
  const [paper, setPaper] = useState();
  const [paperfilter, setPaperfilter] = useState();
  const [paperobj, setPaperobj] = useState({});
  const [edit, setedit] = useState(true);
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState({});
  const [alertmsg, setAlertmsg] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleClose = () => setShow(false);
  const navigate = useNavigate();
  const override = `
  display: block;
  margin: 230px auto;
  border-color: red;
`;

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
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
  });
  const qtype = useRef(null);

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user"))) {
      navigate("/login");
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const email = user.email;

      getAllqueSub(email, subject).then((res) => {
        setAllquesub(res.data.data);
        let obj = {};
        obj.arr = new Array();
        obj.arr = res.data.data;
        obj.arr = obj.arr.filter(
          (value, index, self) =>
            index ===
            self.findIndex((t) => t.subject === value.subject && t._id === id)
        );
        setPaper(obj.arr[0].allque);
        setPaperfilter(obj.arr[0].allque);
        setPaperobj(obj.arr[0]);
      });
    }
  }, []);

  const deleteHandler = (que) => {
    const index = paper.findIndex((element) => element.que === que.que);
    let arr = paper;
    let obj = {
      subject: que.subject,
      qtype: que.qtype,
      que: que.que,
      ansA: que.ansA,
      ansB: que.ansB,
      ansC: que.ansC,
      ansD: que.ansD,
      ansBrief: que.ansBrief,
      ansBool: que.ansBool,
      marks: que.marks,
      mcqans: que.mcqans,
      deleted: true,
    };

    arr[index] = obj;
    setPaper(arr);
    const newarr = paper.filter((item) => item.deleted !== true);
    setPaperfilter(newarr);

    const user = JSON.parse(localStorage.getItem("user"));
    const email = user.email;
    delAndUpdate(email, paperobj._id, arr).then((res) => {
      setAlertmsg("Question Deleted");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setOpen2(false);
      }, 1000);
    });
  };
  const editHandler = (que) => {
    setShow(true);
    setQuestion(que);
  };
  const updateHandler = () => {
    if (
      validate(errors) &&
      question.subject &&
      question.qtype &&
      question.que &&
      question.marks
    ) {
      const index = paper.findIndex((element) => element._id === question._id);
      let obj = {};
      if (convertedContent) {
        obj = {
          subject: question.subject,
          qtype: question.qtype,
          que: question.que,
          ansA: question.ansA,
          ansB: question.ansB,
          ansC: question.ansC,
          ansD: question.ansD,
          ansBrief: convertedContent,
          ansBool: question.ansBool,
          marks: question.marks,
          mcqans: question.mcqans,
          _id: question._id,
        };
      } else {
        obj = {
          subject: question.subject,
          qtype: question.qtype,
          que: question.que,
          ansA: question.ansA,
          ansB: question.ansB,
          ansC: question.ansC,
          ansD: question.ansD,
          ansBrief: question.ansBrief,
          ansBool: question.ansBool,
          marks: question.marks,
          mcqans: question.mcqans,
          _id: question._id,
        };
      }

      let arr = paper;
      arr[index] = obj;
      setPaper(arr);
      setShow(false);
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user.email;
      delAndUpdate(email, paperobj._id, arr).then((res) => {
        setAlertmsg("Updated Successfully");
        setOpen2(true);
        setTimeout(() => {
          setOpen(false);
          setOpen2(false);
        }, 1000);
      });
    } else {
      setAlertmsg("Please Enter Valid Data");
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setOpen2(false);
      }, 1000);
    }
  };
  const validate = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };
  return (
    <>
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
      {paper &&
        paper.map((que, i) => (
          <>
            {!que.deleted && (
              <div className="paperque mt-4 text-left mb-2">
                <Row>
                  <Col sm={10}>
                    {" "}
                    <h5>
                      {i + 1}
                      {". "}
                      {que.que}
                      &nbsp;(Marks: {que.marks})
                    </h5>
                    {que.ansBool && (
                      <>
                        <span className="font-weight-bold mt-3">
                          Answer: {que.ansBool}
                        </span>
                      </>
                    )}
                    {que.ansBrief && (
                      <>
                        <div className="text-sm-left mt-3">
                          <b>Answer:</b>{" "}
                          <span
                            dangerouslySetInnerHTML={{ __html: que.ansBrief }}
                          ></span>
                        </div>
                      </>
                    )}
                    {que.qtype === "MCQ" && (
                      <div className="form-group row mt-3">
                        <label
                          for="inputPassword3"
                          className="col-sm-3 col-form-label font-weight-bold text-sm-right"
                        >
                          {/* Answer: */}
                        </label>
                        <div className="col-sm-9 text-sm-left text-left">
                          <Row>
                            <Col className="sm-12 ">
                              <Form.Control
                                type="text"
                                id="validationCustom01"
                                placeholder="A"
                                value={`(A) ${que.ansA}`}
                                name="ansA"
                                plaintext={true}
                                disabled={true}
                              />
                            </Col>

                            <Col className="sm-12 ">
                              <Form.Control
                                type="text"
                                id="validationCustom01"
                                placeholder="B"
                                value={`(B) ${que.ansB}`}
                                plaintext={true}
                                disabled={true}
                                name="ansB"
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col className="sm-12 ">
                              <Form.Control
                                type="text"
                                id="validationCustom01"
                                placeholder="C"
                                plaintext={true}
                                disabled={true}
                                value={`(C) ${que.ansC}`}
                                name="ansC"
                              />
                            </Col>

                            <Col className="sm-12 ">
                              <Form.Control
                                type="text"
                                id="validationCustom01"
                                placeholder="D"
                                value={`(D) ${que.ansD}`}
                                plaintext={true}
                                disabled={true}
                                name="ansD"
                              />
                            </Col>
                          </Row>
                        </div>
                        <span className="font-weight-bold text-sm-right mt-3">
                          Correct Answer: {que.mcqans}
                        </span>
                      </div>
                    )}
                  </Col>
                  <Col sm={2} className="d-flex align-items-center">
                    <Button
                      className="btn-primary mr-1"
                      onClick={() => navigate(`/addque/${id}`)}
                    >
                      <i className="fa fa-plus-circle"></i>
                    </Button>
                    <Button
                      className="btn-success mr-1"
                      onClick={() => editHandler(que)}
                    >
                      <i className="fa fa-edit"></i>
                    </Button>
                    <Button
                      className="btn-danger "
                      onClick={() => {
                        const confirmBox = window.confirm(
                          "Do you really want to delete this Question?"
                        );
                        if (confirmBox === true) {
                          deleteHandler(que);
                        }
                      }}
                    >
                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </Button>
                  </Col>
                </Row>
              </div>
            )}
          </>
        ))}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title className="fontapply">Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PaperEdit
            question={question}
            setQuestion={setQuestion}
            setConvertedContent={setConvertedContent}
            errors={errors}
            setErrors={setErrors}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateHandler}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PaperQue;
