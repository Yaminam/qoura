const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Use method-override middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

let posts = [
    { id: uuidv4(), username: "shreyash tripathi", content: "hello bhai" },
    { id: uuidv4(), username: "nitish", content: "aur bhai kaisa hai" },
    { id: uuidv4(), username: "shakir raaza", content: "nigga" },
    { id: uuidv4(), username: "abdul", content: "randi kahinka" }
];

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Quora");
});

// Route to display posts
app.get("/post", (req, res) => {
    res.render("index", { posts });
});

// Route to display the form for creating a new post
app.get("/post/new", (req, res) => {
    res.render("new");
});

// Route to handle form submissions
app.post("/post", (req, res) => {
    const { username, content } = req.body;
    let id = uuidv4();
    posts.push({ id, username, content });
    // Redirect to /post to display updated posts
    res.redirect("/post");
});

// Route to show a specific post
app.get("/post/:id", (req, res) => {
    let { id } = req.params;
    console.log(id); // Debugging: check if id is being logged correctly
    let post = posts.find((p) => id === p.id);
    console.log(post); // Debugging: check if post is found correctly
    if (post) {
        res.render("show", { post }); // Rendering without the .ejs extension
    } else {
        res.status(404).send("Post not found");
    }
});

// Route to update a specific post
app.patch("/post/:id", (req, res) => {
    let { id } = req.params;
    let { content } = req.body;

    let post = posts.find((p) => id === p.id);
    if (post) {
        post.content = content;
        console.log(post);
        res.redirect("/post");
    } else {
        res.status(404).send("Post not found");
    }
});

// Route to display the edit form for a specific post
app.get("/post/:id/edit", (req, res) => {
    let { id } = req.params;
    let post = posts.find((p) => id === p.id);
    if (post) {
        res.render("edit", { post }); // Rendering without the .ejs extension and passing the post data
    } else {
        res.status(404).send("Post not found");
    }
});

// Route to delete a specific post
app.delete("/post/:id", (req, res) => {
    let { id } = req.params;
    let postIndex = posts.findIndex((p) => id === p.id);
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        
        res.redirect("/post");
    } else {
        res.status(404).send("Post not found");
    }
});

app.listen(port, () => {
    console.log("Listening to port " + port);
});
