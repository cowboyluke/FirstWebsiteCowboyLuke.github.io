const { createClient } = supabase;
const SUPABASE_URL = "https://vjhvmqdjrrkzmipmpzlw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaHZtcWRqcnJrem1pcG1wemx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NjQwOTMsImV4cCI6MjA1MTQ0MDA5M30.KeHronGAYRKkWndK1Iv9X5YD8l-uRkl-Llj6jg1lwd4";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async function () {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    
    let user = await checkUser();

    // Check if user is logged in
    async function checkUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            loadTasks(user.id);
            return user;
        }
        return null;
    }

    // Sign In (for demo, uses a hardcoded email/password)
    loginButton.addEventListener("click", async () => {
        const { error, data } = await supabaseClient.auth.signInWithPassword({
            email: "user@example.com",
            password: "password123",
        });
        if (error) {
            alert("Login failed");
        } else {
            user = data.user;
            loadTasks(user.id);
        }
    });

    // Logout
    logoutButton.addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        taskList.innerHTML = "";
        user = null;
    });

    // Load Tasks from Supabase
    async function loadTasks(userId) {
        const { data: tasks, error } = await supabaseClient.from("todos").select("*").eq("user_id", userId);
        if (tasks) {
            taskList.innerHTML = "";
            tasks.forEach(task => displayTask(task));
        }
    }

    // Add Task
    addTaskButton.addEventListener("click", async function () {
        if (!user) return alert("Please log in first!");

        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const { data, error } = await supabaseClient.from("todos").insert([{ 
            user_id: user.id, 
            task: taskText, 
            completed: false 
        }]);

        if (!error) {
            displayTask(data[0]);
            taskInput.value = "";
        }
    });

    // Display Task
    function displayTask(task) {
        const taskItem = document.createElement("li");
        taskItem.textContent = task.task;
        taskItem.classList.add("task-item");
        if (task.completed) taskItem.classList.add("completed");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "✖";
        deleteButton.addEventListener("click", async () => {
            await supabaseClient.from("todos").delete().eq("id", task.id);
            taskItem.remove();
        });

        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
    }
});

