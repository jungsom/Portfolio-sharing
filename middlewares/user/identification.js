function Identification(session, user) {
  if (session.passport.user.email === user.email) {
    return true; // 본인
  } else {
    return false; // 타인
  }
}

module.exports = Identification;
