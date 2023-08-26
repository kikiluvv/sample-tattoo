
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
    return `https://form.jotform.com/232376224013042?flashId=${flashId}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const bookingLinks = document.querySelectorAll('.booking-link');
    
    bookingLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const flashId = this.getAttribute('data-id');
            const schedulingLink = generateFormLink(flashId);
            window.open(schedulingLink, 'blank');
        });
    });
});
