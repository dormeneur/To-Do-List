/* Custom Dragula JS */
dragula([
  document.getElementById("to-do"),
  document.getElementById("doing"),
  document.getElementById("done"),
  document.getElementById("trash"),
]);
removeOnSpill: false
  .on("drag", function (el) {
    el.className.replace("ex-moved", "");
  })
  .on("drop", function (el) {
    el.className += "ex-moved";
  })
  .on("over", function (el, container) {
    container.className += "ex-over";
  })
  .on("out", function (el, container) {
    container.className.replace("ex-over", "");
  });

/* Vanilla JS to add a new task */
function addTask() {
  const inputTask = document.getElementById("taskText").value.trim();
  const alert = document.getElementById("alert");

  // Validation: Prevent empty tasks
  if (!inputTask) {
    alert.innerHTML = "Task cannot be empty!";
    alert.style.display = "block";

    setTimeout(() => {
      alert.style.display = "none";
    }, 3000);

    return;
  }

  // Add task to the 'To-Do' column
  const taskElement = "<li class='task'><p>" + inputTask + "</p></li>";
  document.getElementById("to-do").innerHTML += taskElement;

  // Clear input field after adding task
  document.getElementById("taskText").value = "";
}

/* Vanilla JS to delete tasks in 'Trash' column */
function emptyTrash() {
  /* Clear tasks from 'Trash' column */
  document.getElementById("trash").innerHTML = "";
}
