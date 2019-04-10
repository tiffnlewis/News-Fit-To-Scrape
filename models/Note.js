const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    body: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Note = mongoose.model("Note", NoteSchema)

module.exports = Note