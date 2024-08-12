$(document).ready(function() {
    let bearerToken;
    let userId;

    // Function to request the CSRF cookie
    function requestCsrfCookie() {
        return $.ajax({
            url: '/api/csrf-cookie',
            type: 'GET',
            xhrFields: {
                withCredentials: true // Ensure cookies are sent with the request
            }
        });
    }

    // Function to check token validity
    function checkToken() {
        return $.ajax({
            url: '/api/check-token',
            type: 'GET',
            xhrFields: {
                withCredentials: true, // Ensure cookies are sent with the request
            },
            headers: {
                'X-CSRF-TOKEN': getCsrfToken() // Include CSRF token if required
            }
        }).done(function(response) {
            console.log('Response:', response.message);
            bearerToken = response.token;
            userId = response.userId;
            getUserName(); // Fetch the user name
            Tasks(); // Fetch tasks
        }).fail(function(xhr) {
            const errorResponse = xhr.responseJSON;
            console.error('Error:', errorResponse.message);
            if (errorResponse.token) {
                console.error('Token:', errorResponse.token);
            }
            window.location.href = '/index.html';
        });
    }

    // Function to get CSRF token from a meta tag
    function getCsrfToken() {
        return $('meta[name="csrf-token"]').attr('content');
    }

    // Function to get tasks
    function Tasks() {
        $.ajax({
            url: '/api/tasks',
            type: 'GET',
            xhrFields: {
                withCredentials: true, // Ensure cookies are sent with the request
            },
            headers: {
                'Authorization': 'Bearer ' + bearerToken, 
                'X-CSRF-TOKEN': getCsrfToken() // Include CSRF token if required
            },
            success: function(response) {
                console.log('Response:', response.message);
            },
            error: function(xhr) {
                const errorResponse = xhr.responseJSON;
                console.error('Error:', errorResponse.message);
                if (errorResponse.token) {
                    console.error('Token:', errorResponse.token);
                }
            }
        });
    }

    // Function to get username based on userId
    function getUserName() {
        $.ajax({
            url: '/api/user/' + userId, // Fetch user by ID
            type: 'GET',
            xhrFields: {
                withCredentials: true, // Ensure cookies are sent with the request
            },
            headers: {
                'Authorization': 'Bearer ' + bearerToken,
                'X-CSRF-TOKEN': getCsrfToken() // Include CSRF token if required
            },
            success: function(response) {
                console.log('User:', response.user);
                $('#username').text(response.user.name); // Set username to HTML element
            },
            error: function(xhr) {
                const errorResponse = xhr.responseJSON;
                console.error('Error:', errorResponse.message);
                if (errorResponse.token) {
                    console.error('Token:', errorResponse.token);
                }
            }
        });
    }

    // Logout button click event
    $('#logout-button').on('click', function() {
        $.ajax({
            url: '/api/logout', // Route to handle logout
            type: 'POST',
            xhrFields: {
                withCredentials: true, // Ensure cookies are sent with the request
            },
            headers: {
                'Authorization': 'Bearer ' + bearerToken, 
                'X-CSRF-TOKEN': getCsrfToken() // Include CSRF token if required
            },
            success: function(response) {
                if (response.success) {
                    alert('You have been logged out.');
                    window.location.href = '/index.html'; // Redirect to login page
                } else {
                    alert('Logout failed: ' + response.message);
                }
            },
            error: function(xhr) {
                alert('Logout failed: ' + xhr.responseJSON.message);
            }
        });
    });

    // Chain the requests
    requestCsrfCookie().done(function() {
        return checkToken();
    }).done(function() {
       // Run the Tasks function only after the token has been checked
    });
});
