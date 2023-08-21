document.addEventListener('DOMContentLoaded', function () {
    // Continue with the remaining code
    fetch('/data/gallery.json')
        .then(response => response.json())
        .then(data => {
            const items = data; // Assign the loaded JSON data to the "items" variable

            // Attach click event listener to gallery items
            document.querySelectorAll('.gallery-img').forEach(function (item) {
                item.addEventListener('click', function (event) {
                    event.stopPropagation(); // Stop event propagation to prevent closing the popup immediately
                    console.log('click!');
                    const index = item.dataset.index;
                    const itemData = items[index];

                    // Check if the item is sold
                    if (itemData.availability === 'claimed') {
                        return; // Exit the function, preventing the popup from opening
                    }

                    // Check if the item is a placeholder
                    if (itemData.type === 'placeholder') {
                        return; // Exit the function, preventing the popup from opening
                    }

                    // Populate the popup container with the retrieved data
                    document.getElementById('popup-img').src = itemData.image;
                    document.getElementById('popup-alt-img').src = itemData.alt;
                    document.getElementById('popup-title').textContent = itemData.title;
                    document.getElementById('popup-description').textContent = itemData.description;
                    document.getElementById('popup-size').textContent = itemData.size;
                    document.getElementById('popup-price').textContent = itemData.price;

                    // Set the redirect value for the pop button
                    const popBtn = document.getElementById('pop-btn');
                    popBtn.dataset.redirect = itemData.link;

                    // Add a click event listener to the #pop-btn
                    popBtn.addEventListener('click', function () {
                        // Get the redirect URL from the data-redirect attribute
                        const redirectUrl = popBtn.dataset.redirect;

                        // Redirect the user to the specified URL
                        window.open(redirectUrl, '_blank');
                    });

                    // Show the popup container
                    document.getElementById('popup').style.display = 'flex';

                    // Blur the background
                    document.getElementById('popup-wrapper').style.display = 'flex';
                    document.getElementById('nav-wrapper').classList.add('popup-active');
                    document.getElementById('content-wrapper').classList.add('popup-active');
                });
            });

            // Close the popup
            document.getElementById('popup-close').addEventListener('click', function () {
                closePopup();
            });

            // Close the popup when clicking outside
            document.addEventListener('click', function (event) {
                if (!event.target.closest('.popup')) {
                    closePopup();
                }
            });

        })
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
});

// Function to close the popup
function closePopup() {
    // Hide the popup container
    document.getElementById('popup').style.display = 'none';

    // Remove the blur effect from the background
    document.getElementById('popup-wrapper').style.display = 'none';
    document.getElementById('nav-wrapper').classList.remove('popup-active');
    document.getElementById('content-wrapper').classList.remove('popup-active');
}




const popImgContainers = document.querySelectorAll('.pop-img-container');

const magnificationFactor = 2; // Adjust this value to control magnification level

popImgContainers.forEach(container => {
    const img = container.querySelector('img');
    const magnifyingGlass = container.querySelector('.magnifying-glass');
    const magnifiedImg = magnifyingGlass.querySelector('.magnified-image');
    
    container.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        const glassSize = magnifyingGlass.offsetWidth;
        const imgWidth = img.width;
        const imgHeight = img.height;
        const scaleX = imgWidth / width;
        const scaleY = imgHeight / height;
        
        const magnifiedWidth = imgWidth * scaleX * magnificationFactor;
        const magnifiedHeight = imgHeight * scaleY * magnificationFactor;
        const offsetX = -(mouseX * scaleX * magnificationFactor - glassSize / 2);
        const offsetY = -(mouseY * scaleY * magnificationFactor - glassSize / 2);

        magnifiedImg.style.backgroundImage = `url('${img.src}')`;
        magnifiedImg.style.backgroundSize = `${magnifiedWidth}px ${magnifiedHeight}px`;
        magnifiedImg.style.backgroundPosition = `${offsetX}px ${offsetY}px`;

        const glassX = mouseX - glassSize / 2;
        const glassY = mouseY - glassSize / 2;

        magnifyingGlass.style.left = `${glassX}px`;
        magnifyingGlass.style.top = `${glassY}px`;

        magnifyingGlass.style.display = 'block';
    });

    container.addEventListener('mouseout', () => {
        magnifyingGlass.style.display = 'none';
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
