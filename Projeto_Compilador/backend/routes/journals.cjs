const express = require('express');
const router = express.Router();
const journalsController = require('../controllers/journal.cjs');

router.get('/', (req, res) => {
    /* GET /journals?author=userID - return a list of journals of a specific user */
    const userId = req.query.author;
    if (userId) {
        journalsController.findAllByUserId(userId)
            .then(journals => {
                res.status(200).json(journals);
            })
            .catch(err => {
                console.error('Error fetching journals by user:', err);
                res.status(500).json({ message: 'Error fetching journals by user.', error: err });
            });
        return;
    } else {
        /* GET /journals - return a list of journals */
        journalsController.findAll()
            .then(journals => {
                res.status(200).json(journals);
            })
            .catch(err => {
                console.error('Error fetching journals:', err);
                res.status(500).json({ message: 'Error fetching journals.', error: err });
            });
    }
});

/* GET /journals/:id - return a journal by ID */
router.get('/:id', (req, res) => {
    const journalId = req.params.id;
    journalsController.findById(journalId)
        .then(journal => {
            if (!journal) {
                return res.status(201).json({ message: 'Journal not found.' });
            }
            res.status(200).json(journal);
        })
        .catch(err => {
            console.error('Error fetching journal by ID:', err);
            res.status(500).json({ message: 'Error fetching journal by ID.', error: err });
        });
});

/* POST /journals/create - create a new journal */
router.post('/create', (req, res) => {
    const { title, content, files, author, authorName, createdAt, updatedAt } = req.body;
    journalsController.save({
        title: title || 'Untitled Journal',
        content: content || '',
        files: files || [],
        author,
        authorName,
        createdAt: createdAt || new Date(),
        updatedAt: updatedAt || new Date()
    })
        .then(journal => {
            res.status(200).json(journal);
        })
        .catch(err => {
            console.error('Error creating journal:', err);
            res.status(500).json({ message: 'Error creating journal.', error: err });
        });
});

/* DELETE /journals/:id - delete a journal by ID */
router.delete('/:id', (req, res) => {
    const journalId = req.params.id;
    journalsController.delete(journalId)
        .then(deleted => {
            if (!deleted) {
                return res.status(404).json({ message: 'Journal not found.' });
            }
            res.status(200).json({ message: 'Journal deleted successfully.' });
        })
        .catch(err => {
            console.error('Error deleting journal:', err);
            res.status(500).json({ message: 'Error deleting journal.', error: err });
        });
});

/* PUT /journals/:id - update a journal by ID */
router.put('/:id', (req, res) => {
    const journalId = req.params.id;
    const updateData = {};
    // Only add fields that are actually provided
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.content !== undefined) updateData.content = req.body.content;
    if (req.body.files !== undefined) updateData.files = req.body.files;
    if (req.body.updatedAt !== undefined) updateData.updatedAt = req.body.updatedAt || new Date();
    if (req.body.authorName !== undefined) updateData.authorName = req.body.authorName;
    journalsController.update(journalId, updateData)
        .then(journal => {
            if (!journal) {
                return res.status(404).json({ message: 'Journal not found.' });
            }
            res.status(200).json(journal);
        })
        .catch(err => {
            console.error('Error updating journal:', err);
            res.status(500).json({ message: 'Error updating journal.', error: err });
        });
});

/* POST /journals/:id/incViews - increment view count for a journal */
router.post('/:id/incViews', (req, res) => {
    const journalId = req.params.id;
    journalsController.incrementViews(journalId)
        .then(journal => {
            if (!journal) {
                return res.status(404).json({ message: 'Journal not found.' });
            }
            res.status(200).json(journal);
        })
        .catch(err => {
            console.error('Error incrementing view count:', err);
            res.status(500).json({ message: 'Error incrementing view count.', error: err });
        });
});

/* POST /journals/:id/incDownloads - increment download count for a journal */
router.post('/:id/incDownloads', (req, res) => {
    const journalId = req.params.id;
    journalsController.incrementDownloads(journalId)
        .then(journal => {
            if (!journal) {
                return res.status(404).json({ message: 'Journal not found.' });
            }
            res.status(200).json(journal);
        })
        .catch(err => {
            console.error('Error incrementing download count:', err);
            res.status(500).json({ message: 'Error incrementing download count.', error: err });
        });
});

module.exports = router;
