
// JavaScript code to show/hide the scroll-to-top button and handle scrolling

function toggleScrollButton() {
    var button = document.getElementById('up-container');
    if (window.scrollY > 200) {
        button.classList.add('arrow-show'); // Add the "show" class
    } else {
        button.classList.remove('arrow-show'); // Remove the "show" class
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addEventListener('scroll', toggleScrollButton);
document.getElementById('up-container').addEventListener('click', scrollToTop);

// Initial check for the scroll position to hide/show the button
toggleScrollButton();










