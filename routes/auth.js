const { Router } = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const passport = require("passport");

const router = Router();

// 회원 가입
router.post("/join", async (req, res, next) => {
  try {
    const { email, name, password, description } = req.body;

    if (!email || !name || !password) {
      res.status(400).json({
        error: "입력되지 않은 내용이 있습니다.",
        data: null,
      });
      return;
    }

    // 같은 이메일로 이미 가입이 되어 있는지 확인
    const exists = await User.findOne({ email });

    // 이미 가입된 이메일이 있으면 상태코드 400, 에러 메시지를 보냄
    if (exists) {
      res.status(409).json({
        error: "이미 가입된 이메일입니다.",
        data: null,
      });
      return;
    }

    // bcrypt를 사용해서 salting
    const nano_id = nanoid(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // User를 create하고 결과값을 user에 저장
    const user = await User.create({
      id: nano_id,
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
  res.status(200).json({
    error: null,
    data: "로그인 성공",
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
    res.status(401).json({
      error: "로그인이 되어있지 않습니다.",
      data: "null",
    });
  }
});

module.exports = router;
