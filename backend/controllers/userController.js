const userModel = require("../models/userSchema");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = "asdsahdhasdvh242143hjbhasdf3wq";
const { multi_upload } = require("../helpers/FileUpload");

const signup = (req, res) => {
  multi_upload(req, res, async function (err) {
    let email = req.body.email;
    let oldUser = await userModel.findOne({ email: req.body.email });

    if (oldUser) {
      return res.json({ err: 2, message: "User Already Exist. Please Login" });
    } else {
      let encpassword = req.body.password;
      const hashpassword = bcrypt.hashSync(encpassword, 10);

      //insert data

      let ins = new userModel({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        password: hashpassword,
        pimg: req.files[0].filename,
      });
      ins.save((err) => {
        if (err) {
          res.json({ err: "already added", message: "already added" });
        } else {
          res.json({
            err: 0,
            success: true,
            status_code: 200,
            msg: "Successfully Added",
          });
        }
      });
    }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });

  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      let payload = {
        uid: email,
      };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "12h" });
      res.json({
        err: 0,
        success: true,
        status_code: 200,
        msg: "You Have Logged In",
        token: token,
        user: user,
      });
    } else {
      res.status(200).json({ err: 1, msg: "Invalid Password" });
    }
  } else {
    res.json({ err: 2, msg: "User does not exist" });
  }
};
module.exports = { signup, login };
