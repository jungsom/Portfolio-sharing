const { Router } = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
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
    const exists = await User.findOne({ email }).lean();

    // 이미 가입된 이메일이 있으면 상태코드 409, 에러 메시지를 보냄
    if (exists) {
      throw new Conflict("이미 가입된 이메일입니다.");
    }

    // bcrypt를 사용해서 salting
    const hashedPassword = await bcrypt.hash(password, 10);

    // User를 create하고 결과값을 user에 저장
    const user = await User.create({
      userId: nanoid(10),
      email,
      name,
      password: hashedPassword,
      description,
    });

    res.status(201).json({
      error: null,
      data: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        description: user.description,
      },
    });
  } catch (err) {
    next(err);
  }
});

// 로그인
router.post("/login", passport.authenticate("local"), async (req, res) => {
  res.status(200).json({
    error: null,
    message: "로그인 성공",
    data: req.user,
  });
});

// 로그아웃
router.post("/logout", (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new Unauthorized("로그인이 되어있지 않습니다.");
  }

  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.status(200).json({
      error: null,
      message: "로그아웃 성공",
    });
  });
});

// 로그인이 되어있는지 확인
router.get("/status", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({
      status: false,
      message: "로그인이 되지 않았습니다.",
    });
    return;
  }
  const { email } = req.session.passport.user;
  const user = await User.findOne({ email }).lean();
  res.json({
    status: true,
    message: "로그인이 된 상태입니다.",
    data: {
      userId: user.userId,
      email: user.email,
      name: user.name,
    },
  });
});

router.get("/true", async (req, res) => {
  res.json({
    status: true,
    message: "로그인이 된 상태입니다.",
    data: {
      id: "r4GOOIxSW9",
      email: "test@test.com",
      name: "test by jaegeun",
      description: "--설명--",
    },
  });
});

router.get("/false", async (req, res) => {
  res.json({
    status: false,
    message: "로그인이 되지 않았습니다.",
  });
});

module.exports = router;
