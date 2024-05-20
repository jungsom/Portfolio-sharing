authcheck();
updateMenu();

//이름, 닉네임, 설명 입력창 및 타이틀 생성
function createInputElement(str_class) {
  const inputElem = document.createElement("input");
  inputElem.type = "text";
  inputElem.className = "input";
  const inputValue = document.querySelector(str_class);
  inputElem.placeholder = `${inputValue.innerText}`;
  return inputElem;
}
function createh4Element(str_text) {
  const h4Elem = document.createElement("h4");
  h4Elem.className = "_h4";
  h4Elem.innerText = str_text;
  return h4Elem;
}
//inputValue 선언함수
function inputValueDefine() {
  const nameValue = document.querySelector(".Name");
  const nicknameValue = document.querySelector(".Nickname");
  const descriptionValue = document.querySelector(".Description");
  return { nameValue, nicknameValue, descriptionValue };
}
//inputValue 요소 display on/off함수
function inputValueDisplaySet(str_text) {
  const { nameValue, nicknameValue, descriptionValue } = inputValueDefine();
  nameValue.style.display = str_text;
  nicknameValue.style.display = str_text;
  descriptionValue.style.display = str_text;
}
//inputContainer 선언함수
function inputContainerDefine() {
  const nameContainer = document.querySelector(".name-container");
  const nicknameContainer = document.querySelector(".nickname-container");
  const descriptionContainer = document.querySelector(".description-container");
  return { nameContainer, nicknameContainer, descriptionContainer };
}
//요소 삭제 함수
function removeInputElement() {
  const { nameContainer, nicknameContainer, descriptionContainer } =
    inputContainerDefine();
  nameContainer.childNodes[4].remove();
  nicknameContainer.childNodes[4].remove();
  descriptionContainer.childNodes[4].remove();
  nameContainer.childNodes[3].remove();
  nicknameContainer.childNodes[3].remove();
  descriptionContainer.childNodes[3].remove();
}
//요소 보이기 함수
// function displayon(...args) {
//   for (const i of args) {
//     args.style.display = "";
//   }
// }
//submit 클릭 시 함수
function submitEditProfile() {
  const { nameValue, nicknameValue, descriptionValue } = inputValueDefine();
  const { nameContainer, nicknameContainer, descriptionContainer } =
    inputContainerDefine();

  //서버로 name, nickname, description 정보 업데이트하기, 에러처리
  fetch("/users/mypage", {
    method: "PUT", // HTTP 메서드
    headers: {
      "Content-Type": "application/json", // 컨텐트 타입 설정
      Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
    },
    body: JSON.stringify({
      name: nameContainer.childNodes[4].value,
      nickname: nicknameContainer.childNodes[4].value,
      description: descriptionContainer.childNodes[4].value,
    }), // JSON 문자열로 변환하여 데이터 전송
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // 응답을 JSON 형태로 파싱
      }
    })
    .then((data) => {
      if (!data.error) {
        //console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
        alert("프로필 정보가 성공적으로 등록되었습니다.");
        nameValue.innerText = data.data.name;
        nicknameValue.innerText = data.data.nickname;
        descriptionValue.innerText = data.data.description;
      } else alert(data.error);
    });

  //요소 보이기
  inputValueDisplaySet("block");

  //요소 삭제
  removeInputElement();

  //Edit 버튼 보이기 , submit/cancel 버튼 삭제
  const profileEditButton = document.querySelector(".profile-edit-button");
  profileEditButton.style.display = "block";
  document.getElementById("submit_edit_button").remove();
  document.getElementById("cancel_edit_button").remove();
}

//cancel 클릭 시 함수
function cancelEditProfile() {
  //요소 보이기
  inputValueDisplaySet("block");

  //요소 삭제
  removeInputElement();

  //Edit 버튼 보이기 , submit/cancel 버튼 삭제
  const profileEditButton = document.querySelector(".profile-edit-button");
  profileEditButton.style.display = "block";
  document.getElementById("submit_edit_button").remove();
  document.getElementById("cancel_edit_button").remove();
}
// edit, 추가, 수정 등 내 페이지일때만 버튼 활성화되게 해당 div 나 button 에 editBtns이라는 class 할당해서 일괄 display 설정
function isVisibleBtns() {
  const params = new URLSearchParams(window.location.search);
  let currentuser = params.get("user");
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      targets = document.querySelectorAll(".editBtns");
      targets.forEach((target) => {
        if (data.data.userId == currentuser) {
          target.style.display = "flex";
        } else {
          target.style.display = "none";
        }
      });
    });
}
async function updateMenu() {
  const loginElem = document.querySelector(".user-status-item.login");
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

  userpageElem.childNodes[1].href = `/userpage/?user=${logintrue.data.userId}`;
  //console.log(userpageElem.childNodes[1].href);
}
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
//userpage 에 표시될 유저 data 받아오기 및 표시
//본인 userpage 던 타 userpage던 아래 코드로 바로 표시가능(구분방법 massId)
function getUserData() {
  const params = new URLSearchParams(window.location.search);
  let currentuser = params.get("user");
  fetch(`/users/${currentuser}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.user) {
        window.location.href = "/404";
      }
      //학력, 수강이력 등 정보는 각각 data.education , data.awards 등으로 변수 정해서 해결할것
      //console.log(`${currentuser}`);
      document.querySelector(".Name").innerText = data.user.name;
      document.querySelector(".Nickname").innerText = data.user.nickname;
      document.querySelector(".Email").innerText = data.user.email;
      document.querySelector(".Description").innerText = data.user.description;
      document.querySelector(".profile-image").src = `/${data.user.profileImg}`;
      // console.log(data); // 전체 데이터 구조 확인
      if (!data || !Array.isArray(data.education)) {
        console.error("Education data is not available or not an array:", data);
        return;
      }
      updateEducationList(data.education);
      updateAwardList(data.awards);
      updateProjectList(data.projects);
      updateCertificateList(data.certificates);
      updateSkillList(data.skills);
    });
}
function logout() {
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
// 프로필 편집 기능
function editProfile() {
  // console.log(nameContainer.childNodes[3]) = Name;
  // console.log(nameContainer.childNodes[4]) = nameEdit;

  const params = new URLSearchParams(window.location.search);
  let currentuser = params.get("user");
  fetch(`/users/${currentuser}`)
    .then((res) => res.json())
    .then((data) => {
      nameEdit.value = data.user.name;
      nicknameEdit.value = data.user.nickname;
      descriptionEdit.value = data.user.description;
    });
  // 프로필 편집 로직
  //입력창 및 타이틀 생성 함수로부터 변수 반환
  const nameEdit = createInputElement(".Name");
  const nicknameEdit = createInputElement(".Nickname");
  const descriptionEdit = createInputElement(".Description");
  const Name = createh4Element("이름");
  const nickname = createh4Element("닉네임");
  const description = createh4Element("설명");
  const { nameValue, nicknameValue, descriptionValue } = inputValueDefine();

  //Edit 버튼 클릭 시 요소 무한생성 방지 조건문
  if (nameEdit.style.display != "none") {
    //div에 자식으로 등록
    const { nameContainer, nicknameContainer, descriptionContainer } =
      inputContainerDefine();

    nameContainer.append(Name);
    nameContainer.append(nameEdit);
    nicknameContainer.append(nickname);
    nicknameContainer.append(nicknameEdit);
    descriptionContainer.append(description);
    descriptionContainer.append(descriptionEdit);

    //요소 숨기기
    inputValueDisplaySet("none");

    //edit 버튼 숨기기
    const profileEditButton = document.querySelector(".profile-edit-button");
    profileEditButton.style.display = "none";

    //submit, cancel 버튼 생성
    const submitEditButton = document.createElement("button");
    submitEditButton.innerText = "Submit";
    submitEditButton.id = "submit_edit_button";
    const cancelEditButton = document.createElement("button");
    cancelEditButton.innerText = "Cancel";
    cancelEditButton.id = "cancel_edit_button";

    const profileBtnContainer = document.querySelector(
      ".edit-button-container"
    );
    profileBtnContainer.append(submitEditButton);
    profileBtnContainer.append(cancelEditButton);

    //submit버튼 클릭시 프로필 편집 정보 저장, 서버로 변경점 업데이트
    submitEditButton.addEventListener("click", (e) => submitEditProfile());

    //cancel버튼 클릭시 프로필 편집 취소, 정보 저장 x
    cancelEditButton.addEventListener("click", (e) => cancelEditProfile());
  }
  //프로필 이미지 편집 로직
  //   function createImageEditButton() {
  //     var ImageEditForm = document.createElement("form");
  //     ImageEditForm.setAttribute("id", "form");
  //     ImageEditForm.setAttribute("method", "post");
  //     ImageEditForm.setAttribute("enctype", "multipart/form-data");
  //     var ImageEditButton = document.createElement("button");
  //     ImageEditButton.textcontent = "프로필 이미지 변경";
  //     document.querySelcetor("#form").append(ImageEditButton);
  //     ImageEditButton.onclick = function changeImage() {};
  //   }
  // alert("프로필 편집 기능은 개발 중입니다.");
  else {
    //요소 보이기
    nameEdit.style.display = "";
    nicknameEdit.style.display = "";
    descriptionEdit.style.display = "";
    Name.style.display = "";
    nickname.style.display = "";
    description.style.display = "";

    const profileEditButton = document.querySelector(".profile-edit-button");
    const cancelEditButton = document.getElementById("cancel_edit_button");
    const submitEditButton = document.getElementById("submit_edit_button");
    submitEditButton.style.display = "";
    cancelEditButton.style.display = "";

    //요소 숨기기
    inputValueDisplaySet("none");
    profileEditButton.style.display = "none";

    //이전 입력값은 회색글씨로 남게하기
    nameEdit.value = "";
    nameEdit.placeholder = `${nameValue.innerText}`;
    nicknameEdit.value = "";
    nicknameEdit.placeholder = `${nicknameValue.innerText}`;
    descriptionEdit.value = "";
    descriptionEdit.placeholder = `${descriptionValue.innerText}`;
  }
}

//학력 추가 기능
function addEducation() {
  const modal = document.getElementById("educationModal"); //폼 데이터를 가져와서 띄운다
  const confirmButton = document.getElementById("education-confirm-button");
  const editButton = document.getElementById("education-edit-button");

  // 폼 초기화
  document.getElementById("educationForm").reset();

  if (editButton) {
    editButton.style.display = "none";
  }

  //추가 버튼 보이기
  confirmButton.style.display = "block";

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

//저장 버튼 클릭 시 post 요청
function confirmEducation(event) {
  const form = document.getElementById("educationModal");

  event.preventDefault();

  const schoolName = document.getElementById("university").value; // 대학교 이름
  const major = document.getElementById("major").value; // 전공
  const schoolStatus = document.getElementById("schoolStatus").value; // 전공

  //console.log(typeof schoolName);
  //console.log(typeof major);
  //console.log(typeof schoolStatus);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    schoolName: schoolName,
    major: major,
    schoolStatus: schoolStatus,
  };

  //console.log(postData);

  fetch(`/mypage/education`, {
    method: "POST", // HTTP 메서드
    headers: {
      "Content-Type": "application/json", // 컨텐트 타입 설정
      Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
    },
    body: JSON.stringify(postData), // JSON 문자열로 변환하여 데이터 전송
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json(); // 응답을 JSON 형태로 파싱
    })
    .then((data) => {
      //console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("학력 정보가 성공적으로 등록되었습니다.");
      document.getElementById("university").value = "";
      document.getElementById("major").value = "";
      document.getElementById("schoolStatus").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error("Error:", error); // 에러 처리
      alert("학력 정보 등록에 실패하였습니다.");
    });
}

//확정된 정보를 div로 추가하기
function updateEducationList(educationArray) {
  const educationList = document.getElementById("educationList");
  educationList.innerHTML = ""; // 기존 목록을 초기화

  educationArray.forEach((educationItem) => {
    const educationDiv = document.createElement("div");
    educationDiv.classList.add("education-entry");
    educationDiv.setAttribute("data-education-id", educationItem.educationId);
    educationDiv.innerHTML = `
          <div>
          <p>학교 이름 : <p1>${educationItem.schoolName}</p1></p>
          <p>전공이름 / 없음 : <p2>${educationItem.major}</p2></p>
          <p>학위 : <p3>${educationItem.schoolStatus}</p3></p>
          </div>
          <div class="editBtns">
          <button class="btn2 btn-red" onclick="deleteEducation(this, '${educationItem.educationId}')">삭제</button>
          <button class="btn2 btn-yellow" onclick="openEditEducationModal('${educationItem.educationId}')">수정</button>
          </div>
      `;
    isVisibleBtns();
    educationList.appendChild(educationDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditEducationModal(educationId) {
  getUserData();
  const modal = document.getElementById("educationModal");
  const saveButton = document.getElementById("education-confirm-button");
  const editButton = document.getElementById("education-edit-button");

  //console.log(document.getElementById("education-edit-button"));

  const educationEntry = document.querySelector(
    `[data-education-id="${educationId}"]`
  );
  const schoolName = educationEntry.querySelector("p1").textContent; // input의 값은 value로 가져옴
  const major = educationEntry.querySelector("p2").textContent;
  const schoolStatus = educationEntry.querySelector("p3").textContent;

  // 모달 폼에 데이터 채우기

  document.getElementById("university").value = schoolName;
  document.getElementById("major").value = major;
  document.getElementById("schoolStatus").value = schoolStatus;

  // 모달 표시
  document
    .getElementById("educationModal")
    .setAttribute("data-education-id", educationId);

  editButton.style.display = "block"; // '수정' 버튼 보이기
  saveButton.style.display = "none";

  // 모달 표시
  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

// 수정된 폼 데이터를 서버에 전송하는 함수
function submitEducationUpdate() {
  const educationId = document
    .getElementById("educationModal")
    .getAttribute("data-education-id");
  const updatedEducation = {
    schoolName: document.getElementById("university").value,
    major: document.getElementById("major").value,
    schoolStatus: document.getElementById("schoolStatus").value,
  };

  fetch(`/mypage/education/${educationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedEducation),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok.");
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("학력 정보가 성공적으로 수정되었습니다.");
      document.getElementById("educationModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error(error);
      alert("학력 정보 업데이트에 실패했습니다.");
    });
}

function deleteEducation(button, educationId) {
  const plusButton = document.getElementById("education_plus_button");
  console.log(educationId);
  fetch(`/mypage/education/${educationId}`, {
    method: "DELETE",
  })
    .then((response) => {
      // 상태 코드 확인
      if (!response.ok) {
        throw new Error(`에러!! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("학력 정보가 삭제되었습니다.");
      const educationEntry = button.closest(".education-entry");
      educationEntry.remove();
    })
    .catch((error) => {
      //console.error("Error:", error);
      alert(`학력 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });
}

//---------------------------------------------------------------------------------
//수상 추가 기능
function addAward() {
  const modal = document.getElementById("awardModal"); //폼 데이터를 가져와서 띄운다
  const confirmButton = document.getElementById("award-confirm-button");
  const editButton = document.getElementById("award-edit-button");

  // 폼 초기화
  document.getElementById("awardForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";

  if (editButton) {
    editButton.style.display = "none";
  }

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

//저장 버튼 클릭 시 post 요청
function confirmAward(event) {
  const form = document.getElementById("awardModal");

  event.preventDefault();

  const title = document.getElementById("title").value; // 수상 이름
  const acqDate = document.getElementById("acqDate").value; // 입상 날짜
  const details = document.getElementById("details").value; // 상세 설명

  //console.log(typeof title);
  //console.log(typeof acqDate);
  //console.log(typeof details);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    title: title,
    acqDate: acqDate,
    details: details,
  };

  //console.log(postData);

  fetch(`/mypage/award`, {
    method: "POST", // HTTP 메서드
    headers: {
      "Content-Type": "application/json", // 컨텐트 타입 설정
      Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
    },
    body: JSON.stringify(postData), // JSON 문자열로 변환하여 데이터 전송
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json(); // 응답을 JSON 형태로 파싱
    })
    .then((data) => {
      //console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("수상 정보가 성공적으로 등록되었습니다.");
      document.getElementById("title").value = "";
      document.getElementById("acqDate").value = "";
      document.getElementById("details").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error("Error:", error); // 에러 처리
      alert("수상 정보 등록에 실패하였습니다.");
    });
}

//확정된 정보를 div로 추가하기
function updateAwardList(awardArray) {
  const awardList = document.getElementById("awardList");
  awardList.innerHTML = ""; // 기존 목록을 초기화

  awardArray.forEach((awardItem) => {
    const awardDiv = document.createElement("div");
    awardDiv.classList.add("award-entry");
    awardDiv.setAttribute("data-award-id", awardItem.awardId);
    awardDiv.innerHTML = `
          <div>
          <p>이름 : <p1>${awardItem.title}</p1></p>
          <p>수상 시기 : <p2>${awardItem.acqDate}</p2></p>
          <p>설명 : <p3>${awardItem.details}</p3></p>
          </div>
          <div class="editBtns">
          <button class="btn2 btn-red" onclick="deleteAward(this, '${awardItem.awardId}')">삭제</button>
          <button class="btn2 btn-yellow" onclick="openEditAwardModal('${awardItem.awardId}')">수정</button>
          </div>
      `;
    isVisibleBtns();
    awardList.appendChild(awardDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditAwardModal(awardId) {
  const modal = document.getElementById("awardModal");
  const saveButton = document.getElementById("award-confirm-button");
  const editButton = document.getElementById("award-edit-button");

  //console.log(document.getElementById("award-edit-button"));

  const awardEntry = document.querySelector(`[data-award-id="${awardId}"]`);
  const title = awardEntry.querySelector("p1").textContent; // input의 값은 value로 가져옴
  const acqDate = awardEntry.querySelector("p2").textContent;
  const details = awardEntry.querySelector("p3").textContent;

  // 모달 폼에 데이터 채우기

  document.getElementById("title").value = title;
  document.getElementById("acqDate").value = acqDate;
  document.getElementById("details").value = details;

  // 모달 표시
  document.getElementById("awardModal").setAttribute("data-award-id", awardId);

  editButton.style.display = "block"; // '수정' 버튼 보이기
  saveButton.style.display = "none";

  // 모달 표시
  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

// 수정된 폼 데이터를 서버에 전송하는 함수
function submitAwardUpdate() {
  const awardId = document
    .getElementById("awardModal")
    .getAttribute("data-award-id");
  const updatedAward = {
    title: document.getElementById("title").value,
    acqDate: document.getElementById("acqDate").value,
    details: document.getElementById("details").value,
  };

  fetch(`/mypage/award/${awardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedAward),
  })
    .then((response) => {
      if (!response.ok) throw new Error("네트워크가 상태가 좋지 않습니다.");
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("수상 정보가 성공적으로 수정되었습니다.");
      document.getElementById("awardModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error(error);
      alert("수상 정보 업데이트에 실패했습니다.");
    });
}

function deleteAward(button, awardId) {
  const plusButton = document.getElementById("award-plus-button");
  console.log(awardId);
  fetch(`/mypage/award/${awardId}`, {
    method: "DELETE",
  })
    .then((response) => {
      // 상태 코드 확인
      if (!response.ok) {
        throw new Error(`에러!! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("수상 정보가 삭제되었습니다.");
      const awardEntry = button.closest(".award-entry");
      awardEntry.remove();
      plusButton.style.display = "block";
    })
    .catch((error) => {
      //console.error("Error:", error);
      alert(`수상 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });
}

//---------------------------------------------------------------------------------
//프로젝트 추가 기능
function addProject() {
  const modal = document.getElementById("projectModal"); //폼 데이터를 가져와서 띄운다
  const confirmButton = document.getElementById("project-confirm-button");
  const editButton = document.getElementById("project-edit-button");

  // 폼 초기화
  document.getElementById("projectForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";

  if (editButton) {
    editButton.style.display = "none";
  }

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

//저장 버튼 클릭 시 post 요청
function confirmProject(event) {
  const form = document.getElementById("projectModal");

  event.preventDefault();

  const title = document.getElementById("projectTitle").value; // 프로젝트 이름
  const startDate = document.getElementById("startDate").value; // 시작 날짜
  const endDate = document.getElementById("endDate").value; // 종료 날짜
  const details = document.getElementById("projectDetails").value; // 상세 설명

  //console.log(typeof title);
  //console.log(typeof startDate);
  //console.log(typeof endDate);
  //console.log(typeof details);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    title: title,
    startDate: startDate,
    endDate: endDate,
    details: details,
  };

  //console.log(postData);

  fetch(`/mypage/project`, {
    method: "POST", // HTTP 메서드
    headers: {
      "Content-Type": "application/json", // 컨텐트 타입 설정
      Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
    },
    body: JSON.stringify(postData), // JSON 문자열로 변환하여 데이터 전송
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json(); // 응답을 JSON 형태로 파싱
    })
    .then((data) => {
      //console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("프로젝트 정보가 성공적으로 등록되었습니다.");
      document.getElementById("projectTitle").value = "";
      document.getElementById("startDate").value = "";
      document.getElementById("endDate").value = "";
      document.getElementById("projectDetails").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error("Error:", error); // 에러 처리
      alert("프로젝트 정보 등록에 실패하였습니다.");
    });
}

//확정된 정보를 div로 추가하기
function updateProjectList(projectArray) {
  const projectList = document.getElementById("projectList");
  projectList.innerHTML = ""; // 기존 목록을 초기화

  projectArray.forEach((projectItem) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project-entry");
    projectDiv.setAttribute("data-project-id", projectItem.projectId);
    projectDiv.innerHTML = `
          <div>
          <p>이름 : <p1>${projectItem.title}</p1></p>
          <p>시작 날짜 : <p2>${projectItem.startDate}</p2></p>
          <p>종료 날짜 : <p3>${projectItem.endDate}</p3></p>
          <p>설명: <p4>${projectItem.details}</p4></p>
          </div>
          <div class="editBtns">
          <button class="btn2 btn-red" onclick="deleteProject(this, '${projectItem.projectId}')">삭제</button>
          <button class="btn2 btn-yellow" onclick="openEditProjectModal('${projectItem.projectId}')">수정</button>
          </div>
      `;
    isVisibleBtns();
    projectList.appendChild(projectDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditProjectModal(projectId) {
  const modal = document.getElementById("projectModal");
  const saveButton = document.getElementById("project-confirm-button");
  const editButton = document.getElementById("project-edit-button");

  //console.log(document.getElementById("project-edit-button"));

  const projectEntry = document.querySelector(
    `[data-project-id="${projectId}"]`
  );
  const title = projectEntry.querySelector("p1").textContent; // input의 값은 value로 가져옴
  const startDate = projectEntry.querySelector("p2").textContent;
  const endDate = projectEntry.querySelector("p3").textContent;
  const details = projectEntry.querySelector("p4").textContent;

  // 모달 폼에 데이터 채우기

  document.getElementById("projectTitle").value = title;
  document.getElementById("startDate").value = startDate;
  document.getElementById("endDate").value = endDate;
  document.getElementById("projectDetails").value = details;

  // 모달 표시
  document
    .getElementById("projectModal")
    .setAttribute("data-project-id", projectId);

  editButton.style.display = "block"; // '수정' 버튼 보이기
  saveButton.style.display = "none";

  // 모달 표시
  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

// 수정된 폼 데이터를 서버에 전송하는 함수
function submitProjectUpdate() {
  const projectId = document
    .getElementById("projectModal")
    .getAttribute("data-project-id");
  const updatedProject = {
    title: document.getElementById("projectTitle").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
    details: document.getElementById("projectDetails").value,
  };

  fetch(`/mypage/project/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProject),
  })
    .then((response) => {
      if (!response.ok) throw new Error("네트워크가 상태가 좋지 않습니다.");
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("수상 정보가 성공적으로 수정되었습니다.");
      document.getElementById("projectModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error(error);
      alert("수상 정보 업데이트에 실패했습니다.");
    });
}

function deleteProject(button, projectId) {
  const plusButton = document.getElementById("project-plus-button");
  //console.log(projectId);
  fetch(`/mypage/project/${projectId}`, {
    method: "DELETE",
  })
    .then((response) => {
      // 상태 코드 확인
      if (!response.ok) {
        throw new Error(`에러!! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("프로젝트 정보가 삭제되었습니다.");
      const projectEntry = button.closest(".project-entry");
      projectEntry.remove();
      plusButton.style.display = "block";
    })
    .catch((error) => {
      //console.error("Error:", error);
      alert(
        `프로젝트 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`
      );
    });
}

//---------------------------------------------------------------------------------
//자격증 추가 기능
function addCertificate() {
  const modal = document.getElementById("certificateModal"); //폼 데이터를 가져와서 띄운다
  const confirmButton = document.getElementById("certificate-confirm-button");
  const editButton = document.getElementById("certificate-edit-button");

  // 폼 초기화
  document.getElementById("certificateForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";

  if (editButton) {
    editButton.style.display = "none";
  }

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

//저장 버튼 클릭 시 post 요청
function confirmCertificate(event) {
  const form = document.getElementById("certificateModal");

  event.preventDefault();

  const title = document.getElementById("certificateTitle").value; // 자격증 이름
  const acqDate = document.getElementById("acquireDate").value; // 취득 날짜

  //console.log(typeof title);
  //console.log(typeof acqDate);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    title: title,
    acqDate: acqDate,
  };

  //console.log(postData);

  fetch(`/mypage/certificate`, {
    method: "POST", // HTTP 메서드
    headers: {
      "Content-Type": "application/json", // 컨텐트 타입 설정
      Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
    },
    body: JSON.stringify(postData), // JSON 문자열로 변환하여 데이터 전송
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json(); // 응답을 JSON 형태로 파싱
    })
    .then((data) => {
      //console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("자격증 정보가 성공적으로 등록되었습니다.");
      document.getElementById("certificateTitle").value = "";
      document.getElementById("acquireDate").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error("Error:", error); // 에러 처리
      alert("자격증 정보 등록에 실패하였습니다.");
    });
}

//확정된 정보를 div로 추가하기
function updateCertificateList(certificateArray) {
  const certificateList = document.getElementById("certificateList");
  certificateList.innerHTML = ""; // 기존 목록을 초기화

  certificateArray.forEach((certificateItem) => {
    const certificateDiv = document.createElement("div");
    certificateDiv.classList.add("certificate-entry");
    certificateDiv.setAttribute(
      "data-certificate-id",
      certificateItem.certificateId
    );
    certificateDiv.innerHTML = ` 
          <div>
          <p>이름 : <p1>${certificateItem.title}</p1></p>
          <p>취득 날짜 : <p2>${certificateItem.acqDate}</p2></p>
          </div>
          <div class="editBtns">
          <button class="btn2 btn-red" onclick="deleteCertificate(this, '${certificateItem.certificateId}')">삭제</button>
          <button class="btn2 btn-yellow" onclick="openEditCertificateModal('${certificateItem.certificateId}')">수정</button>
          </div>
      `;
    isVisibleBtns();
    certificateList.appendChild(certificateDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditCertificateModal(certificateId) {
  const modal = document.getElementById("certificateModal");
  const saveButton = document.getElementById("certificate-confirm-button");
  const editButton = document.getElementById("certificate-edit-button");

  //console.log(document.getElementById("certificate-edit-button"));

  const certificateEntry = document.querySelector(
    `[data-certificate-id="${certificateId}"]`
  );
  const title = certificateEntry.querySelector("p1").textContent; // input의 값은 value로 가져옴
  const acqDate = certificateEntry.querySelector("p2").textContent;

  // 모달 폼에 데이터 채우기

  document.getElementById("certificateTitle").value = title;
  document.getElementById("acquireDate").value = acqDate;

  // 모달 표시
  document
    .getElementById("certificateModal")
    .setAttribute("data-certificate-id", certificateId);

  editButton.style.display = "block"; // '수정' 버튼 보이기
  saveButton.style.display = "none"; // '취소' 버튼 보이기

  // 모달 표시
  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

// 수정된 폼 데이터를 서버에 전송하는 함수
function submitCertificateUpdate() {
  const certificateId = document
    .getElementById("certificateModal")
    .getAttribute("data-certificate-id");
  const updatedCertificate = {
    title: document.getElementById("certificateTitle").value,
    acqDate: document.getElementById("acquireDate").value,
  };

  fetch(`/mypage/certificate/${certificateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCertificate),
  })
    .then((response) => {
      if (!response.ok) throw new Error("네트워크가 상태가 좋지 않습니다.");
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("자격증 정보가 성공적으로 수정되었습니다.");
      document.getElementById("certificateModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error(error);
      alert("자격증 정보 업데이트에 실패했습니다.");
    });
}

function deleteCertificate(button, certificateId) {
  const plusButton = document.getElementById("certificate-plus-button");
  //console.log(certificateId);
  fetch(`/mypage/certificate/${certificateId}`, {
    method: "DELETE",
  })
    .then((response) => {
      // 상태 코드 확인
      if (!response.ok) {
        throw new Error(`에러!! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("자격증 정보가 삭제되었습니다.");
      const certificateEntry = button.closest(".certificate-entry");
      certificateEntry.remove();
      plusButton.style.display = "block";
    })
    .catch((error) => {
      //console.error("Error:", error);
      alert(`자격증 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });
}

//---------------------------------------------------------------------------------
//스킬 추가 기능
function addSkill() {
  const modal = document.getElementById("skillModal"); //폼 데이터를 가져와서 띄운다
  const confirmButton = document.getElementById("skill-confirm-button");
  const editButton = document.getElementById("skill-edit-button");

  // 폼 초기화
  document.getElementById("skillForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";

  if (editButton) {
    editButton.style.display = "none";
  }

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

//저장 버튼 클릭 시 post 요청
function confirmSkill(event) {
  const form = document.getElementById("skillModal");

  event.preventDefault();

  const stack = document.getElementById("skillTitle").value; // 자격증 이름

  //console.log(typeof stack);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    stack: stack,
  };

  //console.log(postData);

  fetch(`/mypage/skill`, {
    method: "POST", // HTTP 메서드
    headers: {
      "Content-Type": "application/json", // 컨텐트 타입 설정
      Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
    },
    body: JSON.stringify(postData), // JSON 문자열로 변환하여 데이터 전송
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json(); // 응답을 JSON 형태로 파싱
    })
    .then((data) => {
      //console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("Skill 정보가 성공적으로 등록되었습니다.");
      document.getElementById("skillTitle").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error("Error:", error); // 에러 처리
      alert("자격증 정보 등록에 실패하였습니다.");
    });
}

//확정된 정보를 div로 추가하기
function updateSkillList(skillArray) {
  const skillList = document.getElementById("skillList");
  skillList.innerHTML = ""; // 기존 목록을 초기화

  skillArray.forEach((skillItem) => {
    const skillDiv = document.createElement("div");
    skillDiv.classList.add("skill-entry");
    skillDiv.setAttribute("data-skill-id", skillItem.skillId);
    skillDiv.innerHTML = `
          <div>
          <p><p1>${skillItem.stack}</p1></p>
          </div>
          <div class="editBtns">
          <button class="btn2 btn-red" onclick="deleteSkill(this, '${skillItem.skillId}')">삭제</button>
          <button class="btn2 btn-yellow" onclick="openEditSkillModal('${skillItem.skillId}')">수정</button>
          </div>
      `;
    isVisibleBtns();
    skillList.appendChild(skillDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditSkillModal(skillId) {
  const modal = document.getElementById("skillModal");
  const editButton = document.getElementById("skill-edit-button");
  const confirmButton = document.getElementById("skill-confirm-button");

  //console.log(document.getElementById("skill-edit-button"));

  const skillEntry = document.querySelector(`[data-skill-id="${skillId}"]`);
  const stack = skillEntry.querySelector("p1").textContent; // input의 값은 value로 가져옴

  // 모달 폼에 데이터 채우기

  document.getElementById("skillTitle").value = stack;

  // 모달 표시
  document.getElementById("skillModal").setAttribute("data-skill-id", skillId);

  editButton.style.display = "block"; // '수정' 버튼 보이기
  confirmButton.style.display = "none";

  // 모달 표시
  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // ESC 키를 누르면 닫힘
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // "Escape"는 ESC 키의 키 이벤트
      modal.style.display = "none";
    }
  });
}

// 수정된 폼 데이터를 서버에 전송하는 함수
function submitSkillUpdate() {
  const skillId = document
    .getElementById("skillModal")
    .getAttribute("data-skill-id");
  const updatedSkill = {
    stack: document.getElementById("skillTitle").value,
  };

  fetch(`/mypage/skill/${skillId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedSkill),
  })
    .then((response) => {
      if (!response.ok) throw new Error("네트워크가 상태가 좋지 않습니다.");
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("스킬 정보가 성공적으로 수정되었습니다.");
      document.getElementById("skillModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      //console.error(error);
      alert("스킬 정보 업데이트에 실패했습니다.");
    });
}

function deleteSkill(button, skillId) {
  const plusButton = document.getElementById("skill-plus-button");
  //console.log(skillId);
  fetch(`/mypage/skill/${skillId}`, {
    method: "DELETE",
  })
    .then((response) => {
      // 상태 코드 확인
      if (!response.ok) {
        throw new Error(`에러!! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      alert("스킬 정보가 삭제되었습니다.");
      const skillEntry = button.closest(".skill-entry");
      skillEntry.remove();
      plusButton.style.display = "block";
    })
    .catch((error) => {
      //console.error("Error:", error);
      alert(`스킬 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });

  plusButton.style.display = "block";
}

getUserData();
isVisibleBtns();

window.addEventListener("popstate", function (event) {
  delete massId; // 사용자 id 값 삭제
  localStorage.removeItem("tempId"); // 로컬 스토리지 삭제
});

//비밀번호 변경
function passwordChange() {
  const modal = document.getElementById("password_change_modal");
  modal.style.display = "block";
}
function passwordChangeConfirm() {
  const prevPw = document.getElementById("existed-pw").value;
  const pw = document.getElementById("change-setpw").value;
  const pwchk = document.getElementById("change-setpwchk").value;
  // console.log(prevPw, pw);

  if (passwordCheck(pw, pwchk)) {
    fetch("/auth", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: prevPw,
        newPassword: pw,
      }),
    }).then((response) => {
      // console.log("res : ", response);
      if (response.status == 200) {
        changepwmodalOpen(10);
        modalbtnhide();
        document.getElementById("move_btn1").style.display = "block";
      } else if (response.status == 400) {
        changepwmodalOpen(5);
      } else if (response.status == 401) {
        changepwmodalOpen(11);
      } else if (response.status == 409) {
        changepwmodalOpen(12);
      }
    });
  } else {
    alert(
      "새 비밀번호와 재확인 값이 다릅니다. (비밀번호는 최소 4자리 이상 입력해야 합니다.)"
    );
    return;
  }
}

function passwordCheck(pw, pwchk) {
  if (pw != "" && pwchk != "") {
    if (pw == pwchk) {
      if (pw.length >= 4) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

//회원탈퇴
function accountDelete() {
  const modal = document.getElementById("delete_account_modal");
  modal.style.display = "block";
}

function accountDeleteConfirm() {
  if (confirm("정말 회원탈퇴를 진행하시겠습니까?")) {
    const modalClosebtn = document.querySelector(".modal_btn");
    modalClosebtn.style.display = "block";
    const pw = document.getElementById("delete-account-pwchk").value;
    fetch("/auth", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: pw,
      }),
    }).then((response) => {
      if (response.status == 400) {
        delaccmodalOpen(5);
      } else if (response.status == 401) {
        delaccmodalOpen(8);
      } else if (response.status == 200) {
        delaccmodalOpen(9);
        clear();
        inputBoxhide();
        modalbtnhide();
        document.getElementById("move_btn2").style.display = "block";
      }
    });
  }
}
function changepwmodalOpen(txtNum) {
  changeModalText(txtNum, 1);
  document.getElementById("password_change_modal").style.display = "block";
}

function delaccmodalOpen(txtNum) {
  changeModalText(txtNum, 2);
  document.getElementById("delete_account_modal").style.display = "block";
}

function gotologin() {
  modalClose();
  //변경된 비밀번호로 다시 로그인하게 유도
  fetch("/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  localStorage.setItem("goTo", "login");
  window.location.href = "/login";
}

function clear() {
  const target = document.querySelectorAll(".InputBox");
  target.forEach((target) => {
    target.value = "";
  });
}
function inputBoxhide() {
  const target = document.querySelectorAll(".InputBox");
  target.forEach((target) => {
    target.style.display = "none";
  });
}
function modalbtnhide() {
  const target = document.querySelectorAll(".modal_btn");
  target.forEach((target) => {
    target.style.display = "none";
  });
}
function changeModalText(txtNum, n) {
  if (txtNum == 1) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "등록되어있지 않은 ID 혹은 비밀번호를 입력하였습니다.";
  } else if (txtNum == 2) {
    document.getElementById(`modaltext${n}`).innerHTML = "로그인 성공";
  } else if (txtNum == 3) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "비밀번호를 다시 확인해주세요.";
  } else if (txtNum == 4) {
    document.getElementById(`modaltext${n}`).innerHTML = "가입완료!";
  } else if (txtNum == 5) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "입력되지않은 내용이 있습니다.";
  } else if (txtNum == 6) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "이미 가입되어있는 ID 입니다.";
  } else if (txtNum == 7) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "올바른 형태의 email 을 입력해주세요.";
  } else if (txtNum == 8) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "비밀번호가 일치하지 않습니다.";
  } else if (txtNum == 9) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "회원탈퇴가 정상적으로 완료되었습니다.";
  } else if (txtNum == 10) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "비밀번호 변경 성공! 다시 로그인 해주세요.";
  } else if (txtNum == 11) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "기존 비밀번호가 일치하지 않습니다.";
  } else if (txtNum == 12) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "변경하려는 비밀번호가 지금 사용하고 있는 비밀번호와 같습니다.";
  } else if (txtNum == 13) {
    document.getElementById(`modaltext${n}`).innerHTML =
      "이미 사용중인 닉네임 입니다.";
  }
}
function modalClose() {
  const target = document.querySelectorAll(".modal_btn");
  target.forEach((target) => {
    target.style.display = "block";
  });
  const movebtn1 = document.getElementById("move_btn1");
  movebtn1.style.display = "none";
  const movebtn2 = document.getElementById("move_btn2");
  movebtn2.style.display = "none";
  document.getElementById("delete_account_modal").style.display = "none";
  document.getElementById("password_change_modal").style.display = "none";
}

//Header 공통코드
document.querySelector("#login").addEventListener("click", gotoLogin);
document.querySelector("#logout").addEventListener("click", logout);
document.querySelector("#userpage").addEventListener("click", gotoUserpage);
document.querySelector("#board").addEventListener("click", gotoBoard);

function gotoUserpage() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
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
        window.location.href = "/";
      }
    });
  }
}

function gotoLogin() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
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
      //console.log(data);
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
      //console.log(data);
      if (data.status) {
        return;
      } else {
        alert("잘못 된 접근입니다. 로그인 후 이용해주세요.");
        window.location.href = "/login";
      }
    });
}
///헤더 공통코드 끝

{
  /* <form action="/action_page.php" method="get">
  <input type="text" id="fname" name="fname"><br><br>
  <input type="text" id="lname" name="lname"><br><br>
  <input type="submit" value="Submit">
</form> */
}

function uploadImageProfile() {
  fileInput = document.querySelector(".profileImageInput");

  const formdata = new FormData();
  formdata.append("profileImg", fileInput.files[0]);
  const requestOptions = {
    method: "PUT",
    body: formdata,
    redirect: "follow",
  };

  fetch("/users/mypage/profileImg", requestOptions)
    .then((response) => response.text())
    .then((data) => {
      if (!data.error) {
        console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
        alert("프로필 정보가 성공적으로 등록되었습니다.");
      } else alert(data.error);
      getUserData();
    })
    .catch((error) => console.error(error));
}
