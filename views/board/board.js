//메뉴바 이동
function goNetwork() {
  window.location.href = "/";
}

function goUserpage() {
  window.location.href = "/userpage";
}

//로그아웃
function logout() {
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
      window.location.href = "/";
    }
  });
}

//게시물 목록 페이지별 조회
async function getPostList(page) {
  try {
    const res = await fetch(`http://localhost:8080/boards/?page=${page}`);
    const data = await res.json();
    const listcount = data.data.length;
    console.log(data);
    console.log(data.data[0].nickname);
    for (let i = 0; i < listcount - 1; i++) {
      const postlists = document.querySelector(".post-list");
      // const postlists = document.createElement("div");
      let postTitle = data.data[i].title;
      let postWriter = data.data[i].nickname;
      postlists.innerHTML += `
      <div class="post-title-list">
        <li class="title-list"><span class="post-title" id="post-index${i}"><a>${postTitle}</a></span></li>
        <span>${postWriter}</span>
      </div>
      `;

      console.log(i + "번째 포스트리스트 업데이트");
    }
  } catch (error) {
    console.error(error);
  }
}

function gotoFirstPostList() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page")) || 1;

  if (currentPage >= 2) {
    currentPage = 1;
  }
  getPostList(currentPage);
}

function nextPostList() {
  const params = new URLSearchParams(window.location.search);
  console.log(params);
  let currentPage = parseInt(params.get("page")) || 1;
  console.log("curpage: ", currentPage);
}

function init() {
  isVisibleBtns();
  gotoFirstPostList();
}

// 현재페이지

function isVisibleBtns() {
  fetch("http://localhost:8080/auth/status")
    .then((res) => res.json())
    .then((data) => {
      targets = document.querySelectorAll(".visible-btns");
      targets.forEach((target) => {
        if (data.status) {
          target.style.display = "block";
        } else {
          target.style.display = "none";
        }
      });
    });
}

function clear() {
  targets = document.querySelectorAll(".input-box");
  targets.forEach((target) => {
    target.value = "";
  });
}

// function getCurrentUserNickname() {
//   fetch("http://localhost:8080/auth/status")
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.status == true) {
//         localStorage.setItem("nickname", data.data.nickname);
//       }
//     });
// }

//display 속성 제대로 안되고 있어서 수정필요함
//리스트에서 작성창으로
function goWritePost() {
  clear();
  document.getElementById("post-list-container").style.display = "none";
  document.getElementById("write-post-container").style.display = "block";
  document.getElementById("board-post-btn visible-btns").style.display = "none";
}

//작성창에서 리스트로
function outWritePost() {
  if (
    confirm("현재 작성중인 내용은 저장되지 않습니다. 정말 되돌아가겠습니까?")
  ) {
    clear();
    document.getElementById("post-list-container").style.display = "block";
    document.getElementById("write-post-container").style.display = "none";
    document.getElementById("board-post-btn visible-btns").style.display =
      "block";
  }
}

//게시물 등록 // 등록되고나면 clear() 해줘야함
function registPost() {
  if (confirm("작성된 내용을 등록하시겠습니까?")) {
    const title = document.getElementById("write-post-title").value;
    const contents = document.getElementById("write-post-contents").value;
    fetch("http://localhost:8080/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        contents: contents,
      }),
    }).then((response) => {
      console.log(response);
      if (response.status == 201) {
        alert("게시물 작성 OK");
      } else if (response.status == 401) {
        alert("로그인 후 이용 가능합니다.");
      } else if (response.status == 403) {
        alert("권한이 없습니다.");
      } else if (response.status == 400) {
        response.json().then((data) => {
          console.log(data);
          if (data.error == "입력되지 않은 내용이 있습니다.") {
            alert("입력되지 않은 내용이 있습니다.");
          }
          if (data.error == "공백은 제목으로 사용 불가능합니다.") {
            alert("공백은 제목으로 사용 불가능합니다.");
          }
          if (data.error == "공백은 내용으로 사용 불가능합니다.") {
            alert("공백은 내용으로 사용 불가능합니다.");
          }
        });
      }
    });
  }
}

init();
