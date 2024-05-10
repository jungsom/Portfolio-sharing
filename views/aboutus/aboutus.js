/** 현재 사용자가 로그인이 되어있을 경우 유저 정보 api 요청*/
async function getLoginStatus() {
  try {
    const response = await fetch(`/auth/status`);
    if (!response.ok) {
      throw new Errow("데이터를 불러오는 중에 문제가 발생했습니다.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

/** 로그인 상태에 따라 Nav바를 업데이트하는 함수 */
async function updateMenu() {
  const loginElem = document.querySelector(".user-status-item-left.login");
  const userpageElem = document.querySelector(
    ".user-status-item-left.userpage"
  );
  const logoutElem = document.querySelector(".user-status-item.logout");

  const logintrue = await getLoginStatus();

  if (logintrue.status === true) {
    userpageElem.style.display = "block";
    logoutElem.style.display = "block";
    loginElem.style.display = "none";
  } else {
    userpageElem.style.display = "none";
    logoutElem.style.display = "none";
    loginElem.style.display = "block";
  }
}

function getLogOut() {
  if (confirm("정말 로그아웃 하시겠습니까?")) {
    fetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((response) => {
      if (response.status == 401) {
        alert("로그인 후 이용 가능합니다.");
      } else if (response.status == 200) {
        window.location.href = "/?page=1";
      }
    });
  }
}

async function goToUserPage() {
  try {
    const logintrue = await getLoginStatus();

    if (logintrue.status === true) {
      window.location.href = `/userpage?user=${logintrue.data.userId}`;
    } else {
      alert("로그인 창으로 이동합니다.");
      window.location.href = `/login`;
    }
  } catch (error) {
    console.error(error);
    alert("로그인 창으로 이동합니다.");
    window.location.href = `/login`;
  }
}

/** Nav바 이벤트 핸들러 (게시판) */
//유저가 로그인 상태이면 게시판 이동
async function goToBoard() {
  try {
    const logintrue = await getLoginStatus();

    if (logintrue.status === true) {
      window.location.href = `/board/?page=1`;
    } else {
      alert("로그인 창으로 이동합니다.");
      window.location.href = `/login`;
    }
  } catch (error) {
    console.error(error);
    alert("로그인 창으로 이동합니다.");
    window.location.href = `/login`;
  }
}

updateMenu();

const logoutElem = document.querySelector(".user-status-item.logout");
const userpageElem = document.querySelector(".user-status-item-left.userpage");
const boardElem = document.querySelector(".menu-items.board");

logoutElem.addEventListener("click", () => {
  getLogOut();
});

userpageElem.addEventListener("click", goToUserPage);
boardElem.addEventListener("click", goToBoard);

// Kakao Map API
var aboutUsLoaded = false;

window.onloadAboutUs = function() {
    if (!aboutUsLoaded) {
        initMap();
        aboutUsLoaded = true;
    }
};

function initMap() {
  let container = document.getElementById("map");
  let options = {
      center: new kakao.maps.LatLng(37.546576, 127.066010),
      level: 3
  };
  let map = new kakao.maps.Map(container, options);

  var markerPosition  = new kakao.maps.LatLng(37.546576, 127.066010);
  var marker = new kakao.maps.Marker({
      position: markerPosition
  });

  marker.setMap(map); 
}

window.onloadAboutUs();