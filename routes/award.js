const { Router } = require("express");
const { User, Award } = require("../models");

const router = Router();

router.get("/", async (req, res) => {
  const award = await Award.find({});
  console.log(award);
  res.json(award);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const award = await Award.find({ id });

  res.status(200).json(award);
});

router.post("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { awards, details } = req.body;

  try {
    const user = await User.findOne({ id });

    if (!user) {
      const e = new Error("존재하지 않는 id입니다.");
      e.status = 404;
      throw e;
    }

    if (!awards || !details) {
      const e = new Error("입력되지 않은 내용이 있습니다.");
      e.status = 400;
      throw e;
    }

    const award = await Award.create({
      id,
      awards,
      details,
    });

    res.status(201).json(award);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
