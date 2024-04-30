const { Router } = require("express");
const { User, Education } = require("../models");

const router = Router();

// 네트워크 페이지(사용자 목록)
router.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

router.post("/", async (req, res) => {
  const { id, email, name, password, description } = req.body;
  const posts = await User.create({
    id,
    email,
    name,
    password,
    description,
  });
  res.json(posts);
});

// 다른 사용자 한 명의 정보 조회
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const users = await User.findOne({ id });
  res.json(users);
});

module.exports = router;
