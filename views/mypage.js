const deleteButton = document.getElementById("delete-button");
const confirmButton = document.getElementById("confirm-button");
const plusButton = document.getElementById("plus-button");
const editButton = document.getElementById("edit-button");
const selectElements = document.querySelectorAll(".education-list select");
const inputElements = document.querySelectorAll(".education-list input");

// fetch("http://localhost:8080/users")
//   .then((res) => res.json())
//   .then((data) => console.log(data));
// 프로필 편집 기능

function editProfile() {
  // 프로필 편집 로직
  alert("프로필 편집 기능은 개발 중입니다.");
}

//학력 추가 기능
function addEducation() {
  var educationList = document.getElementById("educationList");

  if (educationList.style.display === "none") {
    educationList.style.display = "block";
    deleteButton.style.display = "block";
    confirmButton.style.display = "block";
    plusButton.style.display = "none";
  } else {
    educationList.style.display = "none";
  }
}

function removeEducation(deleteButton) {
  const educationDiv = document.querySelector(".education-list");
  educationDiv.style.display = "none";

  plusButton.style.display = "block";
  editButton.style.display = "none";
  deleteButton.style.display = "none";
  confirmButton.style.display = "none";
}

// 학력 편집 기능
function editEducation(educationItem) {
  // contentEditable 상태 토글
  var isEditable = educationItem.contentEditable === "true";
  educationItem.contentEditable = isEditable ? "false" : "true";
  if (!isEditable) {
    educationItem.focus(); // 편집 가능 상태가 되면 포커스
  }
}

function confirmEducation() {
  // 각 정보를 가져옵니다.
  // 각 select 요소를 선택합니다.
  const selectElements = document.querySelectorAll(".education-list select");
  const inputElements = document.querySelectorAll(".education-list input");

  // 각 select 요소에서 선택된 값을 저장할 변수를 선언합니다.
  let educationType, degree;
  let schoolName, major;

  // 첫 번째 select 요소에서 선택된 값을 가져옵니다.
  educationType = selectElements[0].value;
  // 두 번째 select 요소에서 선택된 값을 가져옵니다.
  degree = selectElements[1].value;

  schoolName = inputElements[0].value;
  major = inputElements[1].value;

  // 가져온 정보를 활용하여 추가 작업을 수행합니다.
  console.log("학력 구분:", educationType);
  console.log("학위:", degree);
  console.log("학교 이름:", schoolName);
  console.log("전공:", major);

  // 필요에 따라 가져온 정보를 활용하여 추가적인 작업을 수행합니다.

  const postData = {
    schoolName: schoolName,
    major: major,
    schoolState: degree,
  };

  fetch("http://localhost:8080/education", {
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
    })
    .catch((error) => {
      console.error("Error:", error); // 에러 처리
      alert("학력 정보 등록에 실패하였습니다.");
    });

  // 가져온 정보를 화면에 출력합니다.
  const confirmedInfo = `학력 구분: ${educationType}\n학위: ${degree}\n학교이름: ${schoolName}\n학위: ${major}`;
  alert(confirmedInfo);

  selectElements.forEach((element) => (element.disabled = true));
  inputElements.forEach((element) => (element.disabled = true));

  // 확인 버튼 숨기기, 수정 버튼 보이기
  confirmButton.style.display = "none";
  editButton.style.display = "block";
}

function editEducation() {
  // 입력 필드 및 선택 필드 활성화
  selectElements.forEach((element) => (element.disabled = false));
  inputElements.forEach((element) => (element.disabled = false));

  // 수정 버튼 숨기기, 확인 버튼 보이기
  confirmButton.style.display = "block";
  editButton.style.display = "none";
}
