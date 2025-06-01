const express = require('express');
const router = express.Router();
const filesController = require('../controllers/file.cjs');

/* GET /files - return a list of files */
router.get('/', function(req, res, next) {
  filesController.findAll()
    .then(files => {
      res.status(200).json(files);
    })
    .catch(err => {
      console.error('Error fetching files:', err);
      res.status(500).json({ message: 'Error fetching files.', error: err });
    });
});

/* GET /files/:id - return a file by ID */
router.get('/:id', (req, res) => {
  const fileId = req.params.id;
  filesController.findById(fileId)
    .then(file => {
      if (!file) {
        return res.status(404).json({ message: 'File not found.' });
      }
      res.status(200).json(file);
    })
    .catch(err => {
      console.error('Error fetching file by ID:', err);
      res.status(500).json({ message: 'Error fetching file by ID.', error: err });
    });
});

/* GET /files/journal/:id - return files associated with a journal by journal ID */
router.get('/journal/:id', (req, res) => {
  const journalId = req.params.id;
  filesController.findByJournalId(journalId)
    .then(files => {
      res.status(200).json(files);
    })
    .catch(err => {
      console.error('Error fetching files by journal ID:', err);
      res.status(500).json({ message: 'Error fetching files by journal ID.', error: err });
    });
});

/* POST /files/create - create a new file */
router.post('/create', (req, res) => {
  const { name, originalname, mimetype, date, size, path, isPublic, journal } = req.body;
  filesController.save({
    name,
    originalname,
    mimetype,
    date: date || new Date(),
    size,
    path,
    isPublic: isPublic || false,
    journal
  })
    .then(file => {
      res.status(200).json(file);
    })
    .catch(err => {
      console.error('Error creating file:', err);
      res.status(500).json({ message: 'Error creating file.', error: err });
    });
});

/* DELETE /files/:id - delete a file by ID */
router.delete('/:id', (req, res) => {
  const fileId = req.params.id;
  filesController.delete(fileId)
    .then(deleted => {
      if (!deleted) {
        return res.status(404).json({ message: 'File not found.' });
      }
      res.status(200).json({ message: 'File deleted successfully.', file: deleted });
    })
    .catch(err => {
      console.error('Error deleting file:', err);
      res.status(500).json({ message: 'Error deleting file.', error: err });
    });
});

/* PUT /files/:id - update a file by ID */
router.put('/:id', (req, res) => {
  const fileId = req.params.id;
  const updateData = {};
  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.isPublic !== undefined) updateData.isPublic = req.body.isPublic;
  filesController.update(fileId, updateData)
    .then(file => {
      if (!file) {
        return res.status(404).json({ message: 'File not found.' });
      }
      res.status(200).json(file);
    })
    .catch(err => {
      console.error('Error updating file:', err);
      res.status(500).json({ message: 'Error updating file.', error: err });
    });
});

/* POST /files/:id/toggle-visibility - toggle file visibility by ID */
router.post('/:id/toggle-visibility', (req, res) => {
  const fileId = req.params.id;
  filesController.findById(fileId)
    .then(file => {
      if (!file) {
        return res.status(404).json({ message: 'File not found.' });
      }
      const updatedVisibility = !file.isPublic;
      return filesController.update(fileId, { isPublic: updatedVisibility })
        .then(updatedFile => {
          res.status(200).json({ message: 'File visibility updated successfully.', journal: updatedFile.journal, isPublic: updatedFile.isPublic });
        });
    })
    .catch(err => {
      console.error('Error toggling file visibility:', err);
      res.status(500).json({ message: 'Error toggling file visibility.', error: err });
    });
});

module.exports = router;
