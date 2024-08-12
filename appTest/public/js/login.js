// resources/js/login.js
$(document).ready(function() {
    function getCsrfToken() {
        // Retrieve the CSRF token from a meta tag
        return $('meta[name="csrf-token"]').attr('content');
    }
    
    $('#login-form').on('submit', function(event) {
        event.preventDefault();

        $.ajax({
            url: '/api/login', // Replace with your login route
            type: 'POST',
            data: {
                email: $('#email').val(),
                password: $('#password').val()
            },
            headers: {
                'X-CSRF-TOKEN': getCsrfToken() // Include CSRF token if required
            },
            success: function(response) {
                if (response) {
                    // Redirect to dashboard after successful login
                    window.location.href = '/dashboard.html';
                } else {
                    alert('Login failed: ' + response.message);
                }
            },
            error: function(xhr) {
                alert('Login failed: ' + xhr.responseJSON.message);
            }
        });
    });
});
