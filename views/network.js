// import API from ".../api";

//open api로 테스트
async function fetchUsers() {
  const res = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=30&api_key=live_OFhz6Cq9zKqH8FTbc7H2SIbYETbvWoV1155zqmiwZEFX5B0fB0k12tnENikJsxC4"
  );
  const imageData = await res.json();
  return imageData;
}

/** 유저 정보 api 요청 */
async function fetchUser() {
  const res = await fetch(`http://localhost:8080/users`);
  const datas = await res.json();
  return datas;
}

/** 사용자 정보 조회 api 요청 */
async function fetchUserInfo(id) {
  const res = await fetch(`http://localhost:8080/users/${id}`);
  const datas = await res.json();
  return datas;
}

// function logInPopup() {
//     const modal = document.querySelector('.modal')
//     const close = document.querySelector('.close');

//     modal.style.display = "block";
//     close.addEventListener('click', () => modal.style.display="none");
// }

/** 메뉴바 이벤트 핸들러 */
async function menuClickHandler() {
  try {
    const checkLogin = await isLoggedIn();

    if (checkLogin === true) {
      window.location.href = `/userpage`; //개인 페이지 이동
    } else if (checkLogin === false) {
      throw new Error("로그인 후 이용 가능합니다.");
    }
  } catch (error) {
    console.error("401 error");
    alert(error.message); //팝업창으로 수정 예정
    window.location.href = `/login`;
  }
}

/** 다른 사용자 목록 이벤트 핸들러 */
async function ImgClickHandler() {
  try {
    const checkLogin = await isLoggedIn();
    const checkUser = await isCurrentUser();

    // fetch로 이미지, 유저 데이터 가져온다고 가정
    // const userId = users.find(data => data.id === images.url)
    const userId = 1;

    if (checkLogin === true && checkUser === false) {
      window.location.href = `/users/${userId}`; //다른 사용자 페이지 이동
    } else if (checkLogin === true && checkUser === true) {
      window.location.href = "userpage"; //개인 페이지로 이동
    } else {
      throw new Error("로그인 후 이용 가능합니다.");
    }
  } catch (error) {
    console.log("401 error");
    alert(error.message);
    window.location.href = `/login`;
  }
}

/** 로그인 상태 여부 판단 */
function isLoggedIn() {
  return false; //로그인이 되어있지 않다고 가정
}

/** 현재 사용자인지 여부 판단 */
function isCurrentUser() {
  return false; // 현재 사용자가 일치하지 않다고 가정
}

/** 로그인 상태에 따라 메뉴 변경 */
async function updateMenu() {
  const checkLogin = await isLoggedIn();
  if (checkLogin === true) {
    document.querySelector(".mypage").style.display = "block";
    document.querySelector(".login").style.display = "none";
  }
}

// async function getUserImage() {
//     try {
//         const userElem = document.getElementById('userContent');
//         const datas = await fetchUsers();

//         userElem.innerHTML = '';
//         datas.forEach(image => {
//             const container = document.createElement('div');
//             const imageElem = document.createElement('img');

//             // 각 이미지에 해당하는 사용자를 찾음
//             // const user = users.find(user => user.id === image.id);

//             imageElem.src = image.url;
//             imageElem.alt = '등록된 사진이 없습니다.';
//             container.appendChild(imageElem);
//             userElem.appendChild(container);

//             userElem.addEventListener('click', ImgClickHandler);
//         });
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

/** 다른 사용자 목록 미리 보기 기능 */
async function getUserImage() {
  try {
    const userElem = document.getElementById("userContent");
    const images = await fetchUsers();
    const users = await fetchUser();

    userElem.innerHTML = "";
    images.forEach((image, index) => {
      const container = document.createElement("div");
      const imageElem = document.createElement("img");
      const textElem = document.createElement("p");

      imageElem.src = image.url;
      imageElem.alt = "등록된 사진이 없습니다.";
      container.appendChild(imageElem);
      container.appendChild(textElem);
      userElem.appendChild(container);
      textElem.className = "userText";

      textElem.style.display = "none";

      if (users[index] && users[index].description) {
        textElem.innerHTML = `안녕하세요! <br>
                ${users[index].description}`;
      } else {
        textElem.innerHTML = `사용자 정보가 없습니다.`;
        // 401 에러로 아직 데이터가 보이지 않음
      }

      imageElem.addEventListener("mouseenter", () => {
        textElem.style.display = "block";
      });

      imageElem.addEventListener("mouseleave", () => {
        textElem.style.display = "none";
      });
    });
    userElem.addEventListener("click", ImgClickHandler);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// async function getuserInfo() {
//     try {
//         const userElem = document.getElementById('userContent');
//         const users = await fetchUser()

//         users.forEach(user => {
//             const container = document.createElement('div');
//             const textElem = document.createElement('h2');

//             container.appendChild(textElem);
//             userElem.appendChild(container);

//             container.addEventListener('mouseenter', () => {
//                 textElem.innerText = `자기소개: ${user.description}`
//                 textElem.style.display = 'block';
//             })
//             container.addEventListener('mouseleave', () => {
//                 textElem.style.display = 'none';
//             });
//         });

//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

mypageElem = document.querySelector(".mypage");
loginElem = document.querySelector(".login");

mypageElem.addEventListener("click", menuClickHandler);
loginElem.addEventListener("click", menuClickHandler);

getUserImage();
updateMenu();
