

document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.image-gallery');
    var masonry = new Masonry(grid, {
        itemSelector: '.image-container',
        columnWidth: '.image-container',
        gutter: 10, // Adjust this to match your grid-gap
    });
});




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























// Select the grid container element using its class name
const grid = document.querySelector('.grid');


console.log(grid); // Make sure it's not null

// Define your fetchGalleryData and renderGridItems functions here
function fetchGalleryData() {
    return fetch('data/gallery.json')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching gallery data:', error);
            return [];
        });
}

function renderGridItems(items) {
    const grid = document.querySelector('.grid');

    items.forEach((item, index) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.id = `grid-item-${index}`;

        const image = document.createElement('img');
        image.className = 'grid-image';
        image.src = item.image;
        image.alt = 'Image';

        gridItem.appendChild(image);
        grid.appendChild(gridItem);
    });

    // Initialize Masonry after all items are inserted
    var msnry = new Masonry(grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
    });
}

// Fetch the data and render the grid when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchGalleryData().then(items => {
        renderGridItems(items);
    });
});



// Assuming you have already defined the "grid" variable as before



