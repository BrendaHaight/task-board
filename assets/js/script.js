// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  const id = nextId;
  nextId++;
  localStorage.setItem("nextId", nextId);
  return id;
}

// Function to create a task card
function createTaskCard(task) {
  let colorClass = ""; // Define colorClass variable

  // Check if deadline exists and the task is not marked as "done"
  if (task.status !== "done") {
    const today = dayjs();
    const deadline = dayjs(task.deadline, "DD/MM/YYYY");

    if (today.isSame(deadline, "day")) {
      colorClass = "bg-warning text-white"; // Set colorClass for today's deadline
    } else if (today.isAfter(deadline)) {
      colorClass = "bg-danger text-white"; // Set colorClass for overdue tasks
    }
  }

  // Create task card HTML
  const taskCard = `
    <div class="task-card ${colorClass}" id="task-${task.id}">
      <div class="card-header">${task.title}</div>
      <div class="card-body">
        <p>${task.description}</p>
        <p>Deadline: ${task.deadline}</p>
      </div>
      <button class="btn btn-danger delete-task" data-task-id="${task.id}">Delete</button>
    </div>
  `;

  return taskCard;
}

// Function to render the task list
function renderTaskList() {
  // Clear existing tasks in each column
  $("#todo-cards").empty();
  $("#in-progress-cards").empty();
  $("#done-cards").empty();

  // Render tasks in corresponding columns
  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    console.log(task.status);
    if (task.status == "to-do") {
      $("#todo-cards").append(taskCard);
    } else if (task.status == "done") {
      $("#done-cards").append(taskCard);
    } else {
      $("#in-progress-cards").append(taskCard);
    }
  });

  // Bind delete event to new tasks
  $(".delete-task").click(handleDeleteTask);

  // Make task cards draggable
  $(".task-card").draggable({
    revert: "invalid",
    containment: ".container",
    stack: ".task-card",
    drag: function (event, ui) {
      if ($(this).closest(".lane").attr("id") === "done") {
        $(this).removeClass("bg-danger bg-warning").addClass("bg-light");
      }
    },
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = $("#taskTitle").val();
  const description = $("#taskDescription").val();
  const deadline = $("#taskDeadline").val();
  const status = "to-do"; // Adjust if your status IDs differ
  const id = generateTaskId();
  console.log("Generate", id);
  // Add new task to the task list
  taskList.push({ id, title, description, deadline, status });

  // Store updated task list in localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render updated task list
  renderTaskList();
  $("#formModal").modal("hide");
}

// Function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).data("task-id");
  taskList = taskList.filter(task => task.id !== taskId);

  // Update task list in localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render updated task list
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr("id").split("-")[1];
  const newStatus = $(this).closest(".lane").attr("id");
  const taskIndex = taskList.findIndex(task => task.id == taskId);
  taskList[taskIndex].status = newStatus;

  // Remove color classes when task is dropped into "Done" column
  if (newStatus === "done") {
    ui.draggable.removeClass("bg-danger bg-warning").addClass("bg-light");
  }

  // Update task list in localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));

  // Render updated task list
  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList(); // Initial render of the task list

  // Event listener for form submission to add a new task
  $("#taskForm").submit(handleAddTask);

  // Make task lanes droppable
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
  });
});
