const express = require('express');

const app = express();

app.set('view engine', 'ejs');

const students = [
    { id: 1, name: 'Aarav', branch: 'CSE' },
    { id: 2, name: 'Diya', branch: 'ECE' },
    { id: 3, name: 'Rohan', branch: 'IT' },
    { id: 4, name: 'Karan', branch: 'CSE' }
];

// Task 1 - Student List
app.get('/', (req, res) => {
    res.render('students', { students });
});

// Task 2 - About Page
app.get('/about', (req, res) => {
    res.render('about', {
        courseName: 'Backend Development',
        lecturerName: 'Dr. Prateek Raj Gautam'
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});