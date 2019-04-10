const request = require("request")
const cheerio = require("cheerio");
const db = require("./models")
const mongoose = require("mongoose")

module.exports = function(app){


app.get('/user/:username', (req, res) => {
    db.User.createUnique({username: req.params.username})
    .then(dbUser => {
        res.json(dbUser)
    })
})

app.post('/favorite', (req, res) => {
    console.log(req.body)
    if(req.body.delete === 'true'){
        db.User.findByIdAndUpdate(req.body.userId, { $pull: { articles: req.body.articleId }}, {new: true})
        .then(dbUser => res.json(dbUser))
    } else {
    db.User.findByIdAndUpdate(req.body.userId, { $push: { articles: req.body.articleId }}, {new: true})
    .then(dbUser => res.json(dbUser))
    }
})


app.get('/favorites/:userId', (req, res) => {
    db.User.findById(req.params.userId)
    .then(dbUser => {

       db.Article.find({
          '_id': {$in: dbUser.articles}
        }).then(dbArticles => {

            res.render("favorites", {articles: dbArticles})

        })

    })

})

app.get('/comments/:articleId', (req, res) => {
    console.log(req.params.articleId)
    db.Article.findById(req.params.articleId)
    .populate('notes')
    .then(dbArticle => {
      //  console.log(dbArticle)
        res.json(dbArticle)
    })
})

app.post('/comments/:articleId', (req, res) => {
    console.log(req.params.articleId)
    db.Note.create({
        body: req.body.comment,
        user: req.body.user
    })
    .then(dbNote => {
        db.Article.findByIdAndUpdate(req.params.articleId, {$push: {notes: dbNote._id}}, {new: true})
        .then(res.json(dbNote))
        
    })
    
})

app.delete('/comments:commentId', (req, res) => {
    let commentId = req.params.commentId
    let articleId = req.body.articleId
    db.Note.deleteOne({_id: commentId})
    .then(result => {
        console.log(result)
        db.Article.findById(articleId).populate('notes')
        .then(dbArticle => {
            res.json(dbArticle)
        })
    })
})

app.get('/', function(req, res){
   // const results = [];
    const reason = [];
    const nation = [];
    const natReview = [];
    const resultsObj = {}
    request("https://www.reason.com", (error, response, html) => {
        let $ = cheerio.load(html)
        const post = $('#new_posts').find('li.post')
          post.each(function(i, element){
            let link = $(element).children().attr("href")
            let title = $(element).children("h3").text()
            let byline = $(element).children("h4").text()
            let img = $(element).find("img.thumbnail").attr("src")
            let author = $(element).find("span.author").children("a").text()
            let article = {
                title: title,
                byline: byline,
                link: link,
                img: img,
                author: author,
                source: "Reason"
            }
          reason.push(article)

        });

        request("https://www.thenation.com/subject/politics/", (error, response, html) => {
            
            let $ = cheerio.load(html)
            $('li.results__item').each(function(i, element){
                let title = $(element).find('h3').text()
                let link = $(element).find('h3').children().attr("href")
                let byline = $(element).find('h4').text()
                let img = $(element).find('img').attr("src")
                let author = $(element).find('h5').text()
                let article = {
                    title: title,
                    link: link,
                    byline: byline,
                    img: img,
                    author: author,
                    source: "The Nation"
                }

            nation.push(article)

            });


            request("https://www.nationalreview.com/news/", (error, response, html) => {
                let $ = cheerio.load(html)
                $('article').each(function(i, element){
                    let title = $(element).find('h4.post-list-article__title').text()
                    let link = $(element).find('h4.post-list-article__title').children().attr("href")
                    let byline = $(element).find('div.post-list-article__entry').text()
                    let img = $(element).find('img').attr("src")
                    let author = $(element).find('a.author').text()
                    let article = {
                        title: title,
                        link: link,
                        byline: byline,
                        img: img,
                        author: author,
                        source: "National Review"
                    }

                  natReview.push(article)

                })

                db.Article.createUnique(reason)

                .then(reasonArticles => {
                   resultsObj.reason = reasonArticles
                    return db.Article.createUnique(nation)
                })

                .then(nationArticles => {
                    resultsObj.nation = nationArticles
                    return db.Article.createUnique(natReview)
                })

                .then(natReviewArticles => {
                    resultsObj.natReview = natReviewArticles
                    res.render("index", resultsObj)
                })
                
            })
            
        })
        
    })
})

}