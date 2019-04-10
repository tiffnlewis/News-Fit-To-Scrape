const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    link: {
        type: String,
        unique: true
    },
    byline: String,
    img: String,
    author: String,
    source: String,
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
})

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;