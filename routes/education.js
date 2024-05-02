const { Router } = require("express");
const { User, Education } = require("../models");

const router = Router();

router.get("/", async (req, res) => {
  const users = await Education.find({});
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ id });
  const users = await Education.find({ id: user["_id"] }).populate("id");
  res.json(users);
});

router.post("/", async (req, res) => {
  // const id = req.params.id;
  const { schoolName, major, schoolState } = req.body;
  // const user = await User.findOne({ id });
  const posts = await Education.create({
    // id: user["_id"],
    schoolName,
    major,
    schoolState,
  });

  res.json(posts);
});

module.exports = router;
