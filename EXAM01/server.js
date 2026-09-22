// Import required packages
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

// Create Express application
const app = express();

// Set server port
const PORT = 3000;

// Connect to MongoDB
const client = new MongoClient("mongodb://127.0.0.1:27017");

// Variable to store MongoDB notes collection
let notesCollection;

// Set EJS as the template engine
app.set("view engine", "ejs");

// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));

// Serve static files like CSS from the public folder
app.use(express.static("public"));


// =====================================================
// HOME ROUTE - DISPLAY ALL NOTES
// =====================================================

// When user visits "/"
app.get("/", async (req, res) => {

    try {

        // Get all notes from MongoDB
        const notes = await notesCollection
            .find()

            // Show newest notes first
            .sort({ createdAt: -1 })

            // Convert MongoDB data into an array
            .toArray();

        // Send notes to index.ejs page
        res.render("index", { notes });

    } catch (error) {

        // Display error in terminal
        console.log(error);

        // Send error message to browser
        res.send("Error loading notes");
    }
});


// =====================================================
// ADD NOTE PAGE
// =====================================================

// Display the Add Note form
app.get("/notes/new", (req, res) => {

    // Open new.ejs page
    res.render("new");
});


// =====================================================
// ADD NOTE
// =====================================================

// Receive the Add Note form data
app.post("/notes", async (req, res) => {

    try {

        // Get title, content and category from the form
        const { title, content, category } = req.body;


        // Validate title and content
        // They cannot be empty
        if (!title || !title.trim() || !content || !content.trim()) {

            // Show error if title or content is empty
            return res.send("Title and Content cannot be empty.");
        }


        // Insert the new note into MongoDB
        await notesCollection.insertOne({

            // Store title
            title: title.trim(),

            // Store content
            content: content.trim(),

            // Store category
            // If category is empty, use "General"
            category: category ? category.trim() : "General",

            // Store current date and time
            createdAt: new Date()
        });


        // Display success message in terminal
        console.log("Note added successfully!");


        // Go back to home page
        res.redirect("/");

    } catch (error) {

        // Display error in terminal
        console.log(error);

        // Display error in browser
        res.send("Error adding note");
    }
});


// =====================================================
// DELETE NOTE
// =====================================================

// Delete a note using its ID
app.post("/notes/:id/delete", async (req, res) => {

    try {

        // Find the note using its MongoDB ID
        await notesCollection.deleteOne({

            // Convert ID from URL into MongoDB ObjectId
            _id: new ObjectId(req.params.id)
        });


        // Display success message in terminal
        console.log("Note deleted successfully!");


        // Go back to home page
        res.redirect("/");

    } catch (error) {

        // Display error in terminal
        console.log(error);

        // Display error in browser
        res.send("Error deleting note");
    }
});


// =====================================================
// CONNECT TO MONGODB AND START SERVER
// =====================================================

// Function to connect MongoDB and start Express server
async function startServer() {

    try {

        // Connect to MongoDB
        await client.connect();


        // Select the "notes_lab" database
        const database = client.db("notes_lab");


        // Select the "notes" collection
        notesCollection = database.collection("notes");


        // Display connection information in terminal
        console.log("Connected to MongoDB");
        console.log("Database: notes_lab");
        console.log("Collection: notes");


        // Start Express server
        app.listen(PORT, () => {

            // Display server URL in terminal
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {

        // Display MongoDB connection error
        console.log("MongoDB connection failed:");
        console.log(error);
    }
}


// Call the function to start the application
startServer();