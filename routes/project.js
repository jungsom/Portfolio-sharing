const { Router } = require("express");
const { User, Project } = require("../models");
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Identification,
} = require("../middlewares");

const router = Router();

//프로젝트 추가
router.post("/", async (req, res, next) => {
  try {
    // 세션 확인(401 error)
    if (!req.session.passport) {
      throw new Unauthorized("로그인 후 이용 가능합니다.");
    }

    const id = req.session.passport.user.id; // id를 session에 있는 id 값으로

    // id 확인(404 error)
    const user = await User.findOne({ id });
    if (!user) {
      throw new NotFound("존재하지 않는 id입니다.");
    }

    // 본인 확인
    const identification = Identification(req.session, user);
    if (!identification) {
      throw new Forbidden("접근할 수 없습니다.");
    }

    const { title, startDate, endDate, details } = req.body;
    const project = await Project.create({
      id,
      title,
      startDate,
      endDate,
      details,
    });

    res.status(200).json({
      error: null,
      data: project,
    });

    //DB 카운터 추가
  } catch (err) {
    next(err);
  }
});

module.exports = router;
