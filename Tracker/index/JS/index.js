// js for index.html


function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('active');
}

document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.toLowerCase();
    alert('Search functionality is not implemented yet. Search query: ' + query);
});
function updateUserProfile(imageUrl, userName) {
    document.getElementById('profileImage').src = imageUrl;
    document.getElementById('profileName').textContent = userName;
}
// profile picture settings
// Example usage: This could be done after a user updates their profile settings
updateUserProfile('path_to_new_image.jpg', 'User Name');
function updateUserProfile(imageUrl, userName) {
    const profileImage = document.getElementById('profileImage');
    const profileName = document.getElementById('profileName');

    // If imageUrl is not provided, use the default profile image
    profileImage.src = imageUrl || './images/web.png';

    // If userName is not provided, use the default name
    profileName.textContent = userName || '';
}

// Example usage: When a user logs in or updates their profile
updateUserProfile(null, null); // Will use default profile
updateUserProfile('path_to_new_image.jpg', 'Jane Doe'); // Will update with user's data
// Simulating fetching user data from the backend
const userData = {
    profileImageUrl: null, // No profile image uploaded yet
    userName: null         // No name set yet
};

// Update the profile with either the user data or fall back to defaults
updateUserProfile(userData.profileImageUrl, userData.userName);


// search bar functioning

document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const query = searchInput.value.trim();

        if (query) {
            // Perform your search operation here
            console.log(`Searching for: ${query}`);
            // For example, you might want to send the query to a server or filter content on the page
        } else {
            console.log('Search query is empty');
        }
    });
});






// contactus code

