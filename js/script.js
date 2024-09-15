// Handle login form submission
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent form refresh
    
    let username = document.querySelector('input[type="text"]').value;
    let password = document.querySelector('input[type="password"]').value;
    
    // Call the Apps Script function for login
    google.script.run.withSuccessHandler(function(response) {
        if (response.success) {
            // Redirect based on user role
            if (response.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else if (response.role === 'supervisor') {
                window.location.href = 'supervisor-dashboard.html';
            }
        } else {
            alert('Invalid login credentials.');
        }
    }).login(username, password);
});

// Handle report upload (for admin dashboard)
document.getElementById('upload-btn').addEventListener('click', function() {
    let date = document.getElementById('date').value;
    let file = document.getElementById('file-upload').files[0];
    
    if (date && file) {
        // Convert file to Base64 for uploading
        let reader = new FileReader();
        reader.onload = function(event) {
            let base64File = event.target.result;
            google.script.run.uploadReport(date, base64File);
            alert('Report uploaded successfully.');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a date and file.');
    }
});

// Fetch report for supervisor dashboard
document.getElementById('show-report-btn').addEventListener('click', function() {
    let date = document.getElementById('report-date').value;
    
    google.script.run.withSuccessHandler(function(reports) {
        let tableBody = document.querySelector('.report-table tbody');
        tableBody.innerHTML = '';  // Clear existing rows
        
        reports.forEach(function(report) {
            let row = `<tr>
                <td>${report.date}</td>
                <td><a href="${report.fileUrl}" target="_blank">View Report</a></td>
                <td>${report.comment}</td>
                <td>${report.status}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }).fetchReports(date);
});
