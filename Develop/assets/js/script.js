$(document).ready(function () {
  // Initialize or retrieve tasks and nextId from localStorage
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
    const today = dayjs();
    const deadline = dayjs(task.deadline);
    let colorClass = "";

    if (deadline.isBefore(today, "day")) {
      colorClass = "bg-danger";
    } else if (deadline.isSame(today, "day")) {
      colorClass = "bg-warning";
    }

    return `
      <div class="task-card ${colorClass}" id="task-${task.id}">
        <div class="card-header">${task.title}</div>
        <div class="card-body">
          <p>${task.description}</p>
          <p>Deadline: ${task.deadline}</p>
        </div>
        <button class="btn btn-danger delete-task" data-task-id="${task.id}">Delete</button>
      </div>
    `;
  }

  // Function to render the task list
  function renderTaskList() {
    // Clear existing tasks in each column
    $("#to-do .card-body").empty();
    $("#in-progress .card-body").empty();
    $("#done .card-body").empty();

    // Render tasks in corresponding columns
    taskList.forEach(task => {
      const taskCard = createTaskCard(task);
      $(`#${task.status} .card-body`).append(taskCard);
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

    // Add new task to the task list
    const newTask = { id, title, description, deadline, status };
    taskList.push(newTask);

    // Store updated task list in localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);

    // Render updated task list
    renderTaskList();
    $("#formModal").modal("hide");
  }

  // Function to handle deleting a task
  function handleDeleteTask() {
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

  // Event listener for form submission to add a new task
  $("#taskForm").submit(handleAddTask);

  // Make task lanes droppable
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
  });

  // Initial render of the task list
  renderTaskList();
});
