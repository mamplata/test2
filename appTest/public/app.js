$(document).ready(function() {
    // Function to show the dashboard
    function showDashboard(userEmail) {
        $('.login').hide();
        $('#userEmail').text(userEmail);
        $('.dashboard').show();
    }

    // Function to show the login form
    function showLogin() {
        $('.dashboard').hide();
        $('.login').show();
    }

    // Check if the user is already logged in
    function checkAuthentication() {
        $.ajax({
            url: '/api/check-token',
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
                showDashboard(response.email);
            },
            error: function() {
                showLogin();
            }
        });
    }

    // Handle the login button click
    $('#loginButton').on('click', function() {
        const email = $('#email').val();
        const password = $('#password').val();

        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: {
                email: email,
                password: password
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(response) {
                showDashboard(response.email);
            },
            error: function(xhr) {
                alert('Login failed: ' + xhr.responseJSON.message);
            }
        });
    });

    // Handle the logout button click
    $('#logoutButton').on('click', function() {
        $.ajax({
            url: '/api/logout',
            type: 'POST',
            xhrFields: {
                withCredentials: true
            },
            success: function() {
                showLogin();
            },
            error: function(xhr) {
                alert('Logout failed: ' + xhr.responseJSON.message);
            }
        });
    });

    // Check authentication status on page load
    checkAuthentication();
});
