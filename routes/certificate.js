const { Router } = require("express");
const { User, Certificate } = require("../models");
const {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Identification,
} = require("../middlewares");

const router = Router();

// 자격증 정보 조회
router.get("/", async (req, res, next) => {
    try {

        if (!req.session.passport) {
        throw new Unauthorized("로그인 후 이용 가능합니다.");
        }

        const userId = req.session.passport.user.id;
        const certificate = await Certificate.find({ userId }).lean();

        if (!certificate || certificate.length === 0) {
        throw new NotFound("자격증 정보가 존재하지 않습니다.");
        }

        const certificates = [];

        certificate.forEach(certi => {
        const certificateData = {
            certificateId: certi.certificateId,
            title: certi.title,
            acqDate: certi.acqDate,
        };
        certificates.push(certificateData);
        })
        res.status(200).json({ error: null, data: certificates });

    } catch (e) {
        next(e);
    }
});

// 자격증 추가
router.post("/", async (req, res, next) => {
    try {

        if (!req.session.passport) {
        throw new Unauthorized("로그인 후 이용 가능합니다.");
        }

        const userId = req.session.passport.user.id;
        const { title, acqDate } = req.body;

        if (!title || !acqDate) {
        throw new BadRequest("자격증 정보를 모두 입력해주세요.");
        }

        // const identification = Identification(req.session, userId);
        // if (!identification) {
        //   throw new Forbidden("접근할 수 없습니다.");
        // }

        const addCertificate = await Certificate.create({
            userId,
            title,
            acqDate,
        });

        const certificateData = {
            certificateId: addCertificate.certificateId,
            schoolName: addCertificate.schoolName,
            major: addCertificate.major,
            schoolStatus: addCertificate.schoolStatus,
        };

        res.status(201).json({ error: null, data: certificateData });
    } catch (error) {
        next(error);
    }
});

// 자격증 삭제
router.delete("/:certificateId", async (req, res, next) => {
    try {
  
      if (!req.session.passport) {
        throw new Unauthorized("로그인 후 이용 가능합니다.");
      }
  
      const userId = req.session.passport.user.id;
      const certificateId = req.params.certificateId;
      const exists = await Certificate.findOne({ userId, certificateId });
  
      if (!exists) {
        throw new NotFound("자격증 정보를 찾을 수 없습니다.");
      }
  
      const deleteCertificate = await Certificate.findOneAndDelete({
        userId,
        certificateId,
      });
  
      res.status(204).json({ error: null, data: true });
    } catch (e) {
      next(e);
    }
  });

module.exports = router;