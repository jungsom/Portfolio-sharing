const { Router } = require("express");
const { User, Education } = require("../models");

const router = Router();

// 학력 정보 조회
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const education = await Education.find({ user: id });

  res.json(education);
});

// 학력 추가
router.post("/", async (req, res) => {
  const { userId, id, schoolName, major, schoolStatus } = req.body;
  const addEducation = await Education.create({
    user: userId,
    id,
    schoolName,
    major,
    schoolStatus,
  });

  res.json(addEducation);
});

module.exports = router;
