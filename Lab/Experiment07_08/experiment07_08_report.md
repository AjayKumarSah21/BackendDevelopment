# Experiment 07 & 08 --- ES6, DOM Manipulation, and Event Handling

## Objective

To understand and apply ES6 (ECMAScript 2015) features in JavaScript,
learn DOM (Document Object Model) manipulation, and implement event
handling to build interactive web pages.

By completing this experiment, a student should be able to write modern
JavaScript, dynamically modify HTML and CSS through the DOM, and respond
to user interactions using event listeners.

------------------------------------------------------------------------

# Prerequisites

Before performing this experiment, the following are useful:

-   Basic knowledge of HTML and CSS
-   Familiarity with JavaScript variables, functions, loops, and
    conditionals
-   A text editor such as VS Code
-   A modern browser such as Chrome, Firefox, or Edge

------------------------------------------------------------------------

# Part A --- ES6 (ECMAScript 2015) Features

ES6 introduced major improvements to JavaScript. These features make
code cleaner, more readable, reusable, and expressive.

------------------------------------------------------------------------

## 1. `let` and `const`

Before ES6, `var` was commonly used for declaring variables.

ES6 introduced `let` and `const`, which are block-scoped.

### `var`

``` javascript
var x = 10;
var x = 20;
```

`var` can be redeclared and is function-scoped.

### `let`

``` javascript
let y = 10;

// let y = 20;
// Error in the same scope
```

`let` is block-scoped and should be used when a variable needs
reassignment.

### `const`

``` javascript
const z = 30;

// z = 40;
// Error
```

`const` is block-scoped and cannot be reassigned.

### Block Scope Example

``` javascript
if (true) {
    let blockVar = "inside";
    var funcVar = "outside";
}

// console.log(blockVar);
// ReferenceError

console.log(funcVar);
```

A useful rule is:

-   Use `const` by default.
-   Use `let` when reassignment is required.
-   Avoid `var` in modern JavaScript when possible.

------------------------------------------------------------------------

## 2. Arrow Functions

Arrow functions provide a shorter function syntax.

Traditional function:

``` javascript
function add(a, b) {
    return a + b;
}
```

Arrow function:

``` javascript
const add = (a, b) => a + b;
```

Single parameter:

``` javascript
const square = x => x * x;
```

No parameters:

``` javascript
const greet = () => "Hello!";
```

Multi-line arrow function:

``` javascript
const multiply = (a, b) => {
    const result = a * b;
    return result;
};
```

Example:

``` javascript
console.log(add(3, 4));
console.log(square(5));
```

Arrow functions do not create their own `this`; they inherit it from the
enclosing scope.

------------------------------------------------------------------------

## 3. Template Literals

Template literals use backticks and support interpolation with `${}`.

``` javascript
const name = "Alice";
const age = 25;

const message =
    `Hello, ${name}! You are ${age} years old.`;

console.log(message);
```

They also support multi-line strings:

``` javascript
const html = `
    <div>
        <h1>${name}</h1>
        <p>Age: ${age}</p>
    </div>
`;
```

Expressions can be evaluated directly:

``` javascript
console.log(`Sum: ${5 + 3}`);
console.log(`Upper: ${name.toUpperCase()}`);
```

------------------------------------------------------------------------

## 4. Destructuring

Destructuring extracts values from arrays or objects into variables.

### Array Destructuring

``` javascript
const colors = [
    "red",
    "green",
    "blue"
];

const [first, second, third] = colors;

console.log(first);
console.log(second);
```

Skipping values:

``` javascript
const [, , thirdColor] = colors;

console.log(thirdColor);
```

### Object Destructuring

``` javascript
const person = {
    name: "Bob",
    age: 30,
    city: "Mumbai"
};

const { name, age } = person;

console.log(name);
console.log(age);
```

Renaming:

``` javascript
const {
    name: fullName
} = person;

console.log(fullName);
```

Default value:

``` javascript
const {
    country = "India"
} = person;

console.log(country);
```

------------------------------------------------------------------------

## 5. Spread and Rest Operators

Both spread and rest use `...`, but their purposes differ.

### Spread Operator

Spread expands an array or object.

``` javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const combined = [
    ...arr1,
    ...arr2
];

console.log(combined);
```

Copying an array:

``` javascript
const copy = [...arr1];
```

Objects:

``` javascript
const obj1 = {
    a: 1,
    b: 2
};

const obj2 = {
    ...obj1,
    c: 3
};

console.log(obj2);
```

### Rest Operator

Rest collects multiple values.

``` javascript
function sum(...numbers) {
    return numbers.reduce(
        (total, number) =>
            total + number,
        0
    );
}

console.log(
    sum(1, 2, 3, 4)
);
```

Rest with destructuring:

``` javascript
const [
    head,
    ...tail
] = [10, 20, 30, 40];

console.log(head);
console.log(tail);
```

------------------------------------------------------------------------

## 6. Default Parameters

Default parameters provide fallback values.

``` javascript
function greet(
    name = "Guest",
    greeting = "Hello"
) {
    return `${greeting}, ${name}!`;
}

console.log(greet());
console.log(greet("Alice"));
console.log(
    greet("Bob", "Hi")
);
```

------------------------------------------------------------------------

## 7. ES6 Classes

ES6 introduced class syntax for objects and inheritance.

``` javascript
class Animal {

    constructor(name, sound) {
        this.name = name;
        this.sound = sound;
    }

    speak() {
        return `${this.name} says ${this.sound}`;
    }

    static info() {
        return "Animals are living beings.";
    }
}
```

Inheritance:

``` javascript
class Dog extends Animal {

    constructor(name) {
        super(name, "Woof");
    }

    fetch() {
        return `${this.name} is fetching the ball.`;
    }
}

const dog = new Dog("Rex");

console.log(dog.speak());
console.log(dog.fetch());
console.log(Animal.info());
```

------------------------------------------------------------------------

## 8. JavaScript Modules

Modules divide code into reusable files.

### `math.js`

``` javascript
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export default function multiply(a, b) {
    return a * b;
}
```

### `main.js`

``` javascript
import multiply, {
    PI,
    add
} from './math.js';

console.log(PI);
console.log(add(2, 3));
console.log(multiply(4, 5));
```

In a browser, modules require:

``` html
<script
    type="module"
    src="main.js">
</script>
```

------------------------------------------------------------------------

## 9. Promises and Async/Await

Promises represent asynchronous operations.

``` javascript
const fetchData = () => {
    return new Promise(
        (resolve, reject) => {
            setTimeout(
                () =>
                    resolve(
                        "Data loaded"
                    ),
                1000
            );
        }
    );
};

fetchData().then(
    data => console.log(data)
);
```

The same asynchronous flow can be handled with `async` and `await`:

``` javascript
async function loadData() {
    try {
        const data =
            await fetchData();

        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

loadData();
```

------------------------------------------------------------------------

## 10. Enhanced Object Literals

ES6 provides shorthand syntax for objects.

``` javascript
const name = "Alice";
const age = 25;

const person = {
    name,
    age
};
```

Method shorthand:

``` javascript
const calculator = {

    add(a, b) {
        return a + b;
    },

    subtract(a, b) {
        return a - b;
    }
};
```

Computed property names:

``` javascript
const key = "dynamicKey";

const obj = {
    [key]: "value"
};

console.log(
    obj.dynamicKey
);
```

------------------------------------------------------------------------

# Part B --- DOM Manipulation

## What is the DOM?

DOM stands for **Document Object Model**.

When the browser loads an HTML page, it creates a tree-like
representation of the document.

Example:

``` text
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1
        └── p
```

JavaScript can access this structure and dynamically:

-   Read content
-   Change text
-   Change HTML
-   Modify attributes
-   Modify styles
-   Create elements
-   Remove elements
-   Navigate between elements

------------------------------------------------------------------------

# Selecting DOM Elements

## `getElementById()`

``` javascript
const container =
    document.getElementById(
        "container"
    );
```

## `getElementsByClassName()`

``` javascript
const paragraphs =
    document.getElementsByClassName(
        "text"
    );

console.log(
    paragraphs.length
);
```

## `getElementsByTagName()`

``` javascript
const paragraphs =
    document.getElementsByTagName(
        "p"
    );
```

## `querySelector()`

Returns the first matching element.

``` javascript
const firstPara =
    document.querySelector(
        ".text"
    );
```

## `querySelectorAll()`

Returns all matching elements.

``` javascript
const allParas =
    document.querySelectorAll(
        ".text"
    );

allParas.forEach(
    paragraph =>
        console.log(
            paragraph.textContent
        )
);
```

------------------------------------------------------------------------

# Modifying Content

``` javascript
const heading =
    document.querySelector("h1");
```

### `textContent`

``` javascript
heading.textContent =
    "New Heading";
```

### `innerHTML`

``` javascript
heading.innerHTML =
    "<em>Italic Heading</em>";
```

### `innerText`

``` javascript
heading.innerText =
    "Visible Text";
```

## Security Note

User-supplied data should not be inserted carelessly with `innerHTML`,
because unsafe HTML can introduce Cross-Site Scripting (XSS) risks.

For plain user text, `textContent` is generally safer.

------------------------------------------------------------------------

# Modifying Attributes

``` javascript
const link =
    document.querySelector("a");
```

Get an attribute:

``` javascript
console.log(
    link.getAttribute("href")
);
```

Set attributes:

``` javascript
link.setAttribute(
    "href",
    "https://example.com"
);

link.setAttribute(
    "target",
    "_blank"
);
```

Remove:

``` javascript
link.removeAttribute(
    "target"
);
```

Direct property:

``` javascript
link.href =
    "https://example.com";
```

------------------------------------------------------------------------

# Modifying Styles

``` javascript
const box =
    document.querySelector(
        ".box"
    );

box.style.backgroundColor =
    "blue";

box.style.fontSize =
    "20px";

box.style.marginTop =
    "10px";
```

Using CSS classes is often preferred:

``` javascript
box.classList.add(
    "highlight"
);

box.classList.remove(
    "hidden"
);

box.classList.toggle(
    "active"
);

console.log(
    box.classList.contains(
        "active"
    )
);
```

------------------------------------------------------------------------

# Creating and Adding Elements

Create an element:

``` javascript
const newDiv =
    document.createElement(
        "div"
    );

newDiv.textContent =
    "I am new!";

newDiv.classList.add(
    "card"
);
```

Append it:

``` javascript
const container =
    document.getElementById(
        "container"
    );

container.appendChild(
    newDiv
);
```

Other insertion methods:

``` javascript
container.append(newDiv);

container.prepend(newDiv);

firstChild.before(newDiv);

firstChild.after(newDiv);
```

------------------------------------------------------------------------

# Removing Elements

Older method:

``` javascript
element.parentNode
    .removeChild(element);
```

Modern method:

``` javascript
element.remove();
```

------------------------------------------------------------------------

# Traversing the DOM

Given:

``` javascript
const item =
    document.querySelector(
        ".item"
    );
```

Parent:

``` javascript
item.parentElement;
```

Children:

``` javascript
item.children;

item.firstElementChild;

item.lastElementChild;
```

Siblings:

``` javascript
item.nextElementSibling;

item.previousElementSibling;
```

------------------------------------------------------------------------

# Part C --- Event Handling

## What is an Event?

An event is an action or occurrence in the browser.

Examples include:

-   Click
-   Double-click
-   Key press
-   Mouse movement
-   Form submission
-   Input change
-   Page load
-   Scroll
-   Window resize

JavaScript can listen for these events and execute code in response.

------------------------------------------------------------------------

# Ways to Attach Event Handlers

## Method 1 --- HTML Attribute

``` html
<button
    onclick="alert('Clicked!')">
    Click Me
</button>
```

This approach is generally not recommended for modern application
structure.

## Method 2 --- DOM Property

``` javascript
const btn =
    document.querySelector(
        "button"
    );

btn.onclick = function() {
    alert("Clicked!");
};
```

Only one `onclick` property handler can be assigned at a time.

## Method 3 --- `addEventListener()`

Recommended approach:

``` javascript
const btn =
    document.querySelector(
        "button"
    );

btn.addEventListener(
    "click",
    function() {
        alert("Clicked!");
    }
);
```

Multiple listeners can be attached:

``` javascript
btn.addEventListener(
    "click",
    () =>
        console.log(
            "Second handler"
        )
);
```

------------------------------------------------------------------------

# Common Event Types

  Event         Trigger
  ------------- ------------------------
  `click`       Element clicked
  `dblclick`    Element double-clicked
  `mouseover`   Mouse enters element
  `mouseout`    Mouse leaves element
  `mousedown`   Mouse button pressed
  `mouseup`     Mouse button released
  `keydown`     Key pressed
  `keyup`       Key released
  `input`       Input value changes
  `change`      Value is committed
  `submit`      Form submitted
  `focus`       Element gains focus
  `blur`        Element loses focus
  `load`        Resource/page loads
  `scroll`      Page/element scrolls
  `resize`      Window resized

------------------------------------------------------------------------

# The Event Object

Event handlers receive an event object.

``` javascript
document
    .querySelector("button")
    .addEventListener(
        "click",
        function(event) {

            console.log(
                event.type
            );

            console.log(
                event.target
            );

            console.log(
                event.clientX
            );

            console.log(
                event.clientY
            );

            console.log(
                event.timeStamp
            );
        }
    );
```

------------------------------------------------------------------------

# Keyboard Events

``` javascript
document.addEventListener(
    "keydown",
    event => {

        console.log(
            `Key pressed: ${event.key}`
        );

        console.log(
            `Code: ${event.code}`
        );

        console.log(
            `Ctrl pressed: ${event.ctrlKey}`
        );

        console.log(
            `Shift pressed: ${event.shiftKey}`
        );
    }
);
```

------------------------------------------------------------------------

# Form Events

HTML:

``` html
<form id="myForm">

    <input
        type="text"
        id="username"
        required
    >

    <button type="submit">
        Submit
    </button>

</form>
```

JavaScript:

``` javascript
const form =
    document.getElementById(
        "myForm"
    );

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const username =
            document
                .getElementById(
                    "username"
                )
                .value;

        console.log(
            `Submitted: ${username}`
        );
    }
);
```

Input event:

``` javascript
document
    .getElementById("username")
    .addEventListener(
        "input",
        event => {

            console.log(
                `Current value: ${event.target.value}`
            );
        }
    );
```

------------------------------------------------------------------------

# Event Bubbling and Capturing

Events move through the DOM in three phases:

1.  Capturing
2.  Target
3.  Bubbling

Example HTML:

``` html
<div id="outer">
    <button id="inner">
        Click Me
    </button>
</div>
```

JavaScript:

``` javascript
document
    .getElementById("outer")
    .addEventListener(
        "click",
        () => {
            console.log(
                "Outer clicked"
            );
        }
    );

document
    .getElementById("inner")
    .addEventListener(
        "click",
        () => {
            console.log(
                "Inner clicked"
            );
        }
    );
```

Clicking the button produces:

``` text
Inner clicked
Outer clicked
```

The outer handler executes because the event bubbles upward.

------------------------------------------------------------------------

# `stopPropagation()` and `preventDefault()`

## `stopPropagation()`

Stops event propagation.

``` javascript
document
    .getElementById("inner")
    .addEventListener(
        "click",
        event => {

            event.stopPropagation();

            console.log(
                "Inner clicked"
            );
        }
    );
```

## `preventDefault()`

Stops the browser's default action.

``` javascript
document
    .querySelector("a")
    .addEventListener(
        "click",
        event => {

            event.preventDefault();

            console.log(
                "Link clicked but not followed"
            );
        }
    );
```

------------------------------------------------------------------------

# Event Delegation

Event delegation attaches one listener to a parent instead of attaching
separate listeners to many child elements.

HTML:

``` html
<ul id="taskList">
    <li>Task 1</li>
    <li>Task 2</li>
    <li>Task 3</li>
</ul>
```

JavaScript:

``` javascript
document
    .getElementById("taskList")
    .addEventListener(
        "click",
        event => {

            if (
                event.target.tagName
                === "LI"
            ) {
                event.target
                    .classList
                    .toggle("done");

                console.log(
                    `Clicked: ${event.target.textContent}`
                );
            }
        }
    );
```

Benefits include:

-   Works with dynamically added elements
-   Reduces the number of listeners
-   Can use less memory

------------------------------------------------------------------------

# Practical Exercise --- Interactive To-Do List

This application combines ES6, DOM manipulation, and event handling.

## Features

-   Add a task using the button
-   Add a task by pressing Enter
-   Mark tasks complete/incomplete
-   Delete tasks
-   Dynamically create DOM elements
-   Use event delegation
-   Use ES6 classes and spread syntax

------------------------------------------------------------------------

# `index.html`

``` html
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ES6 To-Do App
    </title>

    <style>

        body {
            font-family:
                Arial,
                sans-serif;

            max-width: 500px;

            margin:
                40px auto;
        }

        input {
            padding: 8px;
            width: 70%;
        }

        button {
            padding:
                8px 16px;

            cursor: pointer;
        }

        ul {
            list-style: none;
            padding: 0;
        }

        li {
            padding: 10px;

            border-bottom:
                1px solid #ddd;

            display: flex;

            justify-content:
                space-between;
        }

        .done {
            text-decoration:
                line-through;

            color: gray;
        }

        .delete-btn {
            background: red;
            color: white;
            border: none;
        }

    </style>

</head>

<body>

    <h1>
        My To-Do List
    </h1>

    <input
        type="text"
        id="taskInput"
        placeholder="Enter a task..."
    >

    <button id="addBtn">
        Add
    </button>

    <ul id="taskList"></ul>

    <script src="app.js"></script>

</body>

</html>
```

------------------------------------------------------------------------

# `app.js`

``` javascript
// Application state
let tasks = [];

// DOM elements
const input =
    document.getElementById(
        "taskInput"
    );

const addBtn =
    document.getElementById(
        "addBtn"
    );

const list =
    document.getElementById(
        "taskList"
    );

// ES6 class
class Task {

    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.completed = false;
    }
}

// Render tasks
const renderTasks = () => {

    list.innerHTML = "";

    tasks.forEach(
        ({
            id,
            title,
            completed
        }) => {

            const li =
                document.createElement(
                    "li"
                );

            li.dataset.id = id;

            const span =
                document.createElement(
                    "span"
                );

            span.textContent =
                title;

            if (completed) {
                span.classList.add(
                    "done"
                );
            }

            const delBtn =
                document.createElement(
                    "button"
                );

            delBtn.textContent =
                "Delete";

            delBtn.classList.add(
                "delete-btn"
            );

            li.append(
                span,
                delBtn
            );

            list.appendChild(
                li
            );
        }
    );
};

// Add task
const addTask = () => {

    const title =
        input.value.trim();

    if (!title) {
        return;
    }

    tasks = [
        ...tasks,
        new Task(title)
    ];

    input.value = "";

    renderTasks();
};

// Add button
addBtn.addEventListener(
    "click",
    addTask
);

// Enter key
input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {
            addTask();
        }
    }
);

// Event delegation
list.addEventListener(
    "click",
    event => {

        const li =
            event.target.closest(
                "li"
            );

        if (!li) {
            return;
        }

        const id =
            Number(
                li.dataset.id
            );

        if (
            event.target
                .classList
                .contains(
                    "delete-btn"
                )
        ) {

            tasks =
                tasks.filter(
                    task =>
                        task.id
                        !== id
                );

            renderTasks();

        } else {

            tasks =
                tasks.map(
                    task =>
                        task.id === id
                            ? {
                                ...task,
                                completed:
                                    !task.completed
                            }
                            : task
                );

            renderTasks();
        }
    }
);
```

------------------------------------------------------------------------

# How the To-Do Application Works

## State

``` javascript
let tasks = [];
```

The array stores all task objects.

------------------------------------------------------------------------

## Task Class

``` javascript
class Task {
    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.completed = false;
    }
}
```

Each task contains:

  Property      Purpose
  ------------- ---------------------
  `id`          Identifies the task
  `title`       Stores task text
  `completed`   Tracks completion

------------------------------------------------------------------------

## Adding Tasks

The input is cleaned using:

``` javascript
input.value.trim();
```

Empty tasks are ignored.

A new task is added using spread syntax:

``` javascript
tasks = [
    ...tasks,
    new Task(title)
];
```

------------------------------------------------------------------------

## Rendering Tasks

`renderTasks()` rebuilds the displayed list.

It uses:

-   Array destructuring
-   `forEach()`
-   `createElement()`
-   `textContent`
-   `classList`
-   `append()`
-   `appendChild()`
-   `dataset`

------------------------------------------------------------------------

## Marking a Task Complete

Clicking a task updates its `completed` property.

``` javascript
tasks = tasks.map(
    task =>
        task.id === id
            ? {
                ...task,
                completed:
                    !task.completed
            }
            : task
);
```

The spread operator copies the original task while changing only
`completed`.

------------------------------------------------------------------------

## Deleting a Task

``` javascript
tasks = tasks.filter(
    task =>
        task.id !== id
);
```

The selected task is removed from the array.

------------------------------------------------------------------------

## Event Delegation

Only one click listener is attached to the list:

``` javascript
list.addEventListener(
    "click",
    event => {
        // Handle child clicks
    }
);
```

This works even though task elements are dynamically generated after the
page loads.

------------------------------------------------------------------------

# Concepts Used in the Practical Exercise

The practical application demonstrates:

-   `let`
-   `const`
-   Arrow functions
-   Destructuring
-   Spread operator
-   ES6 classes
-   DOM selection
-   DOM element creation
-   `classList`
-   `dataset`
-   Event listeners
-   Keyboard events
-   Event delegation
-   Array `map()`
-   Array `filter()`
-   Array `forEach()`

------------------------------------------------------------------------

# Summary Table

  -----------------------------------------------------------------------
  Topic                               Key Concepts
  ----------------------------------- -----------------------------------
  ES6                                 `let`, `const`, arrow functions,
                                      template literals, destructuring,
                                      spread/rest, classes, modules,
                                      promises

  DOM                                 `querySelector`, `createElement`,
                                      `appendChild`, `classList`,
                                      `style`, `innerHTML`, `textContent`

  Events                              `addEventListener`, event object,
                                      bubbling, `preventDefault`,
                                      `stopPropagation`, delegation
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Common Errors and Troubleshooting

## 1. Cannot Read Property of `null`

### Cause

JavaScript tries to select an element before the DOM has loaded.

### Fix

Place the script near the end of `<body>` or wait for
`DOMContentLoaded`.

``` javascript
document.addEventListener(
    "DOMContentLoaded",
    () => {
        // DOM code
    }
);
```

------------------------------------------------------------------------

## 2. Event Handler Does Not Fire

### Cause

The target element may not exist when the listener is attached.

### Fix

-   Wait for the DOM to load.
-   Use event delegation for dynamically created elements.

------------------------------------------------------------------------

## 3. `innerHTML` Does Not Update as Expected

### Cause

The selector may contain an incorrect ID, class, or tag name.

### Fix

Check the selector spelling.

Example:

``` javascript
document.getElementById(
    "correctId"
);
```

------------------------------------------------------------------------

## 4. Arrow Function `this` Issue

### Cause

Arrow functions do not create their own `this`.

### Fix

Use a regular function when dynamic `this` binding is required.

``` javascript
element.addEventListener(
    "click",
    function() {
        console.log(this);
    }
);
```

------------------------------------------------------------------------

## 5. Module Import Fails

### Cause

The script may not be declared as a module.

### Fix

``` html
<script
    type="module"
    src="main.js">
</script>
```

------------------------------------------------------------------------

# Testing Checklist

## ES6

-   Test `let` block scope.
-   Test `const` reassignment behavior.
-   Run arrow-function examples.
-   Test template literals.
-   Test array and object destructuring.
-   Test spread and rest syntax.
-   Create an ES6 class and subclass.
-   Test module imports/exports.
-   Test the Promise and `async/await` examples.

## DOM

-   Select an element by ID.
-   Select multiple elements.
-   Change `textContent`.
-   Change a CSS class.
-   Modify an attribute.
-   Create a new element.
-   Append it to the page.
-   Remove an element.
-   Navigate to parent, child, and sibling elements.

## Events

-   Test a click listener.
-   Test keyboard input.
-   Test a form submission with `preventDefault()`.
-   Observe event bubbling.
-   Test `stopPropagation()`.
-   Test event delegation.

## To-Do Application

-   Add a task using the Add button.
-   Add a task using Enter.
-   Try adding an empty task.
-   Click a task to mark it complete.
-   Click it again to mark it incomplete.
-   Delete a task.
-   Add several tasks and verify each one behaves independently.

------------------------------------------------------------------------

# Important Viva Questions

## 1. What is ES6?

ES6, also called ECMAScript 2015, is a major JavaScript standard update
that introduced features such as `let`, `const`, arrow functions,
classes, template literals, destructuring, modules, and promises.

## 2. Difference between `var`, `let`, and `const`?

`var` is function-scoped and can be redeclared. `let` is block-scoped
and supports reassignment. `const` is block-scoped and cannot be
reassigned.

## 3. What is an arrow function?

An arrow function is a shorter function syntax introduced in ES6.

``` javascript
const add =
    (a, b) => a + b;
```

## 4. What is special about `this` in an arrow function?

Arrow functions do not bind their own `this`. They inherit `this` from
the surrounding scope.

## 5. What are template literals?

Template literals are backtick-based strings that support interpolation
and multi-line content.

``` javascript
const message =
    `Hello ${name}`;
```

## 6. What is destructuring?

Destructuring extracts values from arrays or properties from objects
into separate variables.

## 7. Difference between spread and rest?

Spread expands values, while rest collects remaining values.

Both use `...`.

## 8. What is the DOM?

The DOM is the browser's tree-like programming representation of an HTML
document.

## 9. Difference between `querySelector()` and `querySelectorAll()`?

`querySelector()` returns the first matching element.
`querySelectorAll()` returns all matching elements as a NodeList.

## 10. Difference between `textContent` and `innerHTML`?

`textContent` handles text. `innerHTML` parses HTML markup.

## 11. Why can `innerHTML` be dangerous?

Using untrusted user data with `innerHTML` can introduce XSS
vulnerabilities.

## 12. What does `classList.toggle()` do?

It adds a class when it is absent and removes it when it is present.

## 13. What is an event?

An event is an occurrence such as a click, key press, input change, form
submission, load, or scroll.

## 14. Why is `addEventListener()` preferred?

It separates JavaScript from HTML and supports multiple listeners on the
same event.

## 15. What is the event object?

It contains information about an event, including the event type and
target element.

## 16. What does `preventDefault()` do?

It prevents the browser's default behavior for an event.

## 17. What does `stopPropagation()` do?

It prevents an event from continuing through the propagation chain.

## 18. What is event bubbling?

Event bubbling is the phase where an event moves from the target element
upward through its ancestors.

## 19. What is event delegation?

Event delegation attaches a listener to a parent and handles events
originating from its child elements.

## 20. Why is event delegation useful?

It works with dynamically created elements and reduces the number of
event listeners.

------------------------------------------------------------------------

# Key Learning Outcomes

After completing Experiment 07 & 08, the student should understand:

1.  Modern ES6 variable declarations.
2.  Arrow functions and lexical `this`.
3.  Template literals.
4.  Array and object destructuring.
5.  Spread and rest syntax.
6.  Default parameters.
7.  Classes and inheritance.
8.  JavaScript modules.
9.  Promises and `async/await`.
10. DOM selection and traversal.
11. Dynamic content and style modification.
12. Creating and removing DOM elements.
13. Browser events and event objects.
14. Keyboard and form events.
15. Event bubbling and propagation.
16. Event delegation.
17. How to combine ES6, DOM APIs, and events in an interactive
    application.

------------------------------------------------------------------------

# Conclusion

Experiment 07 & 08 introduces three essential areas of modern front-end
JavaScript: ES6, DOM manipulation, and event handling.

ES6 provides cleaner syntax and powerful language features such as
`let`, `const`, arrow functions, template literals, destructuring,
spread/rest operators, classes, modules, and asynchronous programming
tools.

The DOM allows JavaScript to dynamically select, create, modify,
traverse, and remove elements from a web page. Event handling allows the
application to respond to actions such as clicks, keyboard input, and
form submissions.

The interactive To-Do List combines these concepts into a practical
application. It uses an ES6 class for task objects, modern array
operations for state updates, DOM APIs for rendering, and event
delegation for handling dynamically generated elements.

These concepts form an important foundation for front-end web
development and prepare students for frameworks such as React, Vue, and
Angular.
