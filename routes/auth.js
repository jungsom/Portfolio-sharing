const { Router } = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const router = Router();

//회원 가입
router.post("/sign-up", async (req, res, next) => {
  try {
    const { id, email, name, password, description } = req.body;

    //같은 이메일로 이미 가입이 되어 있는지 확인
    const exists = await User.findOne({ email });

    //이미 가입된 이메일이 있으면 상태코드 400, 에러 메시지를 보냄
    if (exists) {
      res.status(400).json({
        error: "이미 가입된 이메일입니다.",
        data: null,
      });
      return;
    }
    //오류 처리 더 있으면 추가할 것. 비밀번호 몇 자 이상이라든가, 설명 몇 자 이내

    //bcrypt를 사용해서 salting
    const uuid = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    //User를 create하고 결과값을 user에 저장
    const user = await User.create({
      id: uuid,
      email,
      name,
      password: hashedPassword,
      description,
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
