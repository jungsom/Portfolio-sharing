//Nav 페이지이동
function init() {
  document.querySelector("#go_to_register").addEventListener("click", goToRegister);
  document.querySelector("#out_to_register").addEventListener("click", outToRegister);
  document.querySelector("#login-submit").addEventListener("click", setLogin);
  document.querySelector("#register-submit").addEventListener("click", setRegister);
  authcheck();
  navBtnHide();
}

/* 로그인 시, 사용자 계정 확인 api 요청 */
async function postLogin() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

/* 사용자 로그인 함수 */
async function setLogin(event) {
  event.preventDefault();
  try {
    const response = await postLogin();

    if (response.status === 401) {
      alert("로그인에 실패했습니다. 다시 시도해 주세요.");
    } else if (response.status === 200) {
      alert("로그인에 성공했습니다!");
      window.location.href = "/?page=1";
    }
  } catch (error) {
    console.error(error);
    alert("로그인 중 에러가 발생했습니다. 나중에 다시 시도해 주세요.");
  }
}

/* 사용자 회원가입 함수 */
function setRegister(event) {
  try {  
  event.preventDefault();

  const pw = document.getElementById("set-pwd").value;
  const pwchk = document.getElementById("set-pwd-chk").value;
  const name = document.getElementById("set-name").value;
  const email = document.getElementById("set-email").value;
  const nickname = document.getElementById("set-nickname").value;

  if (passwordCheck(pw, pwchk) && emailCheck(email)) {
    fetch("/auth/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pw,
        name: name,
        nickname: nickname,
      }),
    }).then((response) => {
      if (response.status == 201) {
        alert("가입완료!")
        outToRegister();
      } else if (response.status == 400) {
        alert("입력되지 않은 내용이 있습니다.")
      } else if (response.status == 409) {
        response.json().then((data) => {
          if (data.error == "이미 가입된 이메일입니다.") {
            alert("이미 가입되어있는 ID 입니다.");
          }
          if (data.error == "다른 사용자가 닉네임을 사용중입니다.") {
            alert("다른 사용자가 닉네임을 사용중입니다.");
          }
        });
      }});
    };
  } catch(error) {
    console.error(error);
    alert("회원가입 중 에러가 발생했습니다. 나중에 다시 시도해 주세요.")    
  }
}

/* 회원가입 시, 비밀번호 조건 판단 */
function passwordCheck(pw, pwchk) {
  try {    
    if (pw == pwchk) {
      if (pw.length >= 4) {
        return true;
      } else {
        alert("비밀번호를 4자리 이상 입력해 주세요.")
        return false;
      }
    } else {
      alert("비밀번호가 일치하지 않습니다. 다시 시도해 주세요.")
      return false;
    }
  } catch (error) {
    throw new Error(error);
  }
}

/* 회원가입 시, 이메일 조건 확인 */
function emailCheck(email) {
  try {    
  const emailpattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  if (emailpattern.test(email)) {
    return true;
  } else {
    alert("올바른 형태의 email 을 입력해주세요.")
    return false;
  }} catch(error) {
    throw new Error(error);
  }
}

/* 회원가입창 진입 */
function goToRegister() {
  document.querySelector(".login-container").style.display = "none";
  document.querySelector(".register-container").style.display = "flex";
}

/* 회원가입창 취소 */
function outToRegister() {
  window.location.href = "/login";
}

function navBtnHide() {
  document.querySelector("#userpage").style.display = "none";
  document.querySelector("#logout").style.display = "none";
  document.querySelector("#login").style.display = "none";
}

//Header 공통코드
// document.querySelector("#login").addEventListener("click", gotoLogin);
// document.querySelector("#logout").addEventListener("click", logout);
// document.querySelector("#userpage").addEventListener("click", gotoUserpage);
document.querySelector("#board").addEventListener("click", gotoBoard);

function gotoUserpage() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        const currentUser = data.data.userId;
        window.location.href = `/userpage?user=${currentUser}`;
      } else {
        alert("잘못 된 접근입니다. 로그인 후 이용해주세요.");
        window.location.href = "/login";
      }
    });
}

function logout() {
  if (confirm("정말 로그아웃 하시겠습니까?")) {
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((response) => {
      if (response.status == 401) {
        alert("로그인 후 이용 가능합니다.");
      } else if (response.status == 200) {
        alert("로그아웃 성공");
        window.location.href = "/?page=1";
      }
    });
  }
}

function gotoLogin() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        alert("잘못 된 접근입니다. 이미 로그인 되어 있습니다.");
      } else {
        window.location.href = "/login";
      }
    });
}

function gotoBoard() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        window.location.href = "/board/?page=1";
      } else {
        alert("잘못 된 접근입니다. 로그인 후 이용해주세요.");
        window.location.href = "/login";
      }
    });
}

//각각 페이지 실행 시 올바른 접근인지 체크
function authcheck() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        alert("잘못 된 접근입니다. 이미 로그인 되어 있습니다.");
        window.location.href = "/?page=1";
      } else {
        return;
      }
    });
}
///헤더 공통코드 끝

init();
