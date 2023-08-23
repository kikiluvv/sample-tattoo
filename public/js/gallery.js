
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







function generateFormLink(flashId) {
    return `https://form.jotform.com/232338318374155?flashId=${flashId}`;
}
const bookingLinks = document.querySelectorAll('.booking-link');
bookingLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const flashId = this.parentElement.getAttribute('data-id');
        const schedulingLink = generateFormLink(flashId);
        window.open(schedulingLink, 'blank');
    });
});
