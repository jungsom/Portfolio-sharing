document.addEventListener('DOMContentLoaded', function() {
    const homeMenuItem = document.querySelector('.menu-items.home');
    homeMenuItem.classList.add('active');
    const menuItems = document.querySelectorAll('.menu-items');

    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            menuItems.forEach(function(item) {
                item.classList.remove('active');
            });

            this.classList.add('active');
        });
    });
});