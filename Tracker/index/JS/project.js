const formContainer = document.getElementById('formContainer');
const toggleButton = document.getElementById('toggleButton');
const cardForm = document.getElementById('cardForm');
let cardData = JSON.parse(localStorage.getItem('cardData')) || []; // Load existing card data from localStorage
let editingCardId = null; // Track the ID of the card being edited

// Toggle form container visibility
toggleButton.addEventListener('click', function(event) {
    formContainer.classList.toggle('show');
    if (!formContainer.classList.contains('show')) {
        resetForm();
    }
});

// Handle form submission
cardForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const imageInput = document.getElementById('image').files[0];

    if (imageInput) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const image = e.target.result;

            if (editingCardId !== null) {
                // Update existing card
                updateCard(editingCardId, title, text, startDate, endDate, image);
                editingCardId = null; // Clear the editing ID
            } else {
                // Create a new card
                const cardId = Date.now();
                cardData.push({ id: cardId, title, text, startDate, endDate, image });
                createCard(cardId, title, text, startDate, endDate, image);
            }

            resetForm();
            formContainer.classList.remove('show');
            saveCardData(); // Save updated card data to localStorage
        };

        reader.readAsDataURL(imageInput);
    } else {
        alert("Please select an image.");
    }
});

// Create a card element
function createCard(id, title, text, startDate, endDate, image) {
    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
        <div class="card h-100">
            <div class="card-title-bg" style="background-image: url('${image}');" onclick="redirectToProject(${id})">
                <!-- Background image set in style -->
            </div>
            <div class="card-body">
                <h3 class="card-title">${title}</h3>
                <p class="card-text">${text}</p>
                <div class="card-actions d-flex justify-content-end">
                    <button class="btn btn-danger btn-sm me-2" onclick="confirmDeleteCard(${id})">Delete</button>
                    <button class="btn btn-warning btn-sm" onclick="editCard(${id})">Edit</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('cardContainer').appendChild(card);
}

// Edit a card
function editCard(id) {
    const card = cardData.find(c => c.id === id);
    if (card) {
        document.getElementById('title').value = card.title;
        document.getElementById('text').value = card.text;
        document.getElementById('startDate').value = card.startDate;
        document.getElementById('endDate').value = card.endDate;
        editingCardId = id; // Set the ID of the card being edited
        formContainer.classList.add('show');
    }
}

// Update existing card
function updateCard(id, title, text, startDate, endDate, image) {
    const cardIndex = cardData.findIndex(c => c.id === id);
    if (cardIndex !== -1) {
        cardData[cardIndex] = { id, title, text, startDate, endDate, image };

        // Remove the old card element
        const cardContainer = document.getElementById('cardContainer');
        const cardElement = cardContainer.querySelector(`[onclick="redirectToProject(${id})"]`).parentElement.parentElement;
        cardContainer.removeChild(cardElement);

        // Recreate the card with updated data
        createCard(id, title, text, startDate, endDate, image);
        saveCardData(); // Save updated card data to localStorage
    }
}

// Confirm card deletion
function confirmDeleteCard(id) {
    if (confirm("Are you sure you want to delete this card?")) {
        deleteCard(id);
    }
}

// Delete a card
function deleteCard(id) {
    cardData = cardData.filter(c => c.id !== id);

    // Remove the card element from the DOM
    const cardContainer = document.getElementById('cardContainer');
    const cardElement = cardContainer.querySelector(`[onclick="redirectToProject(${id})"]`).parentElement.parentElement;
    cardContainer.removeChild(cardElement);

    saveCardData(); // Save updated card data to localStorage
}

// Save card data to localStorage
function saveCardData() {
    localStorage.setItem('cardData', JSON.stringify(cardData));
}

// Load card data from localStorage
function loadCardData() {
    cardData.forEach(card => {
        createCard(card.id, card.title, card.text, card.startDate, card.endDate, card.image);
    });
}

// Reset form
function resetForm() {
    cardForm.reset();
    document.getElementById('image').value = '';
}

// Redirect to project details page
function redirectToProject(id) {
    window.location.href = `project-details.html?id=${id}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadCardData();
});
