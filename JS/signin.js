document.addEventListener('DOMContentLoaded', () => {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    function signUp() {
        const username = document.querySelector('.sign-up input[placeholder="Username"]').value;
        const psNo = document.querySelector('.sign-up input[placeholder="PS NO"]').value;
        const email = document.querySelector('.sign-up input[placeholder="Email"]').value;
        const password = document.querySelector('.sign-up input[placeholder="Password"]').value;
        const confirmPassword = document.querySelector('.sign-up input[placeholder="Confirm password"]').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const user = { username, psNo, email, password };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Sign-up successful!');
        window.location.href = 'index.html';
    }

    function signIn() {
        const username = document.querySelector('.sign-in input[placeholder="Username"]').value;
        const password = document.querySelector('.sign-in input[placeholder="Password"]').value;

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            alert('Sign-in successful!');
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials!');
        }
    }

    function forgotPassword() {
        const email = prompt('Please enter your registered email:');
        const user = users.find(user => user.email === email);

        if (user) {
            const newPassword = prompt('Enter your new password:');
            user.password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Password reset successful!');
        } else {
            alert('No user found with this email!');
        }
    }

    document.querySelector('.sign-up button').addEventListener('click', signUp);
    document.querySelector('.sign-in button').addEventListener('click', signIn);
    document.querySelector('.pointer').addEventListener('click', forgotPassword);

    setTimeout(() => {
        document.getElementById('container').classList.add('sign-in');
    }, 200);
});
