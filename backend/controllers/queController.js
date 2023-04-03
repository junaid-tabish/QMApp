const queModel = require("../models/questionSchema");
const addQue = (req, res) => {
  let ins = new queModel({
    subject: req.body.subject,
    allque: req.body.allque,
    email: req.body.email,
  });
  ins.save((err) => {
    if (err) {
      res.json({
        err: "something went wrong",
        message: "Something Went Wrong",
      });
    } else {
      res.json({
        err: 0,
        success: true,
        status_code: 200,
        msg: "Successfully Added",
      });
    }
  });
};
const getAllque = (req, res) => {
  const email = req.params.email;
  queModel.find({ email: email }, (err, data) => {
    if (err) throw err;
    else {
      res.json({ err: 0, success: true, status_code: 200, data: data });
    }
  });
};

const getAllquewithSub = (req, res) => {
  const email = req.params.email;
  const subject = req.params.subject;
  queModel.find({ email: email, subject: subject }, (err, data) => {
    if (err) throw err;
    else {
      res.json({ err: 0, success: true, status_code: 200, data: data });
    }
  });
};

const delAndUpdate = (req, res) => {
  const paperid = req.params.paperid;
  const email = req.params.email;

  queModel.updateOne(
    { email: email, _id: paperid },
    { $set: { allque: req.body } },
    (err) => {
      if (err) throw err;
      else {
        res.json({ msg: "Updated", err: 0, status_code: 200 });
      }
    }
  );
};

const addtoexisting = async (req, res) => {
  const { allque } = req.body;

  const { id } = req.params;
  try {
    var data = await queModel.findOne({ _id: id });
    var allquedata = [...data.allque, ...allque];

    var updatedData = await queModel.updateOne(
      { _id: id },
      {
        $set: {
          allque: allquedata,
        },
      }
    );
    if (updatedData.matchedCount == 0) {
      throw err;
    } else {
      res.json({ msg: "Updated", err: 0, status_code: 200 });
    }
  } catch (err) {
    res.json({ msg: "Error", err: 1, status_code: 403 });
  }
};

module.exports = {
  addQue,
  getAllque,
  getAllquewithSub,
  delAndUpdate,
  addtoexisting,
};
