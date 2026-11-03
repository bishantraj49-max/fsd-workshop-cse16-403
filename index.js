const express = require('express');

const app = express();
const port = 3000;
const students = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Express server is running');
});

app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

app.post('/api/students', (req, res) => {
  const requiredFields = ['id', 'name', 'email', 'course', 'age'];

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Request body must be a JSON object' });
  }

  const missingFields = requiredFields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
  });

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: 'Missing required student fields',
      fields: missingFields,
    });
  }

  if (students.some((student) => student.id === req.body.id)) {
    return res.status(409).json({ message: 'A student with this ID already exists' });
  }

  const { id, name, email, course, age } = req.body;
  const student = { id, name, email, course, age };
  students.push(student);

  return res.status(201).json({
    message: 'Student created successfully',
    student,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});