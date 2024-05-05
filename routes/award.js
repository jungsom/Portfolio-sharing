const { Router } = require("express");
const { User, Award } = require("../models");
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Identification,
} = require("../middlewares");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId, name } = req.session.passport.user;
    const award = await Award.find({ userId }).lean();

    const user = await User.findOne({ userId }).lean();
    const isIdentical = Identification(req.session, user);
    if (!isIdentical) {
      throw new Forbidden("접근할 수 없습니다."); // 403 에러
    }

    if (award.length < 1) {
      throw new NotFound("수상내역을 찾을 수 없습니다.");
    }

    res.status(200).json({
      error: null,
      message: `${name} 님의 전체 수상 수는 ${award.length}개 입니다.`,
      data: award,
    });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }
    const { title, details, acqDate } = req.body;
    const { userId } = req.session.passport.user;

    if (!title || !details || !acqDate) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }

    const award = await Award.create({
      userId,
      title,
      details,
      acqDate,
    });

    res.status(200).json({
      error: null,
      message: "수상내역이 추가되었습니다.",
      data: award,
    });
  } catch (e) {
    next(e);
  }
});

router.put("/:awardId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const awardId = Number(req.params.awardId);
    const userId = req.session.passport.user.userId;
    const { title, details, acqDate } = req.body;

    const exists = await Award.findOne({ userId, awardId });
    if (!exists) {
      throw new NotFound(
        "요청하신 유저의 수상내역 ID에 자료가 존재하지 않습니다."
      );
    }

    if (!title || !details || !acqDate) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }

    const updateAward = await Award.findOneAndUpdate(
      { userId, awardId },
      {
        title,
        details,
        acqDate,
      },
      { runValidators: true, new: true }
    ).lean();

    res.status(200).json({
      error: null,
      message: "수상내역 정보를 수정했습니다.",
      data: updateAward,
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:awardId", async (req, res, next) => {
  try {
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const { userId, name } = req.session.passport.user;
    const awardId = req.params.awardId;

    const award = await Award.findOneAndDelete({ userId, awardId });
    if (award === null) {
      throw new NotFound(
        "요청하신 유저의 수상내역 ID에 자료가 존재하지 않습니다."
      );
    }

    res.status(200).json({
      error: null,
      message: `${name}님의 ${awardId}번 수상내역을 삭제했습니다.`,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
