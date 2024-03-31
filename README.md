# Task Board Application

This is a simple task board application built to help project teams manage project tasks effectively. The application allows users to add individual project tasks, manage their state of progress, and track overall project progress. It features dynamically updated HTML and CSS powered by jQuery and uses the Day.js library to work with dates.

## Getting Started

To use the task board application, simply open the HTML file in a web browser. You can interact with the task board to add new tasks, update their status, and delete tasks as needed.

![Task board page](develop/images/Task-board-page.png)

## Features

Task Management: Add individual project tasks with a title, description, and deadline date.
Task Progress: View tasks in columns representing their progress state (Not Yet Started, In Progress, Completed).
Deadline Alerts: Tasks are color-coded to indicate whether they are nearing the deadline (yellow) or overdue (red).
Drag-and-Drop: Easily update the progress state of tasks by dragging them between columns.
Persistence: Tasks are saved in localStorage, so they persist even after refreshing the page.

## Usage

Adding a New Task:

Click the "Add Task" button to open a modal dialog.
Enter the title, description, and deadline date for the new task.
Click the "Save" button to add the task to the task board.
Updating Task Status:

![Add task](develop/images/adding-ask.png)

Drag a task card from one column to another to update its progress state.
Tasks will stay in the new column after refreshing the page.

![tasks](develop/images/task-around-columns.png)
Deleting a Task:

Click the "Delete" button on a task card to remove it from the task board.
Deleted tasks will not be added back after refreshing the page.

## Technologies Used

HTML
CSS (Bootstrap)
JavaScript (jQuery)
Day.js library

## Acknowledgments

The task board application was created based on the requirements provided as part of a coding challenge assignment. It serves as a simple yet effective tool for managing project tasks in a collaborative environment.
