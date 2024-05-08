var Editcount = 0;

var nameEdit,
  nameValue,
  Name,
  emailEdit,
  emailValue,
  email,
  descriptionEdit,
  descriptionValue,
  description;
var nameContainer,
  emailContainer,
  descriptionContainer,
  submitEditButton,
  cancelEditButton,
  profile,
  profileEditButton;

//네트워크 페이지에서 담아보낼값 아래 localStorage 처럼 사용하면됨
// let massId = localStorage.getItem("tempId"); // 작동되는거확인 Ok
// massId 값 아래 중 하나 선택해서 하드코딩하고 참조되는값 바뀌는것 확인 Ok
// 'ZttKLSVoI4' , 'TU639YT3DO' , 'aaf0b6b7-5ba8-4638-9afd-c38d3d459790'

// let massId = localStorage.getItem("tempId");
const massId = "AopBYfBup4";

// mypage/project get 테스트
fetch("http://localhost:8080/auth/status")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // 전체 데이터 구조 확인
  })
  .catch((error) => console.error("Error:", error));

// edit, 추가, 수정 등 내 페이지일때만 버튼 활성화되게 해당 div 나 button 에 editBtns이라는 class 할당해서 일괄 display 설정
function isVisibleBtns() {
  fetch("http://localhost:8080/auth/status")
    .then((res) => res.json())
    .then((data) => {
      // targets = document.querySelectorAll(".editBtns");
      // targets.forEach((target) => {
      //   if (data.data.id == massId) {
      //     target.style.display = "block";
      //   } else {
      //     target.style.display = "none";
      //   }
      // });
    });
}

//userpage 에 표시될 유저 data 받아오기 및 표시
//본인 userpage 던 타 userpage던 아래 코드로 바로 표시가능(구분방법 massId)
function getUserData() {
  fetch(`http://localhost:8080/users/${massId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      //학력, 수강이력 등 정보는 각각 data.education , data.awards 등으로 변수 정해서 해결할것
      document.querySelector(".Name").innerText = data.user.name;
      document.querySelector(".Email").innerText = data.user.email;
      document.querySelector(".Description").innerText = data.user.description;

      console.log(data); // 전체 데이터 구조 확인
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

// 프로필 편집 기능
function editProfile() {
  // 프로필 편집 로직
  //이름 편집 input 생성
  if (Editcount === 0) {
    nameEdit = document.createElement("input");
    nameEdit.setAttribute("type", "text");
    nameEdit.className = "input";
    nameValue = document.querySelector(".Name");
    nameEdit.setAttribute("placeholder", `${nameValue.innerText}`);

    Name = document.createElement("h4");
    Name.className = "_h4";
    Name.innerText = "이름";

    // //이메일 편집 input 생성
    // emailEdit = document.createElement("input");
    // emailEdit.setAttribute("type", "text");
    // emailEdit.className = "input";
    // emailValue = document.querySelector(".Email");
    // emailEdit.setAttribute("placeholder", `${emailValue.innerText}`);

    // email = document.createElement("h4");
    // email.className = "_h4";
    // email.innerText = "이메일 주소";

    //설명 편집 input 생성
    descriptionEdit = document.createElement("input");
    descriptionEdit.setAttribute("type", "text");
    descriptionEdit.className = "input";
    descriptionValue = document.querySelector(".Description");
    descriptionEdit.setAttribute(
      "placeholder",
      `${descriptionValue.innerText}`
    );

    description = document.createElement("h4");
    description.className = "_h4";
    description.innerText = "설명";

    //div에 자식으로 등록
    nameContainer = document.querySelector(".nameContainer");
    // emailContainer = document.querySelector(".emailContainer");
    descriptionContainer = document.querySelector(".descriptionContainer");
    nameContainer.append(Name);
    nameContainer.append(nameEdit);
    // emailContainer.append(email);
    // emailContainer.append(emailEdit);
    descriptionContainer.append(description);
    descriptionContainer.append(descriptionEdit);

    //요소 숨기기
    nameValue.style.display = "none";
    // emailValue.style.display = "none";
    descriptionValue.style.display = "none";

    //submit, cancel 버튼 생성
    submitEditButton = document.createElement("button");
    submitEditButton.innerText = "Submit";
    cancelEditButton = document.createElement("button");
    cancelEditButton.innerText = "Cancel";

    //submit버튼 클릭시 프로필 편집 정보 저장, 서버로 변경점 업데이트
    submitEditButton.onclick = function submitEditProfile() {
      // 편집 값 저장 & 공백시 "없음" 출력
      nameValue.innerText = nameEdit.value;
      if (!nameValue.innerText) nameValue.innerText = "없음";
      // emailValue.innerText = emailEdit.value;
      // if (!emailValue.innerText) emailValue.innerText = "없음";
      descriptionValue.innerText = descriptionEdit.value;
      if (!descriptionValue.innerText) descriptionValue.innerText = "없음";

      //요소 보이기
      nameValue.style.display = "block";
      // emailValue.style.display = "block";
      descriptionValue.style.display = "block";
      profileEditButton.style.display = "block";

      //요소 숨기기
      nameEdit.style.display = "none";
      // emailEdit.style.display = "none";
      descriptionEdit.style.display = "none";
      Name.style.display = "none";
      // email.style.display = "none";
      description.style.display = "none";

      submitEditButton.style.display = "none";
      cancelEditButton.style.display = "none";

      //서버로 name, description 보내기
      fetch("http://localhost:8080/users/mypage", {
        method: "PUT", // HTTP 메서드
        headers: {
          "Content-Type": "application/json", // 컨텐트 타입 설정
          Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
        },
        body: JSON.stringify({
          name: nameEdit.value,
          description: descriptionEdit.value,
        }), // JSON 문자열로 변환하여 데이터 전송
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("네트워크 오류입니다.");
          }
          return res.json(); // 응답을 JSON 형태로 파싱
        })
        .then((data) => {
          console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
          alert("프로필 정보가 성공적으로 등록되었습니다.");
        })
        .catch((error) => {
          console.error("Error:", error); // 에러 처리
          alert("에러가 발생했습니다");
        });
    };

    cancelEditButton.onclick = function cancelEditProfile() {
      //요소 보이기
      nameValue.style.display = "block";
      // emailValue.style.display = "block";
      descriptionValue.style.display = "block";
      profileEditButton.style.display = "block";

      //요소 숨기기
      nameEdit.style.display = "none";
      // emailEdit.style.display = "none";
      descriptionEdit.style.display = "none";
      Name.style.display = "none";
      // email.style.display = "none";
      description.style.display = "none";

      submitEditButton.style.display = "none";
      cancelEditButton.style.display = "none";
    };

    profile = document.querySelector(".profile");
    profile.append(submitEditButton);
    profile.append(cancelEditButton);

    //edit 버튼 숨기기
    profileEditButton = document.querySelector(".profileEditButton");
    profileEditButton.style.display = "none";

    Editcount = 1; //edit 버튼 다시 누를땐 elment 추가 x, 숨김 요소만 보이기 혹시 다른페이지 돌릴때 0으로 바꿔줘야 하나?
  } else {
    //요소 보이기
    nameEdit.style.display = "";
    // emailEdit.style.display = "";
    descriptionEdit.style.display = "";
    Name.style.display = "";
    // email.style.display = "";
    description.style.display = "";

    submitEditButton.style.display = "";
    cancelEditButton.style.display = "";

    //요소 숨기기
    nameValue.style.display = "none";
    // emailValue.style.display = "none";
    descriptionValue.style.display = "none";
    profileEditButton.style.display = "none";

    //이전 입력값은 회색글씨로 남게하기
    nameEdit.value = "";
    nameEdit.setAttribute("placeholder", `${nameValue.innerText}`);
    // emailEdit.value = "";
    // emailEdit.setAttribute("placeholder", `${emailValue.innerText}`);
    descriptionEdit.value = "";
    descriptionEdit.setAttribute(
      "placeholder",
      `${descriptionValue.innerText}`
    );
  }
}

//학력 추가 기능
function addEducation() {
  const modal = document.getElementById("educationModal"); //폼 데이터를 가져와서 띄운다
  const deleteButton = document.getElementById("close-modal-button");
  const confirmButton = document.getElementById("education-confirm-button");

  // 폼 초기화
  document.getElementById("educationForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";
  deleteButton.style.display = "block";

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

//저장 버튼 클릭 시 post 요청
function confirmEducation(event) {
  const form = document.getElementById("educationModal");

  event.preventDefault();

  const schoolName = document.getElementById("university").value; // 대학교 이름
  const major = document.getElementById("major").value; // 전공
  const schoolStatus = document.getElementById("schoolStatus").value; // 전공

  console.log(typeof schoolName);
  console.log(typeof major);
  console.log(typeof schoolStatus);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    schoolName: schoolName,
    major: major,
    schoolStatus: schoolStatus,
  };

  console.log(postData);

  fetch(`http://localhost:8080/mypage/education`, {
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
      console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("학력 정보가 성공적으로 등록되었습니다.");
      document.getElementById("university").value = "";
      document.getElementById("major").value = "";
      document.getElementById("schoolStatus").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error("Error:", error); // 에러 처리
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
          <p>학교 이름: <p1>${educationItem.schoolName}</p1></p>
          <p>전공: <p2>${educationItem.major}</p2></p>
          <p>학위: <p3>${educationItem.schoolStatus}</p3></p>
          <button onclick="deleteEducation(this, '${educationItem.educationId}')">삭제</button>
          <button onclick="openEditEducationModal('${educationItem.educationId}')">수정</button>
      `;
    educationList.appendChild(educationDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditEducationModal(educationId) {
  const modal = document.getElementById("educationModal");
  const saveButton = document.getElementById("education-confirm-button");
  const editButton = document.getElementById("education-edit-button");
  const cancelButton = document.getElementById("close-modal-button");

  console.log(document.getElementById("education-edit-button"));

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
  cancelButton.style.display = "block"; // '취소' 버튼 보이기

  // 모달 표시
  modal.style.display = "block";
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

  fetch(`http://localhost:8080/mypage/education/${educationId}`, {
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
      console.log(data);
      alert("학력 정보가 성공적으로 수정되었습니다.");
      document.getElementById("educationModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error(error);
      alert("학력 정보 업데이트에 실패했습니다.");
    });
}

// 모달 닫기 함수
function closeModal() {
  document.getElementById("educationModal").style.display = "none";
}

function deleteEducation(button, educationId) {
  const plusButton = document.getElementById("education_plus_button");
  console.log(educationId);
  fetch(`http://localhost:8080/mypage/education/${educationId}`, {
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
      console.log(data);
      alert("학력 정보가 삭제되었습니다.");
      const educationEntry = button.closest(".education-entry");
      educationEntry.remove();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`학력 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });

  plusButton.style.display = "block";
}

//---------------------------------------------------------------------------------
//수상 추가 기능
function addAward() {
  const modal = document.getElementById("awardModal"); //폼 데이터를 가져와서 띄운다
  const deleteButton = document.getElementById("close-award-button");
  const confirmButton = document.getElementById("award-confirm-button");

  // 폼 초기화
  document.getElementById("awardForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";
  deleteButton.style.display = "block";

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

//저장 버튼 클릭 시 post 요청
function confirmAward(event) {
  const form = document.getElementById("awardModal");

  event.preventDefault();

  const title = document.getElementById("title").value; // 수상 이름
  const acqDate = document.getElementById("acqDate").value; // 입상 날짜
  const details = document.getElementById("details").value; // 상세 설명

  console.log(typeof title);
  console.log(typeof acqDate);
  console.log(typeof details);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    title: title,
    acqDate: acqDate,
    details: details,
  };

  console.log(postData);

  fetch(`http://localhost:8080/mypage/award`, {
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
      console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("수상 정보가 성공적으로 등록되었습니다.");
      document.getElementById("title").value = "";
      document.getElementById("acqDate").value = "";
      document.getElementById("details").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error("Error:", error); // 에러 처리
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
          <p>수상 내역: <p1>${awardItem.title}</p1></p>
          <p>수상 시기: <p2>${awardItem.acqDate}</p2></p>
          <p>상세 설명: <p3>${awardItem.details}</p3></p>
          <button onclick="deleteAward(this, '${awardItem.awardId}')">삭제</button>
          <button onclick="openEditAwardModal('${awardItem.awardId}')">수정</button>
      `;
    awardList.appendChild(awardDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditAwardModal(awardId) {
  const modal = document.getElementById("awardModal");
  const saveButton = document.getElementById("award-confirm-button");
  const editButton = document.getElementById("award-edit-button");
  const cancelButton = document.getElementById("close-award-button");

  console.log(document.getElementById("award-edit-button"));

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
  cancelButton.style.display = "block"; // '취소' 버튼 보이기

  // 모달 표시
  modal.style.display = "block";
}

// 수정된 폼 데이터를 서버에 전송하는 함수
function submitAwardUpdate() {
  const awardId = document
    .getElementById("awardModal")
    .getAttribute("data-award-id");
  const updatedAward = {
    title: document.getElementById("projectTitle").value,
    acqDate: document.getElementById("acqDate").value,
    details: document.getElementById("details").value,
  };

  fetch(`http://localhost:8080/mypage/award/${awardId}`, {
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
      console.log(data);
      alert("수상 정보가 성공적으로 수정되었습니다.");
      document.getElementById("awardModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error(error);
      alert("수상 정보 업데이트에 실패했습니다.");
    });
}

// 모달 닫기 함수
function closeAwardModal() {
  document.getElementById("awardModal").style.display = "none";
}

function deleteAward(button, awardId) {
  const plusButton = document.getElementById("award-plus-button");
  console.log(awardId);
  fetch(`http://localhost:8080/mypage/award/${awardId}`, {
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
      console.log(data);
      alert("수상 정보가 삭제되었습니다.");
      const awardEntry = button.closest(".award-entry");
      awardEntry.remove();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`수상 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });

  plusButton.style.display = "block";
}

//---------------------------------------------------------------------------------
//프로젝트 추가 기능
function addProject() {
  const modal = document.getElementById("projectModal"); //폼 데이터를 가져와서 띄운다
  const deleteButton = document.getElementById("close-project-button");
  const confirmButton = document.getElementById("project-confirm-button");

  // 폼 초기화
  document.getElementById("projectForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";
  deleteButton.style.display = "block";

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

//저장 버튼 클릭 시 post 요청
function confirmProject(event) {
  const form = document.getElementById("projectModal");

  event.preventDefault();

  const title = document.getElementById("projectTitle").value; // 프로젝트 이름
  const startDate = document.getElementById("startDate").value; // 시작 날짜
  const endDate = document.getElementById("endDate").value; // 종료 날짜
  const details = document.getElementById("projectDetails").value; // 상세 설명

  console.log(typeof title);
  console.log(typeof startDate);
  console.log(typeof endDate);
  console.log(typeof details);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    title: title,
    startDate: startDate,
    endDate: endDate,
    details: details,
  };

  console.log(postData);

  fetch(`http://localhost:8080/mypage/project`, {
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
      console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("프로젝트 정보가 성공적으로 등록되었습니다.");
      document.getElementById("projectTitle").value = "";
      document.getElementById("startDate").value = "";
      document.getElementById("endDate").value = "";
      document.getElementById("projectDetails").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error("Error:", error); // 에러 처리
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
          <p>수상 내역: <p1>${projectItem.title}</p1></p>
          <p>수상 시기: <p2>${projectItem.startDate}</p2></p>
          <p>수상 시기: <p3>${projectItem.endDate}</p3></p>
          <p>상세 설명: <p4>${projectItem.details}</p4></p>
          <button onclick="deleteProject(this, '${projectItem.projectId}')">삭제</button>
          <button onclick="openEditProjectModal('${projectItem.projectId}')">수정</button>
      `;
    projectList.appendChild(projectDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditProjectModal(projectId) {
  const modal = document.getElementById("projectModal");
  const saveButton = document.getElementById("project-confirm-button");
  const editButton = document.getElementById("project-edit-button");
  const cancelButton = document.getElementById("close-project-button");

  console.log(document.getElementById("project-edit-button"));

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
  cancelButton.style.display = "block"; // '취소' 버튼 보이기

  // 모달 표시
  modal.style.display = "block";
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

  fetch(`http://localhost:8080/mypage/project/${projectId}`, {
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
      console.log(data);
      alert("수상 정보가 성공적으로 수정되었습니다.");
      document.getElementById("projectModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error(error);
      alert("수상 정보 업데이트에 실패했습니다.");
    });
}

// 모달 닫기 함수
function closeProjectModal() {
  document.getElementById("projectModal").style.display = "none";
}

function deleteProject(button, projectId) {
  const plusButton = document.getElementById("project-plus-button");
  console.log(projectId);
  fetch(`http://localhost:8080/mypage/project/${projectId}`, {
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
      console.log(data);
      alert("프로젝트 정보가 삭제되었습니다.");
      const projectEntry = button.closest(".project-entry");
      projectEntry.remove();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(
        `프로젝트 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`
      );
    });

  plusButton.style.display = "block";
}

//---------------------------------------------------------------------------------
//자격증 추가 기능
function addCertificate() {
  const modal = document.getElementById("certificateModal"); //폼 데이터를 가져와서 띄운다
  const deleteButton = document.getElementById("close-certificate-button");
  const confirmButton = document.getElementById("certificate-confirm-button");

  // 폼 초기화
  document.getElementById("certificateForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";
  deleteButton.style.display = "block";

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

//저장 버튼 클릭 시 post 요청
function confirmCertificate(event) {
  const form = document.getElementById("certificateModal");

  event.preventDefault();

  const title = document.getElementById("certificateTitle").value; // 자격증 이름
  const acqDate = document.getElementById("acquireDate").value; // 취득 날짜

  console.log(typeof title);
  console.log(typeof acqDate);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    title: title,
    acqDate: acqDate,
  };

  console.log(postData);

  fetch(`http://localhost:8080/mypage/certificate`, {
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
      console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("자격증 정보가 성공적으로 등록되었습니다.");
      document.getElementById("certificateTitle").value = "";
      document.getElementById("acquireDate").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error("Error:", error); // 에러 처리
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
          <p>자격증 이름: <p1>${certificateItem.title}</p1></p>
          <p>취득 날짜: <p2>${certificateItem.acqDate}</p2></p>
          <button onclick="deleteCertificate(this, '${certificateItem.certificateId}')">삭제</button>
          <button onclick="openEditCertificateModal('${certificateItem.certificateId}')">수정</button>
      `;
    certificateList.appendChild(certificateDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditCertificateModal(certificateId) {
  const modal = document.getElementById("certificateModal");
  const saveButton = document.getElementById("certificate-confirm-button");
  const editButton = document.getElementById("certificate-edit-button");
  const cancelButton = document.getElementById("close-certificate-button");

  console.log(document.getElementById("certificate-edit-button"));

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
  cancelButton.style.display = "block"; // '취소' 버튼 보이기

  // 모달 표시
  modal.style.display = "block";
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

  fetch(`http://localhost:8080/mypage/certificate/${certificateId}`, {
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
      console.log(data);
      alert("자격증 정보가 성공적으로 수정되었습니다.");
      document.getElementById("certificateModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error(error);
      alert("자격증 정보 업데이트에 실패했습니다.");
    });
}

// 모달 닫기 함수
function closeCertificateModal() {
  document.getElementById("certificateModal").style.display = "none";
}

function deleteCertificate(button, certificateId) {
  const plusButton = document.getElementById("certificate-plus-button");
  console.log(certificateId);
  fetch(`http://localhost:8080/mypage/certificate/${certificateId}`, {
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
      console.log(data);
      alert("자격증 정보가 삭제되었습니다.");
      const certificateEntry = button.closest(".certificate-entry");
      certificateEntry.remove();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`자격증 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });

  plusButton.style.display = "block";
}

//---------------------------------------------------------------------------------
//스킬 추가 기능
function addSkill() {
  const modal = document.getElementById("skillModal"); //폼 데이터를 가져와서 띄운다
  const deleteButton = document.getElementById("close-skill-button");
  const confirmButton = document.getElementById("skill-confirm-button");

  // 폼 초기화
  document.getElementById("skillForm").reset();

  //추가 버튼 보이기
  confirmButton.style.display = "block";
  deleteButton.style.display = "block";

  modal.style.display = "block";

  window.onclick = function (event) {
    //폼 밖을 클릭하면 꺼진다
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

//저장 버튼 클릭 시 post 요청
function confirmSkill(event) {
  const form = document.getElementById("skillModal");

  event.preventDefault();

  const stack = document.getElementById("skillTitle").value; // 자격증 이름

  console.log(typeof stack);

  // 가져온 데이터를 객체로 구성합니다.
  const postData = {
    stack: stack,
  };

  console.log(postData);

  fetch(`http://localhost:8080/mypage/skill`, {
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
      console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("자격증 정보가 성공적으로 등록되었습니다.");
      document.getElementById("skillTitle").value = "";
      form.style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error("Error:", error); // 에러 처리
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
          <p>스킬: <p1>${skillItem.stack}</p1></p>
          <button onclick="deleteSkill(this, '${skillItem.skillId}')">삭제</button>
          <button onclick="openEditSkillModal('${skillItem.skillId}')">수정</button>
      `;
    skillList.appendChild(skillDiv);
  });
}

// 모달을 열고 폼에 데이터를 채우는 함수
function openEditSkillModal(skillId) {
  const modal = document.getElementById("skillModal");
  const editButton = document.getElementById("skill-edit-button");
  const cancelButton = document.getElementById("close-skill-button");

  console.log(document.getElementById("skill-edit-button"));

  const skillEntry = document.querySelector(`[data-skill-id="${skillId}"]`);
  const stack = skillEntry.querySelector("p1").textContent; // input의 값은 value로 가져옴

  // 모달 폼에 데이터 채우기

  document.getElementById("skillTitle").value = stack;

  // 모달 표시
  document.getElementById("skillModal").setAttribute("data-skill-id", skillId);

  editButton.style.display = "block"; // '수정' 버튼 보이기
  cancelButton.style.display = "block"; // '취소' 버튼 보이기

  // 모달 표시
  modal.style.display = "block";
}

// 수정된 폼 데이터를 서버에 전송하는 함수
function submitSkillUpdate() {
  const skillId = document
    .getElementById("skillModal")
    .getAttribute("data-skill-id");
  const updatedSkill = {
    stack: document.getElementById("skillTitle").value,
  };

  fetch(`http://localhost:8080/mypage/skill/${skillId}`, {
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
      console.log(data);
      alert("스킬 정보가 성공적으로 수정되었습니다.");
      document.getElementById("skillModal").style.display = "none";
      getUserData();
    })
    .catch((error) => {
      console.error(error);
      alert("스킬 정보 업데이트에 실패했습니다.");
    });
}

// 모달 닫기 함수
function closeSkillModal() {
  document.getElementById("skillModal").style.display = "none";
}

function deleteSkill(button, skillId) {
  const plusButton = document.getElementById("skill-plus-button");
  console.log(skillId);
  fetch(`http://localhost:8080/mypage/skill/${skillId}`, {
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
      console.log(data);
      alert("스킬 정보가 삭제되었습니다.");
      const skillEntry = button.closest(".skill-entry");
      skillEntry.remove();
    })
    .catch((error) => {
      console.error("Error:", error);
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
