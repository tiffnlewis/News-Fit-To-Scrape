const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    articles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Article"
        }
    ],
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});

const User = mongoose.model("User", UserSchema);
module.exports = User;