# ✨Dev.cartes! backend Page (임시 페이지)

## 🪄 API 수정 사항

자세한 내용은 [API 문서](https://docs.google.com/spreadsheets/d/1xZFiT2gpMSSY5c2hOz8VhJL_gC7Prh9ZJ5Q6wfp4Itk/edit?usp=sharing)를 참고해 주세요.

- 2024년 5월 4일

  - 로그인 상태 확인: response에서 description 안보내주도록 변경
  - 학력, 수상이력, 프로젝트, 자격증 추가 항목 PATH 수정

- 2024년 5월 3일
  **- !BREAKING CHANGE : PATH, BODY, RESPONSE 대규모 수정**
  - 2024년 5월 3일 오피스 아워 이후 PATH 경로의 대대적인 수정이 필요해서 불가피하게 바뀐 부분이 많습니다.
  - PATH 경로 id 삭제 -> 기존에는 fetch 주소에 user id값을 넣어야 했지만, 이제는 서버에서 session의 id를 받아와서 자동으로 넣어줍니다. (로그인 필수!!)
  - PATH 뒤에 있는 동사명을 삭제

**- 변경된 부분이 많아서 오류가 나는 경우에는, 언제든지 디스코드 백엔드 채널에 문의 남겨 주세요.**
**- POST, PUT 사용 시 서버에 보내야 할 항목들은 API 문서의 Body params 부분을 참고해주세요.**

## 🌱 Branch

- Backend
  - back_auth
    - 회원가입
    - 로그인
    - 로그아웃
    - 로그인 상태 확인
  - back_users
    - 사용자 목록 (네트워크 페이지)
    - 사용자 정보 조회 (개인 페이지)
    - 본인 확인 (개인 페이지)
    - 사용자 정보 수정 (개인 페이지)
  - back_education
    - 학력 추가
    - 학력 정보 조회
    - 학력 정보 수정
    - 학력 정보 삭제

## 백엔드 Changelog

- 2024년 5월 4일
  - Users: 페이지네이션 구현
  - project: ProjectId AutoIncrement 구현 **(proejct Schema 문서를 확인해주세요.!!!!!!)**

## 🔧 개발 중

- 🔑 회원가입, 로그인 (채명희)
- 🧸 User MVP (이유민)
- 🎓 Education MVP (박수정)

## 🎯️ 미구현 기능

- 🏆 Award MVP
- 🗂️ Project MVP
- ️🪪 Certificate MVP

## ✏️ 개발 완료
