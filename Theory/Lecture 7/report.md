# Web Storage API Report

## Overview

This report covers the browser **Web Storage API**, focusing on `localStorage`, `sessionStorage`, and JSON handling in JavaScript. It also includes practical storage patterns, common mistakes, a Notes/Todo application exercise, and an overview of how a frontend-only application can later be expanded with a backend.

---

## 1. What is Web Storage?

Web Storage is a browser API that allows JavaScript applications to store **key-value pairs on the client side**.

There are two main storage mechanisms:

### localStorage

- Data persists until it is explicitly deleted.
- Data is shared across tabs for the same origin.
- Typical storage limit is approximately **5–10 MB**.

### sessionStorage

- Data is removed when the browser tab is closed.
- Data is isolated to an individual tab.
- Typical storage limit is approximately **5–10 MB**.

> **Important:** Both `localStorage` and `sessionStorage` store values as strings. Objects and arrays should be serialized with JSON.

---

## 2. localStorage Basics

The main `localStorage` methods and properties are:

| Method / Property | Purpose | Result |
|---|---|---|
| `setItem(key, value)` | Save a value | `undefined` |
| `getItem(key)` | Read a value | String or `null` |
| `removeItem(key)` | Delete one entry | `undefined` |
| `clear()` | Delete all entries | `undefined` |
| `key(index)` | Get a key by position | String |
| `length` | Number of stored items | Number |

### Example

```js
localStorage.setItem("favColor", "blue");

const color = localStorage.getItem("favColor");
console.log(color); // "blue"

localStorage.removeItem("favColor");
```

To remove everything:

```js
localStorage.clear();
```

---

## 3. sessionStorage Basics

`sessionStorage` provides essentially the same API as `localStorage`.

```js
sessionStorage.setItem("tempData", "hello");

console.log(sessionStorage.getItem("tempData"));
// "hello"

sessionStorage.removeItem("tempData");
```

The major difference is its lifetime:

- `localStorage` survives page refreshes and reopening the browser.
- `sessionStorage` disappears when its tab is closed.

---

## 4. Storing Objects: The JSON Problem

Web Storage accepts strings. Saving a JavaScript object directly does not preserve the object structure correctly.

### Incorrect

```js
const user = {
  name: "Alice",
  age: 25
};

localStorage.setItem("user", user);

console.log(localStorage.getItem("user"));
// "[object Object]"
```

### Correct

Serialize the object before storing it:

```js
localStorage.setItem("user", JSON.stringify(user));
```

Stored representation:

```json
{"name":"Alice","age":25}
```

---

## 5. JSON.stringify()

`JSON.stringify()` converts a JavaScript value into a JSON string.

### Object

```js
JSON.stringify({
  name: "Bob",
  age: 30
});
```

Result:

```json
{"name":"Bob","age":30}
```

### Object with an Array

```js
JSON.stringify({
  name: "Bob",
  skills: ["JS", "Python"]
});
```

### Pretty Printing

```js
JSON.stringify(
  { name: "Bob" },
  null,
  2
);
```

### Primitive Values

```js
JSON.stringify("hello");
JSON.stringify(42);
JSON.stringify(true);
```

---

## 6. JSON.parse()

`JSON.parse()` performs the reverse operation. It converts a valid JSON string into a JavaScript value.

```js
const jsonString =
  '{"name":"Bob","age":30,"skills":["JS","Python"]}';

const obj = JSON.parse(jsonString);

console.log(obj.name);   // "Bob"
console.log(obj.age);    // 30
console.log(obj.skills); // ["JS", "Python"]
```

### Complete Storage Round Trip

```js
const user = {
  name: "Alice",
  hobbies: ["reading", "coding"]
};

// Save
localStorage.setItem(
  "user",
  JSON.stringify(user)
);

// Read
const saved = JSON.parse(
  localStorage.getItem("user")
);

console.log(saved.hobbies[0]);
// "reading"

console.log(typeof saved);
// "object"
```

### Handling Invalid JSON

Invalid JSON causes `JSON.parse()` to throw an error.

```js
try {
  const data = JSON.parse("not valid json");
} catch (error) {
  console.error("Parse failed:", error.message);
}
```

---

## 7. Reusable Storage Helper Pattern

Instead of repeatedly writing serialization logic, helper functions can simplify storage operations.

```js
function save(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify(data)
  );
}

function load(key) {
  const raw = localStorage.getItem(key);

  return raw
    ? JSON.parse(raw)
    : null;
}
```

Usage:

```js
save("settings", {
  theme: "dark",
  fontSize: 14
});

const settings = load("settings");

console.log(settings);
```

---

## 8. Inspecting Storage with Developer Tools

### Chrome / Edge

1. Open Developer Tools using `F12` or `Ctrl + Shift + I`.
2. Open the **Application** tab.
3. Expand **Storage**.
4. Select **Local Storage** or **Session Storage**.
5. Select the current origin.
6. Inspect the **Key** and **Value** columns.

Values can also be edited or deleted directly from DevTools.

### Firefox

Open:

**F12 → Storage**

Then inspect Local Storage or Session Storage.

---

## 9. Console Cheat Sheet

### Save

```js
localStorage.setItem("key", "value");
```

### Read

```js
localStorage.getItem("key");
```

### Delete One Item

```js
localStorage.removeItem("key");
```

### Delete Everything

```js
localStorage.clear();
```

### Count Items

```js
localStorage.length;
```

### Get a Key by Index

```js
localStorage.key(0);
```

### Loop Through Storage

```js
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);

  console.log(
    key,
    localStorage.getItem(key)
  );
}
```

### Display Storage as a Table

```js
console.table(localStorage);
```

### Check Whether a Key Exists

```js
localStorage.hasOwnProperty("favColor");
```

### JSON Round Trip

```js
const obj = {
  name: "Alice",
  age: 25
};

const str = JSON.stringify(obj);
const back = JSON.parse(str);

console.log(back);
```

---

## 10. localStorage vs sessionStorage vs Cookies

| Feature | localStorage | sessionStorage | Cookies |
|---|---|---|---|
| Persistence | Until cleared | Until tab closes | Configurable expiry |
| Shared across tabs | Yes, same origin | No | Yes |
| Approx. size | 5–10 MB | 5–10 MB | ~4 KB |
| Stored as | Strings | Strings | Strings |
| Automatically sent to server | No | No | Yes |
| Main JS API | `setItem`, `getItem`, `removeItem`, `clear`, `key`, `length` | Same Web Storage API | Cookie-specific APIs |

### Typical Uses

**localStorage**

- User preferences
- Cached data
- Offline functionality

**sessionStorage**

- Temporary form data
- Data limited to a single tab/session

**Cookies**

- Data that needs to be sent to the server with requests
- Authentication-related use cases where cookie-based handling is required

---

## 11. Common Mistakes

### Mistake 1: Forgetting JSON.stringify()

Incorrect:

```js
localStorage.setItem(
  "user",
  { name: "Bob" }
);
```

Correct:

```js
localStorage.setItem(
  "user",
  JSON.stringify({
    name: "Bob"
  })
);
```

---

### Mistake 2: Forgetting JSON.parse()

Incorrect:

```js
const user =
  localStorage.getItem("user");

console.log(user.name);
```

The returned value is a string.

Correct:

```js
const user = JSON.parse(
  localStorage.getItem("user")
);

console.log(user.name);
```

---

### Mistake 3: Not Handling Missing Keys

A key may not exist.

Safer pattern:

```js
const raw =
  localStorage.getItem("user");

const user = raw
  ? JSON.parse(raw)
  : null;
```

---

### Mistake 4: Assuming Types Are Preserved

```js
localStorage.setItem("num", 42);

console.log(
  typeof localStorage.getItem("num")
);
// "string"
```

Storage values are strings unless explicitly serialized and parsed into the desired JavaScript structure.

---

# 12. Final Task: Notes / Todo App

## Objective

Build a frontend Notes/Todo application using:

- HTML
- CSS
- JavaScript
- `localStorage`

The application should preserve notes after a page refresh.

## Required Features

- Add a note.
- Display saved notes when the page loads.
- Edit existing notes.
- Delete individual notes.
- Persist notes using `localStorage`.
- Give every note:
  - `id`
  - `text`
  - `createdAt`
  - `updatedAt`

## Optional Features

- Complete/incomplete status
- Search and filtering
- Categories or tags
- JSON import/export
- Persistent dark/light mode
- Drag-to-reorder functionality

---

## Note Data Structure

```js
const note = {
  id: Date.now(),
  text: "My first note",
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: null
};
```

Notes can be stored as an array:

```js
localStorage.setItem(
  "notes",
  JSON.stringify(notes)
);
```

---

## Storage Functions

```js
function getNotes() {
  const raw =
    localStorage.getItem("notes");

  return raw
    ? JSON.parse(raw)
    : [];
}

function saveNotes(notes) {
  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );
}
```

---

## CRUD Operations

### Create

```js
function addNote(text) {
  const notes = getNotes();

  notes.push({
    id: Date.now(),
    text: text,
    completed: false,
    createdAt:
      new Date().toISOString(),
    updatedAt: null
  });

  saveNotes(notes);
  renderNotes();
}
```

### Read

```js
const notes = getNotes();
```

### Update

```js
function updateNote(id, newText) {
  const notes = getNotes();

  const note =
    notes.find(n => n.id === id);

  if (note) {
    note.text = newText;
    note.updatedAt =
      new Date().toISOString();

    saveNotes(notes);
    renderNotes();
  }
}
```

### Delete

```js
function deleteNote(id) {
  const notes =
    getNotes().filter(
      note => note.id !== id
    );

  saveNotes(notes);
  renderNotes();
}
```

---

## Rendering Notes

```js
function renderNotes() {
  const container =
    document.getElementById(
      "notesList"
    );

  const notes = getNotes();

  container.innerHTML =
    notes.map(note => `
      <div class="note-card">
        <p>${note.text}</p>

        <button
          onclick="deleteNote(${note.id})">
          Delete
        </button>

        <button
          onclick="editNote(${note.id})">
          Edit
        </button>
      </div>
    `).join("");
}
```

---

## Basic HTML Structure

```html
<input
  type="text"
  id="noteInput"
  placeholder="Type a note..."
>

<button
  onclick="addNote(
    document.getElementById('noteInput').value
  )">
  Add Note
</button>

<div id="notesList"></div>

<script>
  window.onload = renderNotes;
</script>
```

---

## Testing Checklist

- [ ] Add a note and refresh the page.
- [ ] Confirm that the note remains.
- [ ] Delete a note and refresh.
- [ ] Confirm that the deleted note stays deleted.
- [ ] Edit a note and refresh.
- [ ] Confirm that the edited text persists.
- [ ] Open the application in another tab and inspect the notes.
- [ ] Inspect the `notes` key in DevTools.
- [ ] Test empty input behavior.
- [ ] Inspect stored notes with:

```js
console.table(
  JSON.parse(
    localStorage.getItem("notes")
  )
);
```

---

# 13. Expanding the Application to a Backend

A frontend-only storage system has important limitations.

| Frontend-Only Limitation | Backend Solution |
|---|---|
| Data can disappear if browser storage is cleared | Store data in a database |
| Data is not automatically shared between devices | Use a centralized server |
| No built-in user authentication | Add sessions or token authentication |
| No server-side validation | Validate and sanitize requests on the server |
| Browser storage can be modified by users | Apply server-side permissions and security |

---

## Architecture

```text
┌──────────────┐      HTTP / REST      ┌──────────────┐      ┌──────────────┐
│   Frontend   │  <----------------->  │   Backend    │ <--> │   Database   │
│  HTML / JS   │     JSON requests     │ Node/Python  │      │ MongoDB /    │
│              │     JSON responses    │ Java / etc.  │      │ SQL Database │
│ localStorage │                       │              │      │              │
└──────────────┘                       └──────────────┘      └──────────────┘
```

---

## Frontend-Only Approach

```js
function getNotes() {
  return JSON.parse(
    localStorage.getItem("notes")
  ) || [];
}

function saveNotes(notes) {
  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );
}
```

---

## Backend API Approach

### Fetch Notes

```js
async function getNotes() {
  const res = await fetch(
    "/api/notes",
    {
      headers: {
        "Authorization":
          "Bearer " + token
      }
    }
  );

  return await res.json();
}
```

### Add a Note

```js
async function addNote(text) {
  const res = await fetch(
    "/api/notes",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        "Authorization":
          "Bearer " + token
      },
      body: JSON.stringify({
        text
      })
    }
  );

  return await res.json();
}
```

### Delete a Note

```js
async function deleteNote(id) {
  await fetch(
    `/api/notes/${id}`,
    {
      method: "DELETE",
      headers: {
        "Authorization":
          "Bearer " + token
      }
    }
  );
}
```

---

## Backend Technology Options

| Layer | Options |
|---|---|
| Server | Node.js + Express, Python + Flask/FastAPI, Java + Spring Boot |
| Database | MongoDB, PostgreSQL, MySQL, SQLite |
| Authentication | JWT, session cookies, OAuth |
| Validation | Joi, Zod, express-validator |

---

## Storage Strategy

A combined architecture can use:

- **Backend/database** as the main source of persistent data.
- **localStorage** as a client-side cache.

Example:

```js
async function getNotes() {
  const cached =
    localStorage.getItem("notes");

  if (cached) {
    return JSON.parse(cached);
  }

  const res =
    await fetch("/api/notes");

  const notes =
    await res.json();

  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );

  return notes;
}
```

When creating data, save it to the backend first and then update the local cache.

```js
async function addNote(text) {
  const res = await fetch(
    "/api/notes",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        text
      })
    }
  );

  const note =
    await res.json();

  const notes =
    JSON.parse(
      localStorage.getItem("notes")
    ) || [];

  notes.push(note);

  localStorage.setItem(
    "notes",
    JSON.stringify(notes)
  );

  return note;
}
```

---

# Key Takeaways

1. `localStorage` keeps browser data until it is cleared.
2. `sessionStorage` keeps data only for the lifetime of a tab.
3. Both Web Storage APIs store values as strings.
4. Use `JSON.stringify()` before storing objects and arrays.
5. Use `JSON.parse()` when converting stored JSON back into JavaScript values.
6. Handle missing keys and invalid JSON safely.
7. `localStorage` is useful for preferences, caching, offline functionality, and client-side persistence.
8. Browser storage is **not a replacement for a database**.
9. Real applications can use a backend and database as the source of truth while using `localStorage` as a complementary cache.

---

## Conclusion

The Web Storage API provides a simple way to persist data directly in the browser. `localStorage` is useful when data should survive page refreshes and browser restarts, while `sessionStorage` is appropriate for temporary tab-specific data.

Because Web Storage stores strings, JSON serialization and parsing are essential when working with structured JavaScript data. For small frontend projects such as a Notes/Todo application, `localStorage` can provide straightforward persistence. As applications grow and require authentication, cross-device access, validation, permissions, and durable storage, the data should be moved to a backend database while browser storage is used as a supporting client-side mechanism.
