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

/** 현재 사용자인지 여부 판단 */
async function fetchTrue() {
  try {
    const response = await fetch(`http://localhost:8080/auth/true`);
    if (!response.ok) {
      throw new Errow("사용자가 현재 로그인 상태가 아님");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("오류:", error);
  }
}

async function fetchFalse() {
  try {
    const response = await fetch(`http://localhost:8080/auth/false`);
    if (!response.ok) {
      throw new Errow("사용자가 현재 로그인 상태가 아님");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("오류:", error);
  }
}

/** 메뉴바 이벤트 핸들러 */
async function menuClickHandler() {
  try {
    const loginTrue = await fetchTrue();
    const loginFalse = await fetchFalse();

    if (loginTrue.status === true) {
      window.location.href = `/userpage`; //개인 페이지 이동
    } else {
      alert("오류가 발생했습니다.");
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
    const loginTrue = await fetchTrue();
    const loginFalse = await fetchFalse();

    if (loginTrue.status === true) {
      window.location.href = "/userpage"; //개인 페이지로 이동
    } else {
      alert("오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("401 error");
    alert(error.message);
    window.location.href = `/login`;
  }
}

/** 로그인(유저 가입) 상태에 따라 메뉴 변경 */
async function updateMenu() {
  try {
    const loginTrue = await fetchTrue();

    const userpageElem = document.querySelector(".userpage");
    const loginElem = document.querySelector(".login");

    //로그아웃 구현 시 login 작동 버튼 예정 // 테스트 o
    if (loginTrue.status === true) {
      userpageElem.style.display = "block";
      loginElem.style.display = "block"; //none;
    } else {
      userpageElem.style.display = "block"; //none;
      loginElem.style.display = "block";
    }
  } catch (error) {
    console.error("메뉴가 업데이트 되지 않았습니다.");
  }
}

/** 다른 사용자 목록 미리 보기 기능 */
async function getUserImage() {
  try {
    const userElem = document.getElementById("userContent");
    const images = await fetchUsers();
    const userData = await fetchUser();

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

      if (userData.data[index] && userData.data[index].description) {
        textElem.innerHTML = `안녕하세요! <br>
                ${userData.data[index].description}`;
      } else {
        textElem.innerHTML = `사용자 정보가 없습니다.`;
      }

      imageElem.addEventListener("mouseenter", () => {
        textElem.style.display = "block";
      });

      imageElem.addEventListener("mouseleave", () => {
        textElem.style.display = "none";
      });
    });
  } catch (error) {
    console.error(error);
  }
}

function init() {
  updateMenu();
  getUserImage();

  const userpageElem = document.querySelector(".userpage");
  const loginElem = document.querySelector(".login");
  const userElem = document.getElementById("userContent");

  userElem.addEventListener("click", ImgClickHandler);
  userpageElem.addEventListener("click", menuClickHandler);
  loginElem.addEventListener("click", menuClickHandler);
}

init();
