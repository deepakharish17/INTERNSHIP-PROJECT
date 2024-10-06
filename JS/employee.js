  // Function to get URL query parameters
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Fetch and display employee details based on PS Number
function loadEmployeeDetails() {
    const psNo = getQueryParam('psNo');
    if (!psNo) {
        document.getElementById('employeeDetails').innerHTML = '<p class="text-center">No employee selected.</p>';
        return;
    }

    // Fetch employee data from localStorage (or from an API if applicable)
    const employeeData = JSON.parse(localStorage.getItem('employeeData')) || [];
    const employee = employeeData.find(emp => emp.psNo === psNo);

    if (employee) {
        document.getElementById('employeeDetails').innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${employee.name}</h5>
                <p class="card-text"><strong>PS Number:</strong> ${employee.psNo}</p>
                <p class="card-text"><strong>Role:</strong> ${employee.role}</p>
                <p class="card-text"><strong>Start Date:</strong> ${employee.startDate}</p>
                <!-- Add more details if needed -->
            </div>
        `;
    } else {
        document.getElementById('employeeDetails').innerHTML = '<p class="text-center">Employee not found.</p>';
    }
}

// Load employee details on page load
document.addEventListener('DOMContentLoaded', loadEmployeeDetails);
