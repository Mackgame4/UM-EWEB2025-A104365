const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { defaultImports, isLoggedIn } = require('../utils.cjs');
const jszip = require('jszip');
const xml2js = require('xml2js');

/* GET home page */
router.get('/', isLoggedIn, function(req, res, _) {
    const user = req.user;
    axios.get('http://localhost:3001/journals?author=' + user._id)
        .then(response => {
            const journals = response.data;
            if (response.status !== 200) {
                throw new Error('Failed to fetch journals');
            }
            res.render('journals/journals', { title: 'My Journals', journals: journals, ...defaultImports(req) });
        })
        .catch(err => {
            console.error('Error fetching journals:', err);
        });
});

/* GET /journals/create - render create journal page */
router.get('/new', isLoggedIn, function(req, res, _) {
    const journal = {
        title: '',
        content: '',
        files: []
    };
    res.render('journals/new-journal', { title: 'New Journal', journal: journal, ...defaultImports(req) });
});

/* GET /journals/view/:id - render journal details page */
router.get('/view/:id', isLoggedIn, async (req, res) => {
    const journalId = req.params.id;
    axios.get(`http://localhost:3001/journals/${journalId}`)
        .then(response => {
            const journal = response.data;
            if (response.status !== 200) {
                throw new Error('Failed to fetch journal');
            }
            axios.get(`http://localhost:3001/files/journal/${journalId}`)
                .then(filesResponse => {
                    const files = filesResponse.data;
                    if (filesResponse.status !== 200) {
                        throw new Error('Failed to fetch journal files');
                    }
                    // Add file info (name, type, etc)
                    const journalWithFiles = {
                        ...journal,
                        files: files
                    };
                    // Increment journal views
                    axios.post(`http://localhost:3001/journals/${journalId}/incViews`)
                        .then(() => {
                            console.log('Journal views incremented successfully!');
                        })
                        .catch(err => {
                            console.error('Error incrementing journal views:', err);
                        });
                    // Render the journal view page with files
                    res.render('journals/view-journal', { title: 'View Journal', journal: journalWithFiles, ...defaultImports(req) });
                })
                .catch(err => {
                    console.error('Error fetching journal files:', err);
                    res.status(500).send('Error fetching journal files');
                });
        })
        .catch(err => {
            console.error('Error fetching journal:', err);
            res.status(500).send('Error fetching journal');
        });
});

/* GET /journals/edit/:id - render edit journal page */
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const journalId = req.params.id;
    axios.get(`http://localhost:3001/journals/${journalId}`)
        .then(response => {
            const journal = response.data;
            if (response.status !== 200) {
                throw new Error('Failed to fetch journal');
            }
            axios.get(`http://localhost:3001/files/journal/${journalId}`)
                .then(filesResponse => {
                    const files = filesResponse.data;
                    if (filesResponse.status !== 200) {
                        throw new Error('Failed to fetch journal files');
                    }
                    // Add file info (name, type, etc)
                    const journalWithFiles = {
                        ...journal,
                        files: files
                    };
                    res.render('journals/edit-journal', { title: 'Edit Journal', journal: journalWithFiles, ...defaultImports(req) });
                })
                .catch(err => {
                    console.error('Error fetching journal files for edit:', err);
                    res.status(500).send('Error fetching journal files for edit');
                });
        })
        .catch(err => {
            console.error('Error fetching journal for edit:', err);
            res.status(500).send('Error fetching journal for edit');
        });
});

function uploadFiles(files, journalId) {
    const journalFolder = `public/uploads/${journalId}`;
    // Create directory if it doesn't exist
    if (!fs.existsSync(journalFolder)) {
        fs.mkdirSync(journalFolder, { recursive: true });
    }
    files.forEach(f => {
        const newPath = `${journalFolder}/${f.originalname}`;
        const pathWithoutPrefix = newPath.replace('public/', '/'); // Remove 'public/' prefix for file path
        fs.renameSync(f.path, newPath); // Move file to the server path
        // Save file information to the database
        axios.post('http://localhost:3001/files/create', {
            name: f.originalname,
            originalname: f.originalname,
            mimetype: f.mimetype,
            date: new Date(),
            size: f.size,
            path: pathWithoutPrefix,
            isPublic: false,
            journal: journalId
        })
        .then(response => {
            const file = response.data;
            if (response.status !== 200) {
                throw new Error('Failed to save file information');
            }
            // Update the journal with the new file
            axios.put(`http://localhost:3001/journals/${journalId}`, { files: [file._id] })
                .then(() => {
                    console.log('Journal updated with new file:', file._id);
                })
                .catch(err => {
                    console.error('Error updating journal with new file:', err);
                });
        })
        .catch(err => {
            console.error('Error saving file information:', err);
            throw new Error('Error saving file information');
        });
    });
}

/* POST /journals/new-journal - create a new journal */
router.post('/new-journal', isLoggedIn, upload.array('files'), async (req, res) => {
    const user = req.user;
    const { title, content } = req.body;
    const uploadedFiles = req.files || [];
    axios.post('http://localhost:3001/journals/create', { title, content, files: [], author: user._id, authorName: user.username })
    .then(response => {
        const journal = response.data;
        if (response.status !== 200) {
            throw new Error('Failed to create journal');
        }
        // if there are uploaded files, upload them
        if (uploadedFiles.length > 0) {
            const journalId = journal._id;
            uploadFiles(uploadedFiles, journalId);
        }
        req.flash('success', 'Journal created successfully!');
        res.redirect('/journals');
    })
    .catch(err => {
        console.error('Error creating journal:', err);
        req.flash('error', 'Error creating journal.');
        res.redirect('/journals/new');
    });
});

/* POST /journals/edit-journal/:id - update a journal */
router.post('/edit-journal/:id', isLoggedIn, upload.array('files'), async (req, res) => {
    const journalId = req.params.id;
    const { title, content } = req.body;
    const uploadedFiles = req.files || [];
    axios.put(`http://localhost:3001/journals/${journalId}`, { title, content, updatedAt: new Date(), authorName: req.user.username })
    .then(response => {
        if (response.status !== 200) {
            throw new Error('Failed to update journal');
        }
        // if there are uploaded files, upload them
        if (uploadedFiles.length > 0) {
            uploadFiles(uploadedFiles, journalId);
        }
        req.flash('success', 'Journal updated successfully!');
        res.redirect(`/journals/edit/${journalId}`);
    })
    .catch(err => {
        console.error('Error updating journal:', err);
        req.flash('error', 'Error updating journal.');
        res.redirect(`/journals/edit/${journalId}`);
    });
});

/* POST /journals/delete-journal/:id - delete a journal by ID */
router.post('/delete-journal/:id', isLoggedIn, async (req, res) => {
    axios.delete(`http://localhost:3001/journals/${req.params.id}`)
    .then(response => {
        if (response.status !== 200) {
            throw new Error('Failed to delete journal');
        }
        req.flash('success', 'Journal deleted successfully!');
        res.redirect('/journals');
    })
    .catch(err => {
        console.error('Error deleting journal:', err);
        req.flash('error', 'Error deleting journal.');
        res.redirect('/journals');
    });
});

/* POST /journals/delete-file/:id - delete a file from a journal */
router.post('/delete-file/:id', isLoggedIn, async (req, res) => {
    axios.delete(`http://localhost:3001/files/${req.params.id}`)
    .then(response => {
        const file = response.data.file;
        if (response.status !== 200) {
            throw new Error('Failed to delete file');
        }
        const journalId = file.journal;
        // Remove the file from the journal's files array
        axios.put(`http://localhost:3001/journals/${journalId}`, { $pull: { files: req.params.id } })
            .then(() => {
                // Remove the file from the server
                const filePath = `public${file.path}`;
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                req.flash('success', 'File deleted successfully!');
                res.redirect(`/journals/edit/${journalId}`);
            })
            .catch(err => {
                console.error('Error updating journal after file deletion:', err);
                req.flash('error', 'Error updating journal after file deletion.');
                res.redirect(`/journals/edit/${journalId}`);
            });
    })
    .catch(err => {
        console.error('Error deleting file:', err);
        req.flash('error', 'Error deleting file.');
        res.redirect(`/journals/edit/${req.body.journalId}`);
    });
});

/* POST /journals/toggle-file-visibility/:id - toggle file visibility */
router.post('/toggle-file-visibility/:id', isLoggedIn, async (req, res) => {
    axios.post(`http://localhost:3001/files/${req.params.id}/toggle-visibility`)
    .then(response => {
        if (response.status !== 200) {
            throw new Error('Failed to toggle file visibility');
        }
        const journalId = response.data.journal;
        req.flash('success', 'File visibility updated successfully!');
        res.redirect(`/journals/edit/${journalId}`);
    })
    .catch(err => {
        console.error('Error toggling file visibility:', err);
        req.flash('error', 'Error toggling file visibility.');
        res.redirect(`/journals/edit/${req.body.journalId}`);
    });
});

/* GET /journals/export/:id - export a journal */
router.get('/export/:id', isLoggedIn, async (req, res) => {
    const journalId = req.params.id;
    console.log('Exporting journal with ID:', journalId);
    axios.get(`http://localhost:3001/journals/${journalId}`)
    .then(response => {
        const journal = response.data;
        if (response.status !== 200) {
            throw new Error('Failed to fetch journal for export');
        }
        // Create a ZIP file
        const zip = new jszip();
        //zip.file('journal.json', JSON.stringify(journal, null, 2));
        
        // Add files to the ZIP
        axios.get(`http://localhost:3001/files/journal/${journalId}`)
            .then(filesResponse => {
                const files = filesResponse.data;
                if (filesResponse.status !== 200) {
                    throw new Error('Failed to fetch journal files for export');
                }
                files.forEach(file => {
                    const filePath = `public${file.path}`;
                    if (fs.existsSync(filePath)) {
                        zip.file(file.originalname, fs.readFileSync(filePath));
                    }
                });
                // Add content.md file
                const contentMd = `# ${journal.title}\n\n${journal.content}`;
                zip.file('content.md', contentMd);
                // Add metadata.xml file
                const metadata = {
                    journalId: journal._id,
                    title: journal.title,
                    files: files.map(f => ({
                        id: f._id,
                        name: f.originalname,
                        type: f.mimetype,
                        size: f.size,
                        date: f.date
                    })),
                    views: journal.views || 0,
                    downloads: journal.downloads || 0,
                    authorName: journal.authorName,
                    createdAt: journal.createdAt,
                    updatedAt: journal.updatedAt
                };
                const builder = new xml2js.Builder();
                const xml = builder.buildObject({ journal: metadata });
                zip.file('manifesto-SIP.xml', xml);
                // Generate the ZIP file
                zip.generateAsync({ type: 'nodebuffer' })
                    .then(content => {
                        res.setHeader('Content-Disposition', `attachment; filename=journal-${journalId}.zip`);
                        res.setHeader('Content-Type', 'application/zip');
                        res.send(content);
                    })
                    .catch(err => {
                        console.error('Error generating ZIP file:', err);
                        res.status(500).send('Error generating ZIP file');
                    });
                // Increment journal downloads
                axios.post(`http://localhost:3001/journals/${journalId}/incDownloads`)
                    .then(() => {
                        console.log('Journal downloads incremented successfully!');
                    })
                    .catch(err => {
                        console.error('Error incrementing journal downloads:', err);
                    });
            })
            .catch(err => {
                console.error('Error fetching journal files for export:', err);
                res.status(500).send('Error fetching journal files for export');
            });
    })
});

module.exports = router;