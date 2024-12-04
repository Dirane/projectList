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

// Populate project descriptions
function populateProjectDescriptions() {
    projectList.innerHTML = Object.entries(projectDescriptions)
        .map(([project, description]) => `<li><strong>${project}</strong>: ${description}</li>`)
        .join('');
}

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
