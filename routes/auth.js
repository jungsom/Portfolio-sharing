const { Router } = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");

const router = Router();

// 회원 가입
router.post("/join", async (req, res, next) => {
  try {
    const { email, name, password, description } = req.body;

    if (!email || !name || !password || !description) {
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
      res.status(400).json({
        error: "이미 가입된 이메일입니다.",
        data: null,
      });
      return;
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

    // 가입 완료되면 기본 경로로 이동
    res.status(201).redirect("/");
  } catch (err) {
    next(err);
  }
});

// 로그인
// 실패할 경우 다시 login 경로로 이동하고, 성공하면 기본 경로로 이동
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.save(() => {
      res.status(200).redirect("/");
    });
  }
);

// 로그아웃
router.get("/logout", (req, res) => {
  req.logout();
  // 로그아웃하고 기본 경로로 이동
  req.session.save(() => {
    res.status(200).redirect("/");
  });
});

module.exports = router;
