// Sidebar toggling
function toggleSidebarVisibility() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

// Open employee form
function openEmployeeForm() {
    document.getElementById('employeeFormContainer').classList.add('show');
}

// Close employee form
function closeEmployeeForm() {
    document.getElementById('employeeFormContainer').classList.remove('show');
}

// Toggle manager details
function toggleManagerDetails() {
    const details = document.getElementById('managerDetails');
    details.style.display = details.style.display === 'none' ? 'block' : 'none';
}

// Toggle manager edit form
function toggleManagerEdit() {
    const details = document.getElementById('managerDetails');
    const editForm = document.getElementById('managerEditForm');
    if (editForm.style.display === 'none' || editForm.style.display === '') {
        details.style.display = 'none';
        editForm.style.display = 'block';
    } else {
        details.style.display = 'block';
        editForm.style.display = 'none';
    }
}

// Cancel editing manager details
function cancelManagerEdit() {
    toggleManagerEdit(); // Hide edit form and show manager details
}

// Click outside to close sidebar
document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (!sidebar.contains(event.target) && !mainContent.contains(event.target)) {
        sidebar.classList.remove('show');
    }
});

// Handle manager form submission
document.getElementById('managerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('managerNameInput').value;
    const psNo = document.getElementById('managerPsNoInput').value;
    const role = document.getElementById('managerRoleInput').value;

    document.getElementById('managerName').textContent = `Manager: ${name}`;
    document.getElementById('managerPsNo').textContent = `PS Number: ${psNo}`;
    document.getElementById('managerRole').textContent = `Role: ${role}`;

    cancelManagerEdit(); // Close the form after saving
});

// Existing employee data handling
const employeeForm = document.getElementById('employeeForm');
let employeeData = JSON.parse(localStorage.getItem('employeeData')) || [];

// Function to remove an employee
function removeEmployee() {
    const psNoContainer = document.getElementById('psNoContainer');
    const psNoToRemoveInput = document.getElementById('psNoToRemove');
    const removeBtnText = document.querySelector('.btn-danger');

    // Toggle visibility of the input field
    if (psNoContainer.style.display === 'none' || psNoContainer.style.display === '') {
        psNoContainer.style.display = 'block';
        removeBtnText.textContent = 'Remove';
    } else {
        const psNoToRemove = psNoToRemoveInput.value;

        // Check if the PS No exists in the employeeData array
        const employeeIndex = employeeData.findIndex(employee => employee.psNo === psNoToRemove);
        if (employeeIndex !== -1) {
            // Remove the employee
            employeeData.splice(employeeIndex, 1);
            localStorage.setItem('employeeData', JSON.stringify(employeeData));
            updateEmployeeDropdown();

            // Clear the input and hide the input container
            psNoToRemoveInput.value = '';
            psNoContainer.style.display = 'none';
            removeBtnText.textContent = 'Remove';
        } else {
            alert('PS No not found.');
        }
    }
}

// Employee form submission
employeeForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const employeeName = document.getElementById('employeeName').value;
    const employeePSNo = document.getElementById('employeePSNo').value;
    const employeeRole = document.getElementById('employeeRole').value;
    const employeeStartDate = document.getElementById('employeeStartDate').value;

    // Check for duplicate PS No
    if (employeeData.some(employee => employee.psNo === employeePSNo)) {
        document.getElementById('psNoError').style.display = 'block';
        return;
    }

    // Add new employee data
    const newEmployee = {
        name: employeeName,
        psNo: employeePSNo,
        role: employeeRole,
        startDate: employeeStartDate
    };

    employeeData.push(newEmployee);
    localStorage.setItem('employeeData', JSON.stringify(employeeData));

    // Reset the form
    employeeForm.reset();
    closeEmployeeForm();
    updateEmployeeDropdown();
});

// Update the employee dropdown list
function updateEmployeeDropdown() {
    const dropdown = document.getElementById('employeeDropdown');
    dropdown.innerHTML = '<option value="">Select an employee</option>';

    employeeData.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.psNo;
        option.textContent = employee.name;
        dropdown.appendChild(option);
    });
}

// View selected employee details
function viewEmployeeDetails(psNo) {
    const selectedEmployee = employeeData.find(employee => employee.psNo === psNo);
    if (selectedEmployee) {
        document.getElementById('projectDetails').innerHTML = `
            <h2>${selectedEmployee.name}</h2>
            <p>PS Number: ${selectedEmployee.psNo}</p>
            <p><a href="employee.html?psNo=${selectedEmployee.psNo}">View Full Details</a></p>
        `;
    } else {
        document.getElementById('projectDetails').innerHTML = '<p>No employee selected.</p>';
    }
}

// Load employee data on page load
document.addEventListener('DOMContentLoaded', function () {
    updateEmployeeDropdown();

    // Retrieve project data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    // Load card data from localStorage
    const cardData = JSON.parse(localStorage.getItem('cardData')) || [];
    const project = cardData.find(p => p.id === Number(projectId));

    if (project) {
        document.getElementById('projectTitle').textContent = project.title;
        document.getElementById('projectDescription').textContent = project.text;
        document.getElementById('projectImage').src = project.image;
        document.getElementById('startDate').textContent = project.startDate;
        document.getElementById('endDate').textContent = project.endDate;

        // Populate employee list
        const employeeList = document.getElementById('employeeList');
        project.employeeNames.forEach(name => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="employee.html?name=${encodeURIComponent(name)}">${name}</a>`;
            employeeList.appendChild(li);
        });
    } else {
        alert('Project not found');
    }
});
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.toggle('show');
}

function goBack() {
    window.location.href = './project.html'; // Redirect to the projects page
}
