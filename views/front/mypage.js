//변수 선언
const deleteButton = document.getElementById("delete-button");
const confirmButton = document.getElementById("confirm-button");
const plusButton = document.getElementById("plus-button");
const editButton = document.getElementById("edit-button");
var Editcount = 0;
var nameEdit,
  nameValue,
  Name,
  emailEdit,
  emailValue,
  email,
  commentEdit,
  commentValue,
  comment;
var nameContainer,
  emailContainer,
  commentContainer,
  submitEditButton,
  cancelEditButton,
  profile,
  profileEditButton;

fetch("http://localhost:8080/users")
  .then((res) => res.json())
  .then((data) => console.log(data));

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

    //이메일 편집 input 생성
    emailEdit = document.createElement("input");
    emailEdit.setAttribute("type", "text");
    emailEdit.className = "input";
    emailValue = document.querySelector(".Email");
    emailEdit.setAttribute("placeholder", `${emailValue.innerText}`);

    email = document.createElement("h4");
    email.className = "_h4";
    email.innerText = "이메일 주소";

    //설명 편집 input 생성
    commentEdit = document.createElement("input");
    commentEdit.setAttribute("type", "text");
    commentEdit.className = "input";
    commentValue = document.querySelector(".Comment");
    commentEdit.setAttribute("placeholder", `${commentValue.innerText}`);

    comment = document.createElement("h4");
    comment.className = "_h4";
    comment.innerText = "설명";

    //div에 자식으로 등록
    nameContainer = document.querySelector(".nameContainer");
    emailContainer = document.querySelector(".emailContainer");
    commentContainer = document.querySelector(".commentContainer");
    nameContainer.append(Name);
    nameContainer.append(nameEdit);
    emailContainer.append(email);
    emailContainer.append(emailEdit);
    commentContainer.append(comment);
    commentContainer.append(commentEdit);

    //요소 숨기기
    nameValue.style.display = "none";
    emailValue.style.display = "none";
    commentValue.style.display = "none";

    //submit, cancel 버튼 생성
    submitEditButton = document.createElement("button");
    submitEditButton.innerText = "Submit";
    cancelEditButton = document.createElement("button");
    cancelEditButton.innerText = "Cancel";

    //submit, cancel 버튼 클릭시 함수
    submitEditButton.onclick = function submitEditProfile() {
      // 편집 값 저장 & 공백시 "없음" 출력
      nameValue.innerText = nameEdit.value;
      if (!nameValue.innerText) nameValue.innerText = "없음";
      emailValue.innerText = emailEdit.value;
      if (!emailValue.innerText) emailValue.innerText = "없음";
      commentValue.innerText = commentEdit.value;
      if (!commentValue.innerText) commentValue.innerText = "없음";

      //요소 보이기
      nameValue.style.display = "block";
      emailValue.style.display = "block";
      commentValue.style.display = "block";
      profileEditButton.style.display = "block";

      //요소 숨기기
      nameEdit.style.display = "none";
      emailEdit.style.display = "none";
      commentEdit.style.display = "none";
      Name.style.display = "none";
      email.style.display = "none";
      comment.style.display = "none";

      submitEditButton.style.display = "none";
      cancelEditButton.style.display = "none";
    };
    cancelEditButton.onclick = function cancelEditProfile() {
      //요소 보이기
      nameValue.style.display = "block";
      emailValue.style.display = "block";
      commentValue.style.display = "block";
      profileEditButton.style.display = "block";

      //요소 숨기기
      nameEdit.style.display = "none";
      emailEdit.style.display = "none";
      commentEdit.style.display = "none";
      Name.style.display = "none";
      email.style.display = "none";
      comment.style.display = "none";

      submitEditButton.style.display = "none";
      cancelEditButton.style.display = "none";
    };

    profile = document.querySelector(".profile");
    profile.append(submitEditButton);
    profile.append(cancelEditButton);

    //edit 버튼 숨기기
    profileEditButton = document.querySelector(".profileEditButton");
    profileEditButton.style.display = "none";

    //3번 반복 되므로 여유되면 함수로 압축

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

    Editcount = 1; //edit 버튼 다시 누를땐 elment 추가 x, 숨김 요소만 보이기 혹시 다른페이지 돌릴때 0으로 바꿔줘야 하나?
  } else {
    //요소 보이기
    nameEdit.style.display = "";
    emailEdit.style.display = "";
    commentEdit.style.display = "";
    Name.style.display = "";
    email.style.display = "";
    comment.style.display = "";

    submitEditButton.style.display = "";
    cancelEditButton.style.display = "";

    //요소 숨기기
    nameValue.style.display = "none";
    emailValue.style.display = "none";
    commentValue.style.display = "none";
    profileEditButton.style.display = "none";

    //이전 입력값은 회색글씨로 남게하기
    nameEdit.value = "";
    nameEdit.setAttribute("placeholder", `${nameValue.innerText}`);
    emailEdit.value = "";
    emailEdit.setAttribute("placeholder", `${emailValue.innerText}`);
    commentEdit.value = "";
    commentEdit.setAttribute("placeholder", `${commentValue.innerText}`);
  }
}
// 학력 추가 기능
// 학력 항목에 대한 편집 버튼 생성
function createEditButton() {
  var editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.onclick = function () {
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
  const educationDiv = document.querySelector(".education-list");
  educationDiv.style.display = "none";

  plusButton.style.display = "block";
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
  const confirmedInfo = `학력 구분: ${educationType}\n학위: ${degree}`;
  alert(confirmedInfo);
}
