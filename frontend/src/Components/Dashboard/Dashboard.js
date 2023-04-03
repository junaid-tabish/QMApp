import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Chart from "react-apexcharts";
import { getAllque } from "../../config/Myservice";
import { Container, Modal, Table, Row, Col } from "react-bootstrap";
import Papers from "../Paper/Papers";
function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
  });

  const [series, setSeries] = useState([
    {
      name: "Question",
      data: null,
    },
  ]);
  const handleMonthlyStats = (e) => {
    setOptions({
      xaxis: {
        categories: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },
    });
    var MonthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const filteredQuestions = allque.filter(
      (question) =>
        new Date(question.date).getFullYear() === parseInt(e.target.value)
    );
    for (let i = 0; i < filteredQuestions.length; i++) {
      var TempData = filteredQuestions[i].date.split("-");
      MonthlyData[TempData[1] - 1] += 1;
    }
    setSeries([
      {
        name: "Questions",
        data: MonthlyData,
      },
    ]);

    let bar = document.getElementById("chartBar");
    bar.style.display = "block";
  };

  const navigate = useNavigate();

  const [lgShow, setLgShow] = useState(false);

  const [subject, setSubject] = useState("");
  const [allque, setAllque] = useState([]);
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user"))) {
      navigate("/login");
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      const email = user.email;
      getAllque(email).then((res) => {
        setAllque(res.data.data);
        var arrallque = res.data.data;

        let date1 = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;

        let obj = {};
        obj.arr = new Array();

        obj.arr = arrallque;
        obj.arr = obj.arr.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.subject === value.subject)
        );
        setSubjects(obj.arr);
      });
    }
  }, []);
  const getsub = (subject) => {
    const updatedsub = allque.filter((curElem) => {
      var queCount = curElem.allque.filter((el) => {
        return el.deleted == false;
      });

      if (queCount.length != 0) {
        return curElem.subject === subject;
      }
    });
    return updatedsub.length;
  };

  const years = [2023, 2022, 2021, 2020, 2019, 2018, 2017];
  return (
    <>
      <Container>
        <Row className="mt-3 align-items-center">
          <Col xl={7}>
            {" "}
            <h1>Statatics</h1>
            <select
              className="form-control"
              onChange={(e) => handleMonthlyStats(e)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Chart
              options={options}
              series={series}
              type="bar"
              height={350}
              id="chartBar"
              className="chart-bar"
            />
          </Col>
          <Col>
            <button
              type="button"
              className="dashbutton"
              onClick={() => navigate("/qmaker")}
            >
              Add New Paper
            </button>
          </Col>
        </Row>

        <Table
          striped
          bordered
          hover
          className="tablesubject mt-4 tabletd w-100 tablefontapply"
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Subjects</th>
              <th>Paper Count</th>
            </tr>
          </thead>
          <tbody>
            {subjects &&
              subjects.map((sub, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link"
                      data-toggle="modal"
                      data-target=".bd-example-modal-lg"
                      onClick={() => {
                        setLgShow(true);
                        setSubject(sub.subject);
                      }}
                    >
                      {" "}
                      {sub.subject}
                    </button>
                  </td>
                  <td>{getsub(sub.subject)}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              <h2 className="fontapply">All Papers</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <Papers subject={subject} />
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}

export default Dashboard;
