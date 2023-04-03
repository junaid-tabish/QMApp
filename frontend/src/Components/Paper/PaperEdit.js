import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";
import { useNavigate } from "react-router-dom";

const regForName = /^[a-zA-Z ]{2,100}$/;

function PaperEdit({
  question,
  setQuestion,
  setConvertedContent,
  errors,
  setErrors,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user"))) {
      navigate("/login");
    }
  }, []);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handler = (e) => {
    const { name, value } = e.target;
    if (name === "qtype" && value !== question.qtype) {
      setQuestion((prevState) => ({
        ...prevState,
        ansA: "",
        ansB: "",
        ansC: "",
        ansD: "",
        ansBrief: "",
        ansBool: "",
        mcqans: "",
      }));
    }
    setQuestion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    switch (name) {
      case "subject":
        let esubject = regForName.test(value)
          ? ""
          : "Please Enter Subject Name";
        setErrors({ ...errors, subject: esubject });
        break;
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
      default:
    }
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    convertContentToHTML();
  };
  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };
  return (
    <div className="">
      <Form id="myForm">
        <br />
        <div className="form-group row">
          <label
            for="inputEmail3"
            className="col-sm-3 col-form-label font-weight-bold"
          >
            Subject
          </label>
          <div className="col-sm-9">
            <Form.Control
              type="text"
              className="form-control"
              id="inputEmail3"
              placeholder="Subject"
              onChange={handler}
              name="subject"
              readOnly
              // readOnly={allque.length > 0 ? true : false}
              defaultValue={question.subject}
              isValid={question.subject !== "" ? true : false}
              isInvalid={errors.subject !== "" ? true : false}
            />
            <Form.Control.Feedback type="invalid">
              {errors.subject}
            </Form.Control.Feedback>
          </div>
        </div>
        <div className="form-group row">
          <label
            for="inputPassword3"
            className="col-sm-3 col-form-label font-weight-bold"
          >
            Question Type
          </label>

          <div className="col-sm-9">
            <Form.Control
              as="select"
              custom
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
                    s
                    onChange={handler}
                  />{" "}
                </Col>

                <Col className="sm-10 radioadjustmodal">
                  <Form.Control
                    type="text"
                    className="form-control"
                    id="validationCustom01"
                    placeholder="A"
                    onChange={handler}
                    name="ansA"
                    defaultValue={question.ansA}
                    checked={question.mcqans == question.ansC ? true : false}
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
                <Col className="sm-10 radioadjustmodal">
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
                    checked={question.mcqans === question.ansC && "checked"}
                    name="mcqans"
                    onChange={handler}
                  />{" "}
                </Col>
                <Col className="sm-10 radioadjustmodal">
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
                <Col className="sm-10 radioadjustmodal">
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
          <>
            <b>Answer</b>
            <div className="border">
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
                defaultEditorState={question.ansBrief}
              />
            </div>
          </>
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
                    <input type="radio" value="True" name="ansBool" /> True
                    &nbsp;
                  </Col>
                  <Col>
                    <input type="radio" value="False" name="ansBool" /> False
                  </Col>
                </Row>
                &nbsp;
              </div>
            </div>
          </div>
        )}
        <div className="form-group row">
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
      </Form>
    </div>
  );
}

export default PaperEdit;
