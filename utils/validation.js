const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "이메일 주소를 입력하세요.",
      "string.email":
        "올바른 이메일 주소 형식이 아닙니다. 이메일 입력 시 .com과 .net만 가능합니다.",
      "any.required": "이메일 주소를 입력하세요.",
    }),
  name: Joi.string().trim().min(1).max(255).required().messages({
    "string.empty": "공백은 이름으로 사용 불가능합니다.",
    "string.min": "이름은 최소 1글자 이상이어야 합니다.",
    "string.max": "이름은 최대 255글자까지만 허용됩니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  nickname: Joi.string().trim().min(3).max(255).required().messages({
    "string.empty": "공백은 닉네임으로 사용 불가능합니다.",
    "string.min": "닉네임은 최소 3글자 이상이어야 합니다.",
    "string.max": "닉네임은 최대 255글자까지만 허용됩니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "비밀번호를 입력하세요.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const userSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    "string.empty": "공백은 이름으로 사용 불가능합니다.",
    "string.min": "이름은 최소 1글자 이상이어야 합니다.",
    "string.max": "이름은 최대 255글자까지만 허용됩니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  nickname: Joi.string().trim().min(3).max(255).required().messages({
    "string.empty": "공백은 닉네임으로 사용 불가능합니다.",
    "string.min": "닉네임은 최소 3글자 이상이어야 합니다.",
    "string.max": "닉네임은 최대 255글자까지만 허용됩니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  description: Joi.string().required().messages({
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const educationSchema = Joi.object({
  schoolName: Joi.string().trim().required().messages({
    "string.empty": "공백은 학교명으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  major: Joi.string().trim().required().messages({
    "string.empty": "공백은 학과명으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  schoolStatus: Joi.string().trim().required().messages({
    "string.empty": "공백은 학력 상태명으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const awardSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "공백은 수상 이름으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  details: Joi.string().trim().required().messages({
    "string.empty": "공백은 수상 설명으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  acqDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "공백은 수상일로 사용 불가능합니다.",
      "string.pattern.base": "수상일은 YYYY-MM-DD 형식이어야 합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
    }),
});

const projectSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "공백은 프로젝트 제목으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "공백은 프로젝트 시작일로 사용 불가능합니다.",
      "string.pattern.base": "프로젝트 시작일은 YYYY-MM-DD 형식이어야 합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
    }),
  endDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "공백은 프로젝트 종료일로 사용 불가능합니다.",
      "string.pattern.base": "프로젝트 종료일은 YYYY-MM-DD 형식이어야 합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
    }),
  details: Joi.string().trim().required().messages({
    "string.empty": "공백은 프로젝트 상세 설명으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const certificateSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "공백은 자격증 이름으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  acqDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "공백은 자격증 획득일로 사용 불가능합니다.",
      "string.pattern.base": "자격증 획득일은 YYYY-MM-DD 형식이어야 합니다.",
      "any.required": "입력하지 않은 값이 있습니다.",
    }),
});

const boardSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "게시글 제목을 입력하세요.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
  contents: Joi.string().trim().required().messages({
    "string.empty": "게시글 내용을 입력하세요.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const commentSchema = Joi.object({
  contents: Joi.string().trim().required().messages({
    "string.empty": "댓글 내용을 입력하세요.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

const skillSchema = Joi.object({
  stack: Joi.string().trim().required().messages({
    "string.empty": "공백은 스킬명으로 사용 불가능합니다.",
    "any.required": "입력하지 않은 값이 있습니다.",
  }),
});

module.exports = {
  authSchema,
  userSchema,
  educationSchema,
  awardSchema,
  projectSchema,
  certificateSchema,
  boardSchema,
  commentSchema,
  skillSchema,
};
