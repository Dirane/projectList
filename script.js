// Sample projects and users
const projects = [
    { name: 'AI Chatbot', count: 0 },
    { name: 'E-Commerce Website', count: 0 },
    { name: 'Weather App', count: 0 },
    { name: 'Game Development', count: 0 },
    { name: 'Inventory Management', count: 0 }
];

const users = JSON.parse(localStorage.getItem('users')) || [];
const submissions = JSON.parse(localStorage.getItem('submissions')) || [];

// Forms and elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const projectForm = document.getElementById('projectForm');
const adminView = document.getElementById('adminView');
const firstPreference = document.getElementById('firstPreference');
const secondPreference = document.getElementById('secondPreference');
const submissionsDiv = document.getElementById('submissions');

// Helper functions
function populateDropdown(dropdown) {
    dropdown.innerHTML = '';
    projects.forEach((project, index) => {
        if (project.count < 4) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = project.name;
            dropdown.appendChild(option);
        }
    });
}

function showView(view) {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    projectForm.classList.add('hidden');
    adminView.classList.add('hidden');
    view.classList.remove('hidden');
}

function updateSubmissionsView() {
    submissionsDiv.innerHTML = `<ul>
        ${submissions.map(sub => `<li>${sub.name} selected ${sub.first} and ${sub.second} on ${sub.timestamp}</li>`).join('')}
    </ul>`;
}

// Event listeners
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert('Invalid login credentials!');
        return;
    }

    if (user.role === 'admin') {
        updateSubmissionsView();
        showView(adminView);
    } else {
        populateDropdown(firstPreference);
        populateDropdown(secondPreference);
        showView(projectForm);
    }
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = signupForm.signupName.value;
    const email = signupForm.signupEmail.value;
    const password = signupForm.signupPassword.value;
    const role = signupForm.signupRole.value;

    if (users.some(user => user.email === email)) {
        alert('Email already registered!');
        return;
    }

    users.push({ name, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful!');
    showView(loginForm);
});

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstSelection = projects[firstPreference.value].name;
    const secondSelection = projects[secondPreference.value].name;
    const name = users.find(user => user.email === loginForm.loginEmail.value).name;

    submissions.push({
        name,
        first: firstSelection,
        second: secondSelection,
        timestamp: new Date().toLocaleString()
    });

    projects[firstPreference.value].count++;
    projects[secondPreference.value].count++;

    localStorage.setItem('submissions', JSON.stringify(submissions));
    populateDropdown(firstPreference);
    populateDropdown(secondPreference);

    alert('Submission successful!');
});

document.getElementById('showSignup').addEventListener('click', () => showView(signupForm));
document.getElementById('showLogin').addEventListener('click', () => showView(loginForm));

// Sample project descriptions
const projectDescriptions = {
    'AI Chatbot': 'An interactive chatbot using artificial intelligence.',
    'E-Commerce Website': 'A platform for buying and selling goods online.',
    'Weather App': 'An application to display weather forecasts.',
    'Game Development': 'Create an engaging 2D or 3D game.',
    'Inventory Management': 'A system to manage stock and orders.'
};

// Logout and navigation elements
const logoutButton = document.getElementById('logoutButton');
const projectDescriptionLink = document.getElementById('projectDescriptionLink');
const projectDescriptionPage = document.getElementById('projectDescriptionPage');
const projectList = document.getElementById('projectList');

// Track logged-in user
let loggedInUser = null;

const projectCards = document.getElementById('projectCards');
const backToFormButton = document.getElementById('backToFormButton');

// Populate the project description section with cards
function populateProjectDescriptions() {
    projectCards.innerHTML = Object.entries(projectDescriptions)
        .map(([project, description]) => `
            <div class="card">
                <div class="card-title">${project}</div>
                <div class="card-content">${description}</div>
            </div>
        `)
        .join('');
}

// Handle "Back to Form" button
backToFormButton.addEventListener('click', () => {
    showView(projectForm);
});

// Ensure descriptions are hidden after logout or navigating away
logoutButton.addEventListener('click', () => {
    loggedInUser = null;
    showView(loginForm);
    logoutButton.classList.add('hidden');
    projectDescriptionLink.classList.add('hidden');
    projectDescriptionPage.classList.add('hidden');
});

projectDescriptionLink.addEventListener('click', () => {
    populateProjectDescriptions();
    showView(projectDescriptionPage);
});


// Logout function
logoutButton.addEventListener('click', () => {
    loggedInUser = null;
    showView(loginForm);
    logoutButton.classList.add('hidden');
    projectDescriptionLink.classList.add('hidden');
});

// Handle navigation to project descriptions
projectDescriptionLink.addEventListener('click', () => {
    populateProjectDescriptions();
    showView(projectDescriptionPage);
});

// Updated login logic
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert('Invalid login credentials!');
        return;
    }

    loggedInUser = user;
    logoutButton.classList.remove('hidden');
    projectDescriptionLink.classList.remove('hidden');

    if (user.role === 'admin') {
        updateSubmissionsView();
        showView(adminView);
    } else {
        populateDropdown(firstPreference);
        populateDropdown(secondPreference);
        showView(projectForm);
    }
});

// Updated submission logic
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstSelection = projects[firstPreference.value].name;
    const secondSelection = projects[secondPreference.value].name;

    // Find if user already has a submission
    const existingSubmissionIndex = submissions.findIndex(sub => sub.email === loggedInUser.email);

    if (existingSubmissionIndex >= 0) {
        // Update existing submission
        const existingSubmission = submissions[existingSubmissionIndex];
        projects.find(project => project.name === existingSubmission.first).count--;
        projects.find(project => project.name === existingSubmission.second).count--;

        existingSubmission.first = firstSelection;
        existingSubmission.second = secondSelection;
        existingSubmission.timestamp = new Date().toLocaleString();
    } else {
        // Create new submission
        submissions.push({
            email: loggedInUser.email,
            name: loggedInUser.name,
            first: firstSelection,
            second: secondSelection,
            timestamp: new Date().toLocaleString()
        });
    }

    projects[firstPreference.value].count++;
    projects[secondPreference.value].count++;
    localStorage.setItem('submissions', JSON.stringify(submissions));
    populateDropdown(firstPreference);
    populateDropdown(secondPreference);

    alert('Submission updated successfully!');
});
const approvalList = document.getElementById('approvalList');
const projectAssignments = {}; // Track approved projects for each user

// Render admin approval list
function updateAdminApprovalView() {
    approvalList.innerHTML = submissions.map((submission, index) => {
        const { name, email, first, second, timestamp } = submission;
        const isApproved = !!projectAssignments[email]; // Check if a topic is already assigned

        return `
            <div class="approval-card">
                <h3>${name} (${email})</h3>
                <p><strong>First Preference:</strong> ${first}</p>
                <p><strong>Second Preference:</strong> ${second}</p>
                <p><strong>Submitted:</strong> ${timestamp}</p>
                ${isApproved
                ? `<p><strong>Approved:</strong> ${projectAssignments[email]}</p>`
                : `<div class="approval-buttons">
                          <button onclick="approveTopic('${email}', '${first}')">Approve ${first}</button>
                          <button onclick="approveTopic('${email}', '${second}')">Approve ${second}</button>
                      </div>`
            }
            </div>
        `;
    }).join('');
}

// Approve a topic for a user
function approveTopic(userEmail, topic) {
    if (Object.values(projectAssignments).includes(topic)) {
        alert(`The topic "${topic}" has already been approved for another user.`);
        return;
    }

    projectAssignments[userEmail] = topic;
    updateAdminApprovalView();
    localStorage.setItem('projectAssignments', JSON.stringify(projectAssignments));
}
const assignedProjectMessage = document.getElementById('assignedProjectMessage');

// Display assigned project for the logged-in user
function showUserAssignedProject() {
    const assignedProject = projectAssignments[loggedInUser.email];

    if (assignedProject) {
        assignedProjectMessage.innerHTML = `Your assigned project topic is <strong>${assignedProject}</strong>.`;
    } else {
        assignedProjectMessage.innerHTML = `You have not been assigned a project topic yet. Please wait for admin approval.`;
    }

    showView(userAssignedProject);
}

// Link to assigned project view (example usage)
const viewAssignedProjectLink = document.createElement('a');
viewAssignedProjectLink.textContent = 'View Assigned Project';
viewAssignedProjectLink.href = '#';
viewAssignedProjectLink.addEventListener('click', (e) => {
    e.preventDefault();
    showUserAssignedProject();
});

projectForm.appendChild(viewAssignedProjectLink);
