const express = require("express");
const {
  addQue,
  getAllque,
  getAllquewithSub,
  delAndUpdate,
  addtoexisting,
} = require("../controllers/queController");
const router = express.Router();

const { authenticateToken } = require("../helpers/authenticateToken");

router.post("/addque", authenticateToken, addQue);
router.post("/addtoexisting/:id", authenticateToken, addtoexisting);
router.get("/getallque/:email", authenticateToken, getAllque);
router.get(
  "/getallquesub/:email/:subject",
  authenticateToken,
  getAllquewithSub
);
router.put("/delandupdate/:email/:paperid", authenticateToken, delAndUpdate);

module.exports = router;
