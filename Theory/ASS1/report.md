# Notes App Using Local Storage --- Project Report

## 1. Introduction

This project implements a browser-based **Notes App** using HTML, CSS,
JavaScript, and the Web Storage API. The application allows a user to
create, edit, delete, and persist notes without requiring a backend
database.

The main objective is to demonstrate practical use of `localStorage`,
JSON serialization/deserialization, DOM manipulation, input validation,
and basic CRUD operations.

------------------------------------------------------------------------

## 2. Project Objective

The application was developed to demonstrate the following concepts:

-   Creating a simple frontend application with HTML, CSS, and
    JavaScript.
-   Saving structured data in `localStorage`.
-   Converting JavaScript objects to JSON using `JSON.stringify()`.
-   Restoring JSON data using `JSON.parse()`.
-   Performing Create, Read, Update, and Delete operations.
-   Keeping notes available after the browser page is refreshed.
-   Displaying creation and update timestamps.
-   Handling empty input and deletion confirmation.

------------------------------------------------------------------------

## 3. User Interface

The Notes App contains a simple centered interface with:

-   The heading **My Notes App**.
-   A text field with the placeholder **Type a note...**.
-   An **Add Note** button.
-   A notes display area.
-   **Edit** and **Delete** buttons for each saved note.

When no notes are stored, the application displays:

> No notes available.

The interface uses a light background, a white application container,
rounded corners, and simple buttons to keep the design clean and easy to
use.

------------------------------------------------------------------------

## 4. Technologies Used

  Technology        Purpose
  ----------------- -------------------------------------------
  HTML5             Creates the application structure
  CSS3              Styles the user interface
  JavaScript        Implements application logic
  Web Storage API   Provides browser-side persistent storage
  JSON              Converts note objects to and from strings

------------------------------------------------------------------------

## 5. Data Structure

Each note is represented as a JavaScript object.

``` javascript
const newNote = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: null
};
```

The fields have the following purposes:

  Field         Description
  ------------- --------------------------------------------------------------
  `id`          Unique note identifier generated using the current timestamp
  `text`        Stores the note content
  `completed`   Boolean field available for completion status
  `createdAt`   Stores the note creation date and time
  `updatedAt`   Stores the most recent edit time

All notes are maintained in an array and stored under the `localStorage`
key `"notes"`.

------------------------------------------------------------------------

## 6. Reading Notes from localStorage

The `getNotes()` function retrieves the saved notes.

``` javascript
function getNotes() {
    const raw = localStorage.getItem("notes");
    return raw ? JSON.parse(raw) : [];
}
```

The process is:

1.  Read the `"notes"` value from `localStorage`.
2.  If data exists, convert the JSON string back into a JavaScript
    array.
3.  If no data exists, return an empty array.

This prevents the application from failing when it is opened for the
first time.

------------------------------------------------------------------------

## 7. Saving Notes

The `saveNotes()` function stores the notes array.

``` javascript
function saveNotes(notes) {
    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );
}
```

Because Web Storage stores strings, `JSON.stringify()` converts the
notes array into JSON before it is saved.

This is the main mechanism that provides persistence after page
refreshes.

------------------------------------------------------------------------

## 8. Adding a Note

The `handleAddNote()` function creates new notes.

The function:

1.  Gets the value from the note input.
2.  Removes unnecessary whitespace with `trim()`.
3.  Checks whether the input is empty.
4.  Loads existing notes.
5.  Creates a new note object.
6.  Adds the object to the notes array.
7.  Saves the updated array to `localStorage`.
8.  Clears the input field.
9.  Re-renders the notes.

Empty input is rejected with:

``` javascript
if (text === "") {
    alert("Please enter a note.");
    return;
}
```

This prevents blank notes from being stored.

------------------------------------------------------------------------

## 9. Editing a Note

The `editNote(id)` function updates an existing note.

First, the application locates the required note:

``` javascript
const note = notes.find(function(note) {
    return note.id === id;
});
```

A browser prompt then displays the existing note text:

``` javascript
const newText = prompt(
    "Edit your note:",
    note.text
);
```

If the user submits a valid value, the application updates the note text
and records the modification time:

``` javascript
note.text = updatedText;
note.updatedAt = new Date().toISOString();
```

The modified notes array is saved back to `localStorage`, and the page
content is rendered again.

The application also prevents an edited note from becoming empty.

------------------------------------------------------------------------

## 10. Deleting a Note

The `deleteNote(id)` function removes an individual note.

Before deletion, the application requests confirmation:

``` javascript
const confirmDelete = confirm(
    "Are you sure you want to delete this note?"
);
```

If confirmed, `filter()` creates a new array containing every note
except the selected one:

``` javascript
const notes = getNotes().filter(function(note) {
    return note.id !== id;
});
```

The new array is saved and the interface is updated.

------------------------------------------------------------------------

## 11. Rendering Notes

The `renderNotes()` function displays the current data in the page.

If the notes array is empty, the following message is rendered:

``` html
<p class="empty">No notes available.</p>
```

When notes exist, `map()` generates a card for each note.

Each rendered note includes:

-   Note text.
-   Creation date and time.
-   Updated date and time, when applicable.
-   Edit button.
-   Delete button.

The creation timestamp is converted into a readable local date:

``` javascript
const createdDate =
    new Date(note.createdAt).toLocaleString();
```

The updated timestamp is displayed only when `updatedAt` contains a
value.

------------------------------------------------------------------------

## 12. Loading Saved Notes on Page Open

The application automatically restores the notes when the page loads:

``` javascript
window.onload = function() {
    renderNotes();
};
```

Because `renderNotes()` reads from `localStorage`, previously saved
notes appear again after refreshing or reopening the application in the
same origin.

------------------------------------------------------------------------

## 13. localStorage Verification

The project was also verified using the browser's Developer Tools under:

**Application → Storage → Local Storage**

The stored data includes a `"notes"` key containing a JSON
representation of the notes array.

This confirms that the application is not keeping the note only in
temporary JavaScript memory. It is saving the data through the browser's
Web Storage API.

Other test keys visible in storage demonstrate that `localStorage` can
hold multiple independent key-value pairs for the same origin.

------------------------------------------------------------------------

## 14. Demonstrated Application States

The supplied screenshots demonstrate several important states of the
project.

### Empty State

When there are no saved notes, the interface displays:

> No notes available.

This verifies the empty-array branch of `renderNotes()`.

### Saved Note State

After adding a note, the application displays the note in a card along
with its creation timestamp and the **Edit** and **Delete** controls.

### Edited Note State

A saved note can display both:

-   `Created:` timestamp
-   `Updated:` timestamp

This demonstrates that editing changes the text while preserving the
original creation time and recording a separate update time.

### Persistent Storage State

The Developer Tools screenshot shows the `notes` entry inside Local
Storage, demonstrating browser-side persistence of the notes data.

------------------------------------------------------------------------

## 15. CRUD Operations

The project demonstrates the four fundamental CRUD operations:

  CRUD Operation   Implementation
  ---------------- ----------------------------------
  Create           `handleAddNote()`
  Read             `getNotes()` and `renderNotes()`
  Update           `editNote(id)`
  Delete           `deleteNote(id)`

This makes the project a practical introduction to data-management
concepts before moving to a backend and database.

------------------------------------------------------------------------

## 16. Input Validation and User Safety

The application includes basic validation and confirmation features.

### Empty New Note

``` javascript
if (text === "") {
    alert("Please enter a note.");
    return;
}
```

### Empty Edited Note

``` javascript
if (updatedText === "") {
    alert("Note cannot be empty.");
    return;
}
```

### Delete Confirmation

The user must confirm before a note is permanently removed.

These checks improve usability and prevent common accidental actions.

------------------------------------------------------------------------

## 17. Testing Results

The application can be tested with the following cases:

  Test                    Expected Result
  ----------------------- --------------------------------------------
  Open with no notes      Displays "No notes available."
  Add a valid note        Note appears in the list
  Add empty input         Alert is displayed
  Refresh after adding    Saved note remains
  Edit a note             Text changes and updated timestamp appears
  Edit with empty text    Alert prevents the update
  Cancel editing          Existing note remains unchanged
  Delete and cancel       Note remains
  Delete and confirm      Note is removed
  Delete all notes        Empty-state message returns
  Inspect Local Storage   `"notes"` contains serialized JSON

The supplied screenshots show successful empty-state rendering,
saved-note rendering, edit timestamps, and Local Storage persistence.

------------------------------------------------------------------------

## 18. Advantages of the Implementation

The project has several strengths:

-   Simple and easy-to-understand architecture.
-   No backend server is required.
-   Data persists across page refreshes.
-   JSON correctly preserves structured note data.
-   CRUD operations are clearly separated into functions.
-   Empty input is validated.
-   Delete operations require confirmation.
-   Creation and modification times are tracked.
-   The interface updates immediately after data changes.

------------------------------------------------------------------------

## 19. Limitations

Because the project uses only `localStorage`, it also has limitations:

-   Notes are tied to the browser and origin.
-   Data is lost if the user clears browser storage.
-   Notes are not automatically synchronized between devices.
-   There is no user authentication.
-   `localStorage` should not be used for sensitive information.
-   The current `completed` field is stored but is not exposed through
    the interface.
-   Editing uses the browser's `prompt()` dialog rather than an inline
    editing interface.

These limitations can be addressed in a future backend-based version.

------------------------------------------------------------------------

## 20. Possible Future Improvements

The project could be extended with:

-   Complete/incomplete note status.
-   Search and filtering.
-   Categories or tags.
-   Dark/light mode.
-   JSON import and export.
-   Note sorting.
-   Drag-and-drop ordering.
-   Inline editing instead of `prompt()`.
-   Backend API integration.
-   Database persistence.
-   User registration and authentication.
-   Per-user notes synchronized across devices.

------------------------------------------------------------------------

## 21. Conclusion

The Notes App successfully demonstrates how JavaScript can use the Web
Storage API to implement persistent client-side data management.

The application performs complete CRUD operations and stores its notes
as JSON in `localStorage`. It validates user input, records creation and
update timestamps, confirms deletions, restores saved notes when the
page loads, and provides a clear empty state when no data exists.

Overall, the project provides a practical foundation for understanding
frontend persistence and prepares the application for future expansion
into a backend and database-based system.
