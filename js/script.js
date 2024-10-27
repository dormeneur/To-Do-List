/* Setup DexieDB */
const db = new Dexie("todoList");
db.version(1).stores({ todos: "++id,title,state" });

const alert = document.getElementById("alert");

/* Custom Dragula JS */
dragula(
  [
    document.getElementById("to-do"),
    document.getElementById("doing"),
    document.getElementById("done"),
    document.getElementById("trash"),
  ],
  { removeOnSpill: false }
)
  .on("drag", function (el) {
    el.className = el.className.replace("ex-moved", "");
  })
  .on("drop", function (el, targetContainer) {
    const draggedElement = el.id;
    const containerId = targetContainer.id;

    db.todos
      .update(+draggedElement, { state: containerId })
      .then(function (updated) {
        if (updated) {
          alert.innerHTML = "State changed";
          alert.style.display = "block";

          setTimeout(() => {
            alert.style.display = "none";
          }, 3000);
        } else {
          alert.innerHTML = "Failed to update todo";
          alert.style.display = "block";

          setTimeout(() => {
            alert.style.display = "none";
          }, 3000);
        }
      })
      .catch(function (error) {
        alert.innerHTML = `Error updating todo: ${error}`;
        alert.style.display = "block";

        setTimeout(() => {
          alert.style.display = "none";
        }, 3000);
      });

    el.className += " ex-moved";
  })
  .on("over", function (el, container) {
    container.className += " ex-over";
  })
  .on("out", function (el, container) {
    container.className = container.className.replace("ex-over", "");
  });

const populateTodos = async () => {
  const allTodos = await db.todos.reverse().toArray();

  allTodos.forEach((todo) => {
    const todoElement = `
      <li class='task' id='${todo.id}'><p>${todo.inputTask}</p></li>
    `;

    if (todo.state === "to-do") {
      document.getElementById("to-do").innerHTML += todoElement;
    } else if (todo.state === "doing") {
      document.getElementById("doing").innerHTML += todoElement;
    } else if (todo.state === "done") {
      document.getElementById("done").innerHTML += todoElement;
    } else if (todo.state === "trash") {
      document.getElementById("trash").innerHTML += todoElement;
    }
  });
};

window.onload = populateTodos;

/* Vanilla JS to add a new task */
async function addTask() {
  const inputTask = document.getElementById("taskText").value.trim();

  // Validation: Prevent empty tasks
  if (!inputTask) {
    alert.innerHTML = "Task cannot be empty!";
    alert.style.display = "block";

    setTimeout(() => {
      alert.style.display = "none";
    }, 3000);

    return;
  }

  const state = "to-do";

  await db.todos.add({ inputTask, state });

  // Add task to the 'To-Do' column
  const taskElement = "<li class='task'><p>" + inputTask + "</p></li>";
  document.getElementById("to-do").innerHTML += taskElement;

  // Clear input field after adding task
  document.getElementById("taskText").value = "";
}

/* Vanilla JS to delete tasks in 'Trash' column */
async function emptyTrash() {
  const allTodos = await db.todos.reverse().toArray();

  allTodos.forEach((todo) => {
    if (todo.state === "trash") {
      db.todos.delete(todo.id);
    }
  });
  /* Clear tasks from 'Trash' column */
  document.getElementById("trash").innerHTML = "";
}
