function identification(session, user) {
  return session.passport.user.id === user.id;
}

module.exports = identification;
