/* Custom Dragula JS */
const drake = dragula([
  document.getElementById("to-do"),
  document.getElementById("doing"),
  document.getElementById("done"),
  document.getElementById("trash"),
], {
  removeOnSpill: false,  // Correctly include this option in the configuration
});

drake.on("drag", function (el) {
  el.classList.remove("ex-moved"); // Corrected class name removal
}).on("drop", function (el) {
  el.classList.add("ex-moved"); // Corrected class name addition
}).on("over", function (el, container) {
  container.classList.add("ex-over"); // Corrected class name addition
}).on("out", function (el, container) {
  container.classList.remove("ex-over"); // Corrected class name removal
});

// Additional drop logic for handling trash actions
drake.on("drop", function (el, target) {
  if (target.id === "trash") {
    // When a task is dropped into the trash, remove it from local storage
    const taskText = el.textContent; // Get the text content of the dropped item
    removeTaskFromLocalStorage(taskText); // Remove the task from local storage
  }
});

// Load stored tasks from local storage and render them
function load() {
  let storedTasks = localStorage.getItem('items'); // Retrieve stored tasks
  if (storedTasks) {
    try {
      storedTasks = JSON.parse(storedTasks); // Parse JSON string into an object
      if (!Array.isArray(storedTasks)) throw new Error(); // Ensure it's an array
    } catch (error) {
      console.error('Error parsing stored tasks:', error);  // Log parsing errors
      storedTasks = []; // Fallback to an empty array if error occurs
    }
  } else {
    storedTasks = []; // Initialize as empty if no tasks found
  }

  // Render each stored task in the 'To-Do' column
  storedTasks.forEach(element => {
    const listItem = document.createElement('li'); // Create a new list item
    listItem.classList.add('task'); // Add class for styling if needed
    listItem.textContent = element; // Set the text content to the task
    document.getElementById('to-do').appendChild(listItem); // Use appendChild instead of innerHTML
  });
}

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
  const listItem = document.createElement('li'); // Create a new list item
  listItem.classList.add('task'); // Add class for styling if needed
  listItem.textContent = inputTask; // Set the text content to the input task
  document.getElementById('to-do').appendChild(listItem); // Append to the 'To-Do' list

  // Clear input field after adding task
  document.getElementById("taskText").value = "";

  // Store the new task in localStorage
  let storedTasks = localStorage.getItem('items');

  if (storedTasks) {
    try {
      storedTasks = JSON.parse(storedTasks); // Parse it
      if (!Array.isArray(storedTasks)) throw new Error(); // Ensure it's an array
    } catch (error) {
      console.error('Error parsing stored tasks:', error); // Log parsing errors
      storedTasks = []; // Fallback to an empty array if error occurs
    }
  } else {
    storedTasks = []; // Initialize as empty if no tasks found
  }

  // Check if the task already exists to avoid duplicates
  if (!storedTasks.includes(inputTask)) {
    storedTasks.push(inputTask); // Add the new task to the array
    localStorage.setItem('items', JSON.stringify(storedTasks)); // Update local storage
    console.log('Stored tasks after adding new task:', storedTasks); // Debugging log
  }
}


/* Vanilla JS to delete tasks in 'Trash' column */
function emptyTrash() {
  /* Clear tasks from 'Trash' column */
  document.getElementById("trash").innerHTML = "";
}

// Function to remove a specific task from localStorage
function removeTaskFromLocalStorage(taskText) {
  let storedTasks = localStorage.getItem('items'); // Retrieve stored tasks

  if (storedTasks) {
    try {
      storedTasks = JSON.parse(storedTasks); // Parse JSON string into an object
      if (!Array.isArray(storedTasks)) throw new Error(); // Ensure it's an array
    } catch (error) {
      console.error("Error parsing stored tasks: ", error); // Log parsing errors
      storedTasks = []; // Fallback to an empty array if error occurs
    }
  } else {
    storedTasks = []; // Initialize as empty if no tasks found
  }

  // Filter out the task to be removed
  storedTasks = storedTasks.filter(task => task !== taskText); // Remove the specified task
  localStorage.setItem('items', JSON.stringify(storedTasks)); // Update local storage with the filtered tasks
}

// Load tasks when the window is loaded
window.addEventListener('load', load);