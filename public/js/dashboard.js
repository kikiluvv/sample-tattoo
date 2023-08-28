const dropdownBtn = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdown-content');

document.addEventListener('click', event => {
    const dropdownBtn = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Check if the clicked element is the dropdown button, its content, or the list item
    if (event.target === dropdownBtn || event.target === dropdownContent || event.target.classList.contains('gallery-item')) {
        dropdownContent.classList.toggle('dropdown-on');
    } else {
        dropdownContent.classList.remove('dropdown-on');
    }
});
