import React, { useState, useEffect } from "react";
import { getAllqueSub } from "../../config/Myservice";
import { useNavigate } from "react-router-dom";
import "./Papers.css";

function Papers({ subject }) {
  const navigate = useNavigate();

  const [allquesub, setAllquesub] = useState([]);
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("user"))) {
      navigate("/login");
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const email = user.email;

    getAllqueSub(email, subject).then((res) => {
      var data = res.data.data.filter((ele) => {
        var queCount = ele.allque.filter((each) => {
          return each.deleted == false;
        });
        if (queCount.length != 0) {
          return ele;
        }
      });
      setAllquesub(data);
    });
  }, []);

  return (
    <div>
      {allquesub.map((paper, i) => (
        <div
          className="papers mt-3 font-weight-bold"
          onClick={() => navigate(`/${subject}/${paper._id}`)}
        >
          {i + 1}
          {"."} {paper.date}
        </div>
      ))}
    </div>
  );
}

export default Papers;
