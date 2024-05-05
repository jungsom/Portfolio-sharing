const { Router } = require("express");
const { User, Education } = require("../models");
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Identification,
} = require("../middlewares");

const router = Router();

// 학력 정보 조회
router.get("/", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.id;
    const education = await Education.findOne({ user: userId }).lean();

    if (!education) {
      throw new NotFound("학력 정보가 없습니다.");
    }

    const educationId = req.params.educationId;

    if (!educationId) {
      throw new BadRequest("유효하지 않은 학력입니다.");
    }

    const educationData = {
      educationId: education.educationId,
      schoolName: education.schoolName,
      major: education.major,
      schoolStatus: education.schoolStatus,
    };

    res.status(200).json({ error: null, data: educationData });
  } catch (e) {
    next(e);
  }
});

// 학력 추가
router.post("/", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.id;
    // const education = await Education.find({ userId }).lean();
    // const education = await Education.findOne({ userId }).lean();

    // if (!education) {
    //   throw new NotFound("데이터를 찾을 수 없습니다.");
    // }

    const { schoolName, major, schoolStatus } = req.body;

    if (!schoolName || !major || !schoolStatus) {
      throw new BadRequest("학력 정보를 모두 입력해주세요.");
    }

    // const identification = Identification(req.session, userId);
    // if (!identification) {
    //   throw new Forbidden("접근할 수 없습니다.");
    // }

    const addEducation = await Education.create({
      // userId: userId,
      userId,
      schoolName,
      major,
      schoolStatus,
    });

    const educationData = {
      educationId: addEducation.educationId,
      schoolName: addEducation.schoolName,
      major: addEducation.major,
      schoolStatus: addEducation.schoolStatus,
    };

    res.status(201).json({ error: null, data: educationData });
  } catch (error) {
    next(error);
  }
});

// 학력 수정
router.put("/:educationId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.userId;
    const educationId = req.params.educationId;
    // const educationId = Number(req.params.educationId);

    if (!educationId) {
      throw new BadRequest("유효하지 않은 학력입니다.");
    }

    const { schoolName, major, schoolStatus } = req.body;

    if (!schoolName || !major || !schoolStatus) {
      throw new BadRequest("학력 정보를 모두 입력해주세요.");
    }

    const validSchoolStatus = ["재학중", "학사졸업", "석사졸업", "박사졸업"];

    if (!validSchoolStatus.includes(schoolStatus)) {
      throw new BadRequest("유효하지 않은 학력 상태입니다.");
    }

    const updateEducation = await Education.findOneAndUpdate.lean()(
      { userId, educationId },
      { schoolName, major, schoolStatus },
      { runValidators: true, new: true }
    );

    if (!updateEducation) {
      throw new NotFound("데이터를 찾을 수 없습니다.");
    }

    const sanitizedEducation = {
      educationId: updateEducation.educationId,
      schoolName: updateEducation.schoolName,
      major: updateEducation.major,
      schoolStatus: updateEducation.schoolStatus,
    };

    res.status(200).json({ error: null, data: sanitizedEducation });
  } catch (e) {
    next(e);
  }
});

// 학력 삭제
router.delete("/:educationId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const userId = req.session.passport.user.userId;
    const educationId = req.params.educationId;

    if (!educationId) {
      throw new BadRequest("유효하지 않은 학력입니다.");
    }

    const deleteEducation = await Education.findOneAndDelete.lean()({
      userId: userId,
      educationId: educationId,
    });

    if (!deleteEducation) {
      throw new NotFound("데이터를 찾을 수 없습니다.");
    }

    res.status(204).json({ error: null, data: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;