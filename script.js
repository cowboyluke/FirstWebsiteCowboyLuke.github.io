document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    addTaskButton.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");

        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskText;
        taskItem.appendChild(taskSpan);

        const completeButton = document.createElement("button");
        completeButton.textContent = "✔";
        completeButton.classList.add("complete-btn");
        completeButton.addEventListener("click", function () {
            taskItem.classList.toggle("completed");
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "✖";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", function () {
            taskItem.remove();
        });

        taskItem.appendChild(completeButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        taskInput.value = "";
    });
});
