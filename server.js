const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5004;
const notesFile = process.env.NOTES_PATH || path.join(__dirname, 'notes.json');

app.use(express.json());

// Get all notes
app.get('/api/notes', (req, res) => {
  try {
    const notes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
    res.json(notes);
  } catch (err) {
    res.json([]); // Return empty array if file doesn't exist
  }
});

// Add a new note
app.post('/api/notes', (req, res) => {
  try {
    let notes = [];
    if (fs.existsSync(notesFile)) {
      notes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
    }
    const newNote = {
      id: notes.length + 1,
      content: req.body.content,
    };
    notes.push(newNote);
    fs.writeFileSync(notesFile, JSON.stringify(notes));
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Serve the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});