
let tasks = [];

// Select HTML elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

// Create Task class
class Task {
    constructor(title) {
        this.id = Date.now();
        this.title = title;
        this.completed = false;
    }
}

// Display all tasks
const renderTasks = () => {
    list.innerHTML = "";

    tasks.forEach(({ id, title, completed }) => {
        const li = document.createElement("li");
        li.dataset.id = id;

        const span = document.createElement("span");
        span.textContent = title;

        if (completed) {
            span.classList.add("done");
        }

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.classList.add("delete-btn");

        li.append(span, delBtn);
        list.appendChild(li);
    });
};

// Add a new task
const addTask = () => {
    const title = input.value.trim();

    if (!title) {
        alert("Please enter a task!");
        return;
    }

    tasks = [...tasks, new Task(title)];

    input.value = "";
    renderTasks();
};

// Click the Add button
addBtn.addEventListener("click", addTask);

// Press Enter to add a task
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Handle completion and deletion
list.addEventListener("click", (event) => {
    const li = event.target.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== id);
    } else {
        tasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        );
    }

    renderTasks();
});
