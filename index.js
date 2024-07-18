const express = require('express')
const app = express();
const path= require('path')
const fs= require('fs');



app.set("view engine","ejs")




app.use(express.json())
app.use(express.urlencoded({extended:true}))


//index.ejs
app.use(function(req,res,next){
    console.log("Running")
    next()
})
app.use(express.static(path.join(__dirname,"public")))


app.get("/",function(req,res){
    fs.readdir(`./files`,function(err,files){
        res.render("index",{files:files})
    })
})


app.post("/create",function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('_')}.txt`,req.body.details,function(err){
        res.redirect("/")
    })
})

app.post("/delete/:filename",function(req,res){
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) {
            return res.status(500).send('File not found.');
        }
        res.redirect('/');
    });
})


//show.ejs
app.get("/file/:filename", function (req, res) {
  fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
    res.render("show",{filename: req.params.filename, filedata: filedata})
  })
});


app.get("/file/edit/:filename", function (req, res) {
  res.render("edit", { filename: req.params.filename });
});



app.post("/change/:filename", function (req, res) {
  const oldPath = `./files/${req.params.filename}`;
  const newPath = `./files/${req.body.new}`;
    fs.rename(oldPath, newPath, (err) => {
        if (err) {
          return res.status(500).send("Files not found.");
        }
        res.redirect("/");
    });
});




app.listen(3000)