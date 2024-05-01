// import API from ".../api";

//open api로 테스트
async function fetchUsers() {
    const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=30&api_key=live_OFhz6Cq9zKqH8FTbc7H2SIbYETbvWoV1155zqmiwZEFX5B0fB0k12tnENikJsxC4')
    const imageData = await res.json();
    return imageData;
}

//사용자 목록 api 요청
async function fetchUser() {
    const res = await fetch('http://localhost:8080/users')
    const datas = await res.json();
    return datas;
}

//사용자 정보 조회 api 요청(?)
async function fetchUserInfo() {
    const res = await fetch('http://localhost:8080/users/{id}')
    const datas = await res.json();
    return datas;
}


//홈 되돌아가기 기능
document.querySelector(".logo").addEventListener("click", function(event) {
    event.preventDefault(); 
    window.location.href = "/"; 
});



// 메뉴바 이벤트 핸들러
async function menuClickHandler() {
    try {
        const checkLogin = await isLoggedIn();

        if ( checkLogin ) {
            window.location.href='/mypage'
        }
    } catch(error) {
            console.error(error)
            window.location.href=`/login`
    };
    
}

// 다른 사용자 게시물 이벤트 핸들러
async function ImgClickHandler() {
    try {
        const checkLogin = await isLoggedIn();
        const checkUser = await isUser();
        
        // const users = fetchUser(); // 이미지 데이터 가져온다고 가정
        // const userId = users.find(data => data.user.id === data.image.id);

        if ( checkLogin && checkUser ) {
            window.location.href=`/users${userId}` //다른 사용자 페이지 이동
        }
    } catch(error) {
            console.error(error)
            window.location.href=`/login`
    };
}

// 로그인 상태 체크 (세션 관련)
function isLoggedIn() {
    return true;
}

// 사용자 구별 (세션 관련)
function isUser() {
    return true;
}


function updateMenu() {
    if (isLoggedIn()) {
        document.querySelector('.mypage').style.display = 'block';
        document.querySelector('.login').style.display = 'none';
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


async function getUserImage() {
    try {
        const userElem = document.getElementById('userContent');
        const images = await fetchUsers();
        const users = await fetchUser();
        
        userElem.innerHTML = '';
        images.forEach((image, index) => {
            const container = document.createElement('div');
            const imageElem = document.createElement('img');
            const textElem = document.createElement('p');
            
            imageElem.src = image.url;
            imageElem.alt = '등록된 사진이 없습니다.';
            container.appendChild(imageElem);
            container.appendChild(textElem);
            userElem.appendChild(container);
            textElem.className = 'userText';

            textElem.style.display = 'none';

            if (users[index] && users[index].description) {
                textElem.innerHTML = `안녕하세요! <br>
                ${users[index].description}`;
            } else {
                textElem.innerHTML = `사용자 정보가 없습니다.`;
            }

            imageElem.addEventListener('mouseenter', () => {
                textElem.style.display = 'block';
            });

            imageElem.addEventListener('mouseleave', () => {
                textElem.style.display = 'none';
            });
        });
        userElem.addEventListener('click', ImgClickHandler);
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

document.querySelector('.login').addEventListener('click', menuClickHandler);
document.querySelector('.myPage').addEventListener('click', menuClickHandler);
window.addEventListener('unload', () => {
    document.querySelector('.login').removeEventListener('click', NavClickHandler);
});
getUserImage();
// getuserInfo();
updateMenu();


