/*const mongoose = require("mongoose");


// =====================================
// CONNECT TO MONGODB
// =====================================

mongoose.connect("mongodb://127.0.0.1:27017/blog_database")
    .then(() => {
        console.log("MongoDB connected successfully");
        main();
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// =====================================
// POST SCHEMA
// =====================================

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [3, "Title must have at least 3 characters"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },

    content: {
        type: String,
        required: [true, "Content is required"]
    },

    author: {
        type: String,
        required: [true, "Author is required"]
    },

    category: {
        type: String,

        enum: {
            values: [
                "Technology",
                "Education",
                "Travel",
                "Entertainment"
            ],
            message: "Invalid category"
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


// =====================================
// COMMENT SCHEMA
// =====================================

const commentSchema = new mongoose.Schema({

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post ID is required"]
    },

    author: {
        type: String,
        required: [true, "Comment author is required"]
    },

    text: {
        type: String,
        required: [true, "Comment text is required"],
        minlength: [1, "Comment cannot be empty"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


// =====================================
// CREATE MODELS
// =====================================

const Post = mongoose.model(
    "Post",
    postSchema
);

const Comment = mongoose.model(
    "Comment",
    commentSchema
);


// =====================================
// CREATE POST
// =====================================

async function createPost() {

    try {

        const post = new Post({

            title: "Introduction to Backend Development",

            content:
                "Backend development handles server-side logic and databases.",

            author: "Ajay",

            category: "Technology"

        });

        await post.save();

        console.log("\nPost created successfully!");

        console.log(post);

        return post;

    } catch (error) {

        console.log(
            "Post creation error:",
            error.message
        );

    }
}


// =====================================
// CREATE COMMENT
// =====================================

async function createComment(postId) {

    try {

        const comment = new Comment({

            postId: postId,

            author: "Student",

            text: "Very useful post!"

        });

        await comment.save();

        console.log("\nComment created successfully!");

        console.log(comment);

    } catch (error) {

        console.log(
            "Comment creation error:",
            error.message
        );

    }
}


// =====================================
// READ POSTS
// =====================================

async function readPosts() {

    try {

        const posts = await Post.find();

        console.log("\n===== ALL POSTS =====");

        console.log(posts);

    } catch (error) {

        console.log(
            "Read error:",
            error.message
        );

    }
}


// =====================================
// READ COMMENTS
// =====================================

async function readComments() {

    try {

        const comments = await Comment.find()
            .populate("postId");

        console.log("\n===== ALL COMMENTS =====");

        console.log(comments);

    } catch (error) {

        console.log(
            "Comment read error:",
            error.message
        );

    }
}


// =====================================
// UPDATE POST
// =====================================

async function updatePost(postId) {

    try {

        const updatedPost =
            await Post.findByIdAndUpdate(

                postId,

                {
                    title:
                        "Updated Backend Development Post"
                },

                {
                    new: true,
                    runValidators: true
                }
            );

        console.log("\nPost updated successfully!");

        console.log(updatedPost);

    } catch (error) {

        console.log(
            "Update error:",
            error.message
        );

    }
}


// =====================================
// DELETE COMMENT
// =====================================

async function deleteComment(commentId) {

    try {

        await Comment.findByIdAndDelete(
            commentId
        );

        console.log(
            "\nComment deleted successfully!"
        );

    } catch (error) {

        console.log(
            "Comment delete error:",
            error.message
        );

    }
}


// =====================================
// DELETE POST
// =====================================

async function deletePost(postId) {

    try {

        await Post.findByIdAndDelete(
            postId
        );

        console.log(
            "\nPost deleted successfully!"
        );

    } catch (error) {

        console.log(
            "Post delete error:",
            error.message
        );

    }
}


// =====================================
// MAIN FUNCTION
// =====================================

async function main() {

    try {

        // CREATE
        const post = await createPost();

        if (!post) {
            return;
        }


        // CREATE COMMENT
        await createComment(post._id);


        // READ POSTS
        await readPosts();


        // READ COMMENTS
        await readComments();


        // UPDATE POST
        await updatePost(post._id);


        /*
        DELETE OPERATIONS

        Uncomment these when you want
        to test DELETE.
        */

        // await deletePost(post._id);

 /*       console.log("\n===== TASK COMPLETED =====");

    } catch (error) {

        console.log(
            "Application error:",
            error.message
        );

    }

}*/

const mongoose = require("mongoose");


// =====================================
// CONNECT TO MONGODB
// =====================================

mongoose.connect("mongodb://127.0.0.1:27017/blog_database")
    .then(() => {
        console.log("MongoDB connected successfully");
        main();
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });


// =====================================
// POST SCHEMA WITH VALIDATION
// =====================================

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [3, "Title must have at least 3 characters"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },

    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: true
    },

    content: {
        type: String,
        required: [true, "Content is required"]
    },

    author: {
        type: String,
        required: [true, "Author is required"]
    },

    category: {
        type: String,
        required: [true, "Category is required"],

        enum: {
            values: [
                "Technology",
                "Education",
                "Travel",
                "Entertainment"
            ],
            message: "Invalid category"
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


// =====================================
// COMMENT SCHEMA WITH VALIDATION
// =====================================

const commentSchema = new mongoose.Schema({

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post ID is required"]
    },

    author: {
        type: String,
        required: [true, "Comment author is required"]
    },

    text: {
        type: String,
        required: [true, "Comment text is required"],
        minlength: [1, "Comment cannot be empty"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


// =====================================
// CREATE MODELS
// =====================================

const Post = mongoose.model(
    "Post",
    postSchema
);

const Comment = mongoose.model(
    "Comment",
    commentSchema
);


// =====================================
// TEST 1 - REQUIRED FIELD VALIDATION
// =====================================

async function testRequiredValidation() {

    console.log("\n===== TEST 1: REQUIRED FIELD =====");

    try {

        const post = new Post({
            content: "This post has no title."
        });

        await post.save();

    } catch (error) {

        console.log("Validation error detected:");
        console.log(error.message);

    }
}


// =====================================
// TEST 2 - MINIMUM LENGTH VALIDATION
// =====================================

async function testLengthValidation() {

    console.log("\n===== TEST 2: LENGTH VALIDATION =====");

    try {

        const post = new Post({

            title: "Hi",

            slug: "short-title-test-" + Date.now(),

            content: "Testing minimum title length.",

            author: "Ajay",

            category: "Technology"

        });

        await post.save();

    } catch (error) {

        console.log("Validation error detected:");
        console.log(error.message);

    }
}


// =====================================
// TEST 3 - ENUM VALIDATION
// =====================================

async function testEnumValidation() {

    console.log("\n===== TEST 3: ENUM VALIDATION =====");

    try {

        const post = new Post({

            title: "Invalid Category Test",

            slug: "invalid-category-" + Date.now(),

            content: "Testing invalid category.",

            author: "Ajay",

            category: "Sports"

        });

        await post.save();

    } catch (error) {

        console.log("Validation error detected:");
        console.log(error.message);

    }
}


// =====================================
// TEST 4 - UNIQUE CONSTRAINT
// =====================================

async function testUniqueValidation() {

    console.log("\n===== TEST 4: UNIQUE CONSTRAINT =====");

    const uniqueSlug =
        "unique-post-" + Date.now();

    try {

        // First post
        const post1 = new Post({

            title: "Unique Post One",

            slug: uniqueSlug,

            content: "First post.",

            author: "Ajay",

            category: "Technology"

        });

        await post1.save();

        console.log("First post created successfully.");


        // Second post with same slug
        const post2 = new Post({

            title: "Unique Post Two",

            slug: uniqueSlug,

            content: "Second post with duplicate slug.",

            author: "Ajay",

            category: "Technology"

        });

        await post2.save();

    } catch (error) {

        console.log("Unique validation error detected:");
        console.log(error.message);

    }
}


// =====================================
// TEST 5 - VALID DATA
// =====================================

async function testValidData() {

    console.log("\n===== TEST 5: VALID DATA =====");

    try {

        const post = new Post({

            title: "Valid Backend Development Post",

            slug: "valid-backend-post-" + Date.now(),

            content:
                "This post contains valid data.",

            author: "Ajay",

            category: "Technology"

        });

        await post.save();

        console.log("Valid post created successfully!");

        console.log("Title:", post.title);
        console.log("Category:", post.category);

        return post;

    } catch (error) {

        console.log(
            "Unexpected error:",
            error.message
        );

    }
}


// =====================================
// TEST 6 - COMMENT VALIDATION
// =====================================

async function testCommentValidation(postId) {

    console.log("\n===== TEST 6: COMMENT VALIDATION =====");

    try {

        const comment = new Comment({

            postId: postId,

            author: "Student",

            text: "Very useful blog post!"

        });

        await comment.save();

        console.log(
            "Valid comment created successfully!"
        );

    } catch (error) {

        console.log(
            "Comment validation error:",
            error.message
        );

    }
}


// =====================================
// MAIN FUNCTION
// =====================================

async function main() {

    try {

        await testRequiredValidation();

        await testLengthValidation();

        await testEnumValidation();

        await testUniqueValidation();

        const validPost =
            await testValidData();

        if (validPost) {

            await testCommentValidation(
                validPost._id
            );

        }

        console.log("\n=================================");
        console.log("TASK 5 COMPLETED SUCCESSFULLY!");
        console.log("=================================");

    } catch (error) {

        console.log(
            "Application error:",
            error.message
        );

    } finally {

        await mongoose.connection.close();

    }

}