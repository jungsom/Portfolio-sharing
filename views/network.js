let currentPage = 1;
const modal = document.querySelector(".modal");
const modalOpenbtn = document.querySelector(".modal_btn");
const modalClosebtn = document.querySelector(".close_btn");

function modalOpen(txtNum) {
  changeModalText(txtNum);
  document.getElementById("modal").style.display = "block";
}

function modalClose() {
  document.getElementById("modal").style.display = "none";
  const goTo = localStorage.getItem("goTo");
  if (goTo == "network") {
    window.location.href = "/Network";
  } else if (goTo == "login") {
    window.location.href = "/login";
  }
  localStorage.removeItem("goTo");
}

/** 유저 정보 api 요청 */
async function getUsers(page) {
  try {
    const res = await fetch(`http://localhost:8080/users?page=${page}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("데이터를 불러오는 중에 문제가 발생했습니다.");
  }
}

// async function getUserImages(url) {
//   try {
//     const res = await fetch(url);
//     const blob = await res.blob(); // 이미지 데이터를 Blob으로 변환
//     const reader = new FileReader();
//     reader.readAsDataURL(blob); // Blob을 Base64로 읽기
//     return new Promise((resolve, reject) => {
//       reader.onload = () => {
//         const base64data = reader.result;
//         resolve(base64data); // Base64 데이터 반환
//       };
//       reader.onerror = reject;
//     });
//   } catch (error) {
//     console.error(error);
//     throw new Error("이미지를 불러오는 중에 문제가 발생했습니다.");
//   }
// }

/** 현재 사용자가 로그인이 되어있을 경우 유저 정보 api 요청*/
async function getLoginStatus() {
  try {
    const response = await fetch(`http://localhost:8080/auth/status`);
    if (!response.ok) {
      throw new Errow("데이터를 불러오는 중에 문제가 발생했습니다.");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("error:", error);
  }
}

/** 메뉴바 이벤트 핸들러 */
async function menuClickHandler() {
  try {
    const logintrue = await getLoginStatus();

    if (logintrue.status === true) {
      //유저가 로그인 상태이면 개인페이지 이동
      localStorage.setItem("tempId", logintrue.data.userId); //유저 id 로컬스토리지에 저장(개인 페이지용)
      window.location.href = `/userpage`;
    } else {
      alert("로그인 창으로 이동합니다.");
      window.location.href = `/login`;
    }
  } catch (error) {
    console.error(error);
    alert("로그인 창으로 이동합니다."); //팝업창으로 수정 예정
    window.location.href = `/login`;
  }
}

/** 모든 페이지의 데이터를 가져오는 함수 */
async function getAllUserData() {
  try {
    // 첫 번째 페이지의 데이터를 가져옴
    let allData = [];
    let data = await getUsers(currentPage);
    const totalPages = data.totalPage;
    allData = allData.concat(data.data);

    // 다음 페이지가 있을 경우 반복적으로 데이터를 가져옴
    while (currentPage < totalPages) {
      currentPage++;
      data = await getUsers(currentPage);
      allData = allData.concat(data.data);
    }

    return allData;
  } catch (error) {
    console.error(error);
    alert("데이터를 가져오는 중에 오류가 생겼습니다.");
  }
}

/** 다른 사용자 목록 이벤트 핸들러 */
// function ImgClickHandler() {
//   try {
//     const logintrue = getLoginStatus();
//     const container = document.querySelector("div div");
//     let allUserData = getAllUserData();

//     container.addEventListener("click", (event) => {
//       const clickedindex = event.target.dataset.index;
//       const clickedUser = allUserData[clickedindex];
//       if (clickedUser && logintrue.status === true) {
//         const userId = clickedUser.userId;
//         localStorage.setItem("tempId", userId);
//         window.location.href = "/userpage";
//       } else {
//         alert("데이터를 불러오는데 오류가 생겼습니다.");
//         window.location.href = "/login";
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     alert("로그인 창으로 이동합니다.");
//     window.location.href = `/login`;
//   }
// }

/** 이전 페이지로 이동하는 함수 */
async function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
    updateButton();
  }
}

/** 다음 페이지로 이동하는 함수 */
async function nextPage() {
  const data = await getUsers(currentPage);
  totalPages = data.totalPage;
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
    updateButton();
  }
}

async function renderPage(page) {
  try {
    const userData = await getUsers(page);
    const container = document.querySelector(".usercard-container");
    container.innerHTML = "";

    const logintrue = await getLoginStatus();

    userData.data.forEach(async (user) => {
      const usercard = document.createElement("div"); // 각 사용자 카드를 만들 때마다 새로운 요소 생성
      usercard.className = "usercard";

      const cardinner = document.createElement("div");
      const cardfront = document.createElement("div");
      const cardback = document.createElement("div");
      const userimage = document.createElement("img");
      const title = document.createElement("p");
      const content = document.createElement("p");

      cardinner.className = "usercard-Inner";
      cardfront.className = "usercard-Front";
      cardback.className = "usercard-Back";
      userimage.className = "userImage";
      title.className = "title";
      content.className = "content";

      userimage.src = user.profileImg;
      userimage.alt = user.profileImg;

      cardfront.appendChild(userimage);

      title.innerHTML = `${user.name}의 포트폴리오`;

      cardfront.appendChild(title);
      cardinner.appendChild(cardfront);

      content.innerHTML = `안녕하세요! <br>
                    이름: ${user.name} <br>
                    자기소개: ${user.description}`;

      cardback.appendChild(content);
      cardinner.appendChild(cardback);
      usercard.appendChild(cardinner);
      container.appendChild(usercard);

      // cardinner.addEventListener("mouseenter", () => {
      //   cardinner.style.transform = "rotateY(180deg)";
      // });

      // cardinner.addEventListener("mouseleave", () => {
      //   cardinner.style.transform = "rotateY(0deg)";
      // });

      cardinner.addEventListener("click", () => {
        if (user.profileimg && logintrue.status === true) {
          localStorage.setItem("tempId", user.userId);
          window.location.href = "/userpage";
        } else {
          alert("데이터를 불러오는데 오류가 생겼습니다.");
          window.location.href = "/login";
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

/** 페이지에 따라 버튼을 업데이트하는 함수 */
async function updateButton() {
  let data = await getUsers(currentPage);
  let totalPages = data.totalPage;
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  if (currentPage === 1) {
    prevButton.disabled = true;
    nextButton.disabled = false;
    prevButton.style.backgroundColor = "#eeeae0";
    nextButton.style.backgroundColor = "rgb(255, 255, 255)";
  } else if (currentPage === totalPages) {
    prevButton.disabled = false;
    nextButton.disabled = true;
    prevButton.style.backgroundColor = "rgb(255, 255, 255)";
    nextButton.style.backgroundColor = "#eeeae0";
  } else {
    prevButton.disabled = false;
    nextButton.disabled = false;
    prevButton.style.backgroundColor = "rgb(255, 255, 255)";
    nextButton.style.backgroundColor = "rgb(255, 255, 255)";
  }
}

//로그아웃
async function updateMenu() {
  const userpageElem = document.querySelector(".userpage");
  const loginElem = document.querySelector(".login");
  const logoutElem = document.querySelector(".logout");
  const logintrue = await getLoginStatus();

  if (logintrue.status === true) {
    logoutElem.style.display = "block";
    userpageElem.style.display = "block";
    loginElem.style.display = "none"; //none;
  } else {
    userpageElem.style.display = "none"; //none;
    loginElem.style.display = "block";
    logoutElem.style.display = "none";
  }
}

function getLogOut() {
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
      window.location.href = "/board";
    }
  });
}

async function init() {
  updateMenu();
  renderPage(currentPage);

  const userpageElem = document.querySelector(".userpage");
  const loginElem = document.querySelector(".login");
  const logoutElem = document.querySelector(".logout");
  // const userElem = document.getElementById("userContent");

  // userElem.addEventListener("click", ImgClickHandler);

  userpageElem.addEventListener("click", menuClickHandler);
  loginElem.addEventListener("click", menuClickHandler);

  //로그아웃 이벤트리스너 추기
  logoutElem.addEventListener("click", () => {
    getLogOut();
    window.location.href = "/";
  });

  //페이지네이션 관련 이벤트리스너 추가
  document.getElementById("prevButton").addEventListener("click", prevPage);
  document.getElementById("nextButton").addEventListener("click", nextPage);
}

init();
