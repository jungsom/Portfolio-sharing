const { Router } = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const { Unauthorized, BadRequest, Conflict } = require("../middlewares");

const router = Router();

// 회원 가입
router.post("/join", async (req, res, next) => {
  try {
    const { email, name, password, description } = req.body;

    if (!email || !name || !password) {
      throw new BadRequest("입력되지 않은 내용이 있습니다."); // 400 에러
    }

    // 같은 이메일로 이미 가입이 되어 있는지 확인
    const exists = await User.findOne({ email });

    // 이미 가입된 이메일이 있으면 상태코드 409, 에러 메시지를 보냄
    if (exists) {
      throw new Conflict("이미 가입된 이메일입니다.");
    }

    // bcrypt를 사용해서 salting
    const uuid = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    // User를 create하고 결과값을 user에 저장
    const user = await User.create({
      id: uuid,
      email,
      name,
      password: hashedPassword,
      description,
    });

    res.status(201).json({
      error: null,
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

// 로그인
router.post("/login", passport.authenticate("local"), (req, res) => {
  req.session.save(() => {
    res.status(200).json({
      error: null,
      data: "로그인 성공",
    });
  });
});

// 로그아웃
router.post("/logout", (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        next(err);
      }
      res.status(200).json({
        error: null,
        data: "로그아웃 성공",
      });
    });
  } else {
    throw new Unauthorized("로그인이 되어있지 않습니다.");
  }
});

module.exports = router;
