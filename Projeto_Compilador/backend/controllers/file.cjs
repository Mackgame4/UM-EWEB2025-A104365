var File = require('../models/file.cjs');

module.exports.findAll = async () => {
    try {
        const files = await File.find().exec();
        return files;
    } catch (err) {
        console.error('Error finding files:', err);
        throw err;
    }
}

module.exports.save = async (file) => {
    const fileDb = new File({
        name: file.originalname,
        originalname: file.originalname,
        date: new Date(),
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
        journal: file.journal,
        isPublic: file.isPublic || false
    });
    return await fileDb.save()
        .then(() => {
            console.log('File saved successfully!');
            return fileDb;
        })
        .catch(err => {
            console.error('Error saving journal:', err);
            throw err;
        });
}

module.exports.findByJournalId = async (journalId) => {
    try {
        const files = await File.find({ journal: journalId }).exec();
        return files;
    }
    catch (err) {
        console.error('Error finding files by journal ID:', err);
        throw err;
    }
}

module.exports.findById = async (id) => {
    try {
        const file = await File.find({ _id: id }).exec();
        if (file.length === 0) {
            return null; // No file found
        }
        return file[0]; // Return the first file found
    }
    catch (err) {
        console.error('Error finding file by ID:', err);
        throw err;
    }
}

module.exports.delete = async (id) => {
    return await File.findByIdAndDelete(id)
        .then(deletedFile => {
            if (!deletedFile) {
                throw new Error('File not found for deletion');
            }
            console.log('File deleted successfully!');
            return deletedFile;
        })
        .catch(err => {
            console.error('Error deleting file:', err);
            throw err;
        });
}

module.exports.update = async (id, updateData) => {
    try {
        const file = await File.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!file) {
            throw new Error('File not found');
        }
        console.log('File updated successfully!');
        return file;
    }
    catch (err) {
        console.error('Error updating file:', err);
        throw err;
    }
}