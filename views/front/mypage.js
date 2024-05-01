const deleteButton = document.getElementById("delete-button");
const confirmButton = document.getElementById("confirm-button");
const plusButton = document.getElementById("plus-button");
const editButton = document.getElementById("edit-button");




fetch("http://localhost:8080/users")
     .then(res => res.json())
    .then(data => console.log(data));
// 프로필 편집 기능


function editProfile() {
    // 프로필 편집 로직
    alert("프로필 편집 기능은 개발 중입니다.");
  }
  
  // 학력 추가 기능
// 학력 항목에 대한 편집 버튼 생성
function createEditButton() {
    var editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function() {
      editEducation(this.parentElement);
    };
    return editButton;
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
  const educationDiv = document.querySelector('.education-list');
  educationDiv.style.display = 'none';

  plusButton.style.display = 'block';
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
    const selectElements = document.querySelectorAll('.education-list select');

    // 각 select 요소에서 선택된 값을 저장할 변수를 선언합니다.
    let educationType, degree;

    // 첫 번째 select 요소에서 선택된 값을 가져옵니다.
    educationType = selectElements[0].value;

    // 두 번째 select 요소에서 선택된 값을 가져옵니다.
    degree = selectElements[1].value;

    // 가져온 정보를 활용하여 추가 작업을 수행합니다.
    console.log("학력 구분:", educationType);
    console.log("학위:", degree);

    // 필요에 따라 가져온 정보를 활용하여 추가적인 작업을 수행합니다.
  
      // 가져온 정보를 화면에 출력합니다.
      const confirmedInfo = `학력 구분: ${educationType}\n학위: ${degree}`
      alert(confirmedInfo);
  }
  