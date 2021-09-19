
import express from "express";
import mongoose from "mongoose";

// Setting up server

const app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// Setting up Database

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
const articleSchema = {
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
};
const Article = mongoose.model("article",articleSchema);





// Handling http request verbs on path articles

app.route("/articles")

.get((req, res)=>{
    Article.find((err,found)=>{
        if(err){
            res.send(err);
        }else{
            res.send(found);
        }
    });
})
.post((req, res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err)=>{
        if(err){
            res.send(err);
        }else{
            res.send("Successfully added a new article.");
        }
    });
})
.delete((req, res)=>{
    Article.deleteMany((err)=>{
        if(err){
            res.send(err);
        }else{
            res.send("Successfully deleted all the articles.");
        }
    });
});





// Handling http request verbs on path articles/:articleTitle

app.route("/articles/:articleTitle")

.get((req, res)=>{
    Article.findOne({title: req.params.articleTitle},(err,found)=>{
        if(err){
            res.send(err);
        }else{
            res.send(found);
        }
    });
})
.put((req, res)=>{
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err)=>{
            if(err){
                res.send(err);
            }else{
                res.send("Successfully updated an article.");
            }
        })
})
.patch((req, res)=>{
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err)=>{
            if(err){
                res.send(err);
            }else{
                res.send("Successfully updated a specific field.");
            }
        }
    )
})
.delete((req, res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err)=>{
            if(err){
                res.send(err);
            }else{
                res.send("Successfully deleted an article.");
            }
        }
    )
});








app.listen(3000,()=>{
    console.log("server is running on port 3000");
});

