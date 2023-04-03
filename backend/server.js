const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");

const PORT = 9988;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("uploads")); //for img
app.use(cors());

const userRoutes = require("./routes/userRoutes");
const queRoutes = require("./routes/queRoutes");

app.use("/user/", userRoutes);
app.use("/que/", queRoutes);

connectDB();

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("work on 9988");
});
