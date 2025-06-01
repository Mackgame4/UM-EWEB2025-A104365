const Journal = require('../models/journal.cjs');

module.exports.findAll = async () => {
    return await Journal.find()
        .then(journals => {
            return journals;
        })
        .catch(err => {
            console.error('Error finding users:', err);
            throw err;
        });
};

module.exports.findById = async (id) => {
    return await Journal.findById(id)
        .then(journal => {
            if (!journal) {
                throw new Error('Journal not found');
            }
            return journal;
        })
        .catch(err => {
            console.error('Error finding journal by ID:', err);
            throw err;
        });
}

module.exports.save = async (journal) => {
    const journalDb = new Journal(journal);
    return await journalDb.save()
        .then(() => {
            console.log('Journal saved successfully!');
            return journalDb;
        })
        .catch(err => {
            console.error('Error saving journal:', err);
            throw err;
        });
}

module.exports.update = async (id, journal) => {
    return await Journal.findByIdAndUpdate(id, journal, { new: true })
        .then(updatedJournal => {
            if (!updatedJournal) {
                throw new Error('Journal not found for update');
            }
            console.log('Journal updated successfully!');
            return updatedJournal;
        })
        .catch(err => {
            console.error('Error updating journal:', err);
            throw err;
        });
}

module.exports.delete = async (id) => {
    return await Journal.findByIdAndDelete(id)
        .then(deletedJournal => {
            if (!deletedJournal) {
                throw new Error('Journal not found for deletion');
            }
            console.log('Journal deleted successfully!');
            return deletedJournal;
        })
        .catch(err => {
            console.error('Error deleting journal:', err);
            throw err;
        });
}

module.exports.findAllByUserId = async (userId) => {
    return await Journal.find({ author: userId })
        .then(journals => {
            return journals;
        })
        .catch(err => {
            console.error('Error finding journals by user ID:', err);
            throw err;
        });
}

module.exports.deleteFile = async (journalId, fileId) => {
    return await Journal.findByIdAndUpdate(journalId, { $pull: { files: fileId } }, { new: true })
        .then(updatedJournal => {
            if (!updatedJournal) {
                throw new Error('Journal not found for file deletion');
            }
            console.log('File deleted from journal successfully!');
            return updatedJournal;
        })
        .catch(err => {
            console.error('Error deleting file from journal:', err);
            throw err;
        });
}

module.exports.incrementViews = async (id) => {
    return await Journal.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
        .then(updatedJournal => {
            if (!updatedJournal) {
                throw new Error('Journal not found for view increment');
            }
            console.log('Journal views incremented successfully!');
            return updatedJournal;
        })
        .catch(err => {
            console.error('Error incrementing journal views:', err);
            throw err;
        });
}

module.exports.incrementDownloads = async (id) => {
    return await Journal.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true })
        .then(updatedJournal => {
            if (!updatedJournal) {
                throw new Error('Journal not found for download increment');
            }
            console.log('Journal downloads incremented successfully!');
            return updatedJournal;
        })
        .catch(err => {
            console.error('Error incrementing journal downloads:', err);
            throw err;
        });
}