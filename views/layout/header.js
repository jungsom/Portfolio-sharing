let headerLoaded = false;

window.onloadHeader = function() {
    if (!headerLoaded) {
        initMenu();
        headerLoaded = true;
    }
};

function initMenu() {
    const menuItems = document.querySelectorAll(".menu-items");
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const baseURI = new URL(window.location.href).pathname.replace(/\/$/, '');

    menuItems.forEach(item => {
        const itemHref = item.querySelector('a').getAttribute('href');
        const className = item.classList[1];

        if (currentPath === '' && itemHref === '/') { // 홈을 클릭한 경우
            item.style.fontWeight = 'bold';
        } else if (currentPath === baseURI && className === baseURI.split('/')[1]) { // 게시판 또는 About Us를 클릭한 경우
            item.style.fontWeight = 'bold';            
        }
    
    });
};

window.onloadHeader();