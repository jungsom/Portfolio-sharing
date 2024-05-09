//메뉴바 이동
function goNetwork() {
  window.location.href = "/";
}

function goUserpage() {
  window.location.href = "/userpage";
}

//로그아웃
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
        window.location.href = "/network";
      }
    });
  }
}

//게시물 목록 페이지별 조회 및 리스트업
async function getPostList(page) {
  try {
    const res = await fetch(`http://localhost:8080/boards/?page=${page}`);
    const data = await res.json();
    const listcount = data.data.length;
    const totalPage = data.totalPage;
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
    }
    if (page == 1) {
      isvisibleNextPrevBtn(1);
    } else if (page == totalPage) {
      isvisibleNextPrevBtn(2);
    } else {
      isvisibleNextPrevBtn(0);
    }
  } catch (error) {
    console.error(error);
  }
}

function isvisibleNextPrevBtn(num) {
  if (num == 1) {
    console.log("버튼없애기");
    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "block";
  } else if (num == 2) {
    document.getElementById("prev-btn").style.display = "block";
    document.getElementById("next-btn").style.display = "none";
  } else {
    document.getElementById("prev-btn").style.display = "block";
    document.getElementById("next-btn").style.display = "block";
  }
}

//현재 data 몇번째 페이지 참조하는지 찾는 함수
function displayFirst() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page"));
  getPostList(currentPage);
}

//다음페이지 post 리스트
function getNextPostList() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page"));
  currentPage++;
  window.location.href = `/board/?page=${currentPage}`;
  console.log(currentPage);
  getPostList(currentPage);
}

function getPrevPostList() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page"));
  currentPage--;
  window.location.href = `/board/?page=${currentPage}`;
  console.log(currentPage);
  getPostList(currentPage);
}

// 현재페이지

function isVisibleBtns() {
  fetch("http://localhost:8080/auth/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        document.getElementById("login").style.display = "none";
        document.getElementById("userpage").style.display = "block";
        document.getElementById("logout").style.display = "block";
      } else {
        document.getElementById("login").style.display = "block";
        document.getElementById("userpage").style.display = "none";
        document.getElementById("logout").style.display = "none";
      }
    });
}

function clear() {
  targets = document.querySelectorAll(".input-box");
  targets.forEach((target) => {
    target.value = "";
  });
}

//display 속성 제대로 안되고 있어서 수정필요함
//리스트에서 작성창으로
function goWritePost() {
  document.getElementById("write-post-container").style.display = "block";
  document.getElementById("post-list-container").style.display = "none";
  clear();
}

//작성창에서 리스트로
function outWritePost() {
  if (
    confirm("현재 작성중인 내용은 저장되지 않습니다. 정말 되돌아가겠습니까?")
  ) {
    document.getElementById("post-list-container").style.display = "block";
    document.getElementById("write-post-container").style.display = "none";
    clear();
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

function init() {
  isVisibleBtns();
  displayFirst();
}

init();
