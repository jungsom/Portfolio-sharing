const { Router } = require("express");
const { Education } = require("../models");
const { NotFound } = require("../middlewares");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const educations = await Education.find({});
    res.json(educations);
  } catch (error) {
    next(error);
  }
});

// 학력 정보 조회
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const education = await Education.find({ id });

    if (!education) {
      throw new NotFound("데이터를 찾을 수 없습니다.");
    }

    res.status(200).json({ error: null, data: education });
  } catch (error) {
    next(error);
  }
});

// 학력 추가
router.post("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    // id 값 관련
    const education = await Education.find({ id });
    let ids = [];
    let educationId = 1;
    for (const data of education) {
      ids.push(parseInt(data.id));
    }
    if (ids.length !== 0) {
      educationId += Math.max.apply(null, ids);
    }

    const { schoolName, major, schoolStatus } = req.body;
    const addEducation = await Education.create({
      id,
      educationId,
      schoolName,
      major,
      schoolStatus,
    });

    res.status(201).json({ error: null, data: addEducation });
  } catch (error) {
    next(error);
  }
});

// 학력 수정
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { id, schoolName, major, schoolStatus } = req.body;

    const updateEducation = await Education.findOneAndUpdate(
      { user: userId },
      { id, schoolName, major, schoolStatus }
    );

    res.status(200).json({ error: null, data: updateEducation });
  } catch (error) {
    next(error);
  }
});

// 학력 삭제
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const deleteEducation = await Education.findOneAndDelete({
      user: userId,
    });

    if (!deleteEducation) {
      throw new NotFound("데이터를 찾을 수 없습니다.");
    }
    res.status(204).json({ error: null, data: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
