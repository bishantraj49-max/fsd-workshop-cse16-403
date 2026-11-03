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

app.get('/api/students', (req, res) => {
  res.json(students);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find((record) => String(record.id) === req.params.id);

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  return res.json(student);
});

app.put('/api/students/:id', (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Request body must be a JSON object' });
  }

  const studentIndex = students.findIndex((record) => String(record.id) === req.params.id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const editableFields = ['name', 'email', 'course', 'age'];
  const updates = Object.fromEntries(
    editableFields
      .filter((field) => Object.hasOwn(req.body, field))
      .map((field) => [field, req.body[field]])
  );

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No student fields provided to update' });
  }

  const invalidFields = Object.entries(updates)
    .filter(([, value]) => value === null || (typeof value === 'string' && value.trim() === ''))
    .map(([field]) => field);

  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: 'Student fields cannot be empty',
      fields: invalidFields,
    });
  }

  students[studentIndex] = { ...students[studentIndex], ...updates };

  return res.json({
    message: 'Student updated successfully',
    student: students[studentIndex],
  });
});

app.delete('/api/students/:id', (req, res) => {
  const studentIndex = students.findIndex((record) => String(record.id) === req.params.id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const [student] = students.splice(studentIndex, 1);

  return res.json({
    message: 'Student deleted successfully',
    student,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});