// Smooth scrolling for navigation links
$('a[href^="#"]').on('click', function (event) {
    event.preventDefault();

    var target = $(this.getAttribute('href'));

    if (target.length) {
        $('html, body').stop().animate({
            scrollTop: target.offset().top
        }, 1000);
    }
});

// Function to save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to load data from localStorage
function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Function to initialize the page with saved data
function initializePage() {
    // Load resume data
    const resumeData = loadData('resumeData');
    if (resumeData) {
        document.getElementById('resumeDisplay').innerHTML = resumeData;
    }

    // Load portfolio projects
    const projects = loadData('portfolioProjects');
    if (projects) {
        const projectsList = document.getElementById('projectsList');
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.innerHTML = `<h4>${project.name}</h4>
                                     <p><strong>Link:</strong> <a href="${project.link}" target="_blank">${project.link}</a></p>
                                     <p><strong>Description:</strong> ${project.description}</p>`;
            projectsList.appendChild(projectItem);
        });
    }
}

// Add these functions to your script.js
function uploadResume() {
    const fileInput = document.getElementById('resumeFile');
    const displayArea = document.getElementById('resumeDisplay');

    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            displayArea.innerHTML = `<embed src="${e.target.result}" width="100%" height="600px" type="application/pdf">`;
            // Save resume data when uploading
            saveData('resumeData', displayArea.innerHTML);
        };

        reader.readAsDataURL(file);
    }
}

// Add these lines to save data when changes occur
function submitProject() {
    const projectName = document.getElementById('projectName').value;
    const projectLink = document.getElementById('projectLink').value;
    const projectDescription = document.getElementById('projectDescription').value;

    const projectsList = document.getElementById('projectsList');

    const projectItem = document.createElement('div');
    projectItem.innerHTML = `<h4>${projectName}</h4>
                             <p><strong>Link:</strong> <a href="${projectLink}" target="_blank">${projectLink}</a></p>
                             <p><strong>Description:</strong> ${projectDescription}</p>`;

    projectsList.appendChild(projectItem);

    // Save portfolio projects
    const projects = loadData('portfolioProjects') || [];
    projects.push({ name: projectName, link: projectLink, description: projectDescription });
    saveData('portfolioProjects', projects);

    // Clear the form after submission
    document.getElementById('portfolioForm').reset();
}

// Add these functions to your script.js
function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.querySelector('.content').innerHTML = html;
        })
        .catch(error => console.error('Error fetching content:', error));
}

// Initial load - you can choose which section to display by default
loadContent('about.html');

// Update the content dynamically based on the clicked link
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const targetPage = this.getAttribute('href');
        loadContent(targetPage);
    });
});

// Initialize the page with saved data
initializePage();

$(document).ready(function () {
    // ... (your existing code)

    // Add an event listener to the contact form for submission
    $('#contact form').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val()
        };

        // Validate form data (you can add your own validation logic)

        // Send form data to the server using AJAX
        $.ajax({
            type: 'POST',
            url: 'process-contact.php', // Adjust the URL to your server-side script
            data: formData,
            success: function (response) {
                // Handle the server's response (e.g., show a success message)
                console.log(response);
            },
            error: function (error) {
                // Handle errors (e.g., show an error message)
                console.error('Error submitting form:', error);
            }
        });
    });
});

$(document).ready(function () {
    $('#contactForm').submit(function (event) {
        event.preventDefault();

        // Get form data
        const formData = $(this).serialize();

        // Submit form data using AJAX
        $.ajax({
            type: 'POST',
            url: 'process-contact.php', // Adjust the URL to your server-side script
            data: formData,
            success: function (response) {
                // Display confirmation message
                $('#confirmationMessage').show();

                // Optionally, clear the form fields
                $('#contactForm')[0].reset();
            },
            error: function (error) {
                console.error('Error submitting form:', error);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Load existing comments from localStorage on page load
    loadComments();

    // Post comment when the form is submitted
    document.getElementById('postCommentForm').addEventListener('submit', function (event) {
        event.preventDefault();
        postComment();
    });
});

function postComment() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const commentText = document.getElementById('comment').value;

    if (name.trim() === '' || email.trim() === '' || commentText.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }

    const comment = {
        name: name,
        email: email,
        text: commentText,
        timestamp: new Date().toLocaleString()
    };

    // Save the comment to localStorage
    saveComment(comment);

    // Update the displayed comments
    loadComments();

    // Clear the input fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('comment').value = '';
}

function saveComment(comment) {
    // Retrieve existing comments from localStorage
    const existingComments = JSON.parse(localStorage.getItem('comments')) || [];

    // Add the new comment to the array
    existingComments.push(comment);

    // Save the updated array back to localStorage
    localStorage.setItem('comments', JSON.stringify(existingComments));
}

function loadComments() {
    // Retrieve existing comments from localStorage
    const existingComments = JSON.parse(localStorage.getItem('comments')) || [];

    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = ''; // Clear existing comments

    // Display each comment
    existingComments.forEach(function (comment) {
        const commentItem = document.createElement('div');
        commentItem.innerHTML = `<p><strong>${comment.name}</strong> (${comment.email})</p>
                                <p>${comment.text}</p>
                                <small>${comment.timestamp}</small>`;
        commentsList.appendChild(commentItem);
    });
}
