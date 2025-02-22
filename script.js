const { createClient } = window.supabase;
const SUPABASE_URL = "https://vjhvmqdjrrkzmipmpzlw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaHZtcWRqcnJrem1pcG1wemx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NjQwOTMsImV4cCI6MjA1MTQ0MDA5M30.KeHronGAYRKkWndK1Iv9X5YD8l-uRkl-Llj6jg1lwd4";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let user = null; // ✅ Initialize user as null

document.addEventListener("DOMContentLoaded", async function () {
    const taskInput = document.getElementById("task-input");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    const todoContainer = document.querySelector(".todo-container"); // Container for tasks


    if (data.session) {
        user = data.session.user; // ✅ Corrected
        updateUI();
        loadTasks(user.id);
    }

    function updateUI() {
        if (user) {
            todoContainer.style.display = "block"; // ✅ Show to-do list when logged in
        } else {
            todoContainer.style.display = "none";  // ✅ Hide to-do list when logged out
        }
    }
    

    async function checkUser() {
        const { data, error } = await supabaseClient.auth.getSession();
        
        if (error) {
            console.error("Error checking session:", error);
            user = null;  // ✅ Explicitly set user to null
            updateUI();   // ✅ Call updateUI() only after user is set
            return;
        }
    
        if (data.session) {
            user = data.session.user;  // ✅ Ensure user is assigned before calling updateUI()
            await loadTasks(user.id);
        } else {
            user = null;  // ✅ Explicitly set to null if not logged in
        }
    
        updateUI();  // ✅ Now it's safe to call updateUI()
    }
    


    loginButton.addEventListener("click", async () => {
        const email = prompt("Enter email:");
        const password = prompt("Enter password:");

        if (!email || !password) return alert("Email and password required!");

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("Login failed: " + error.message);
        } else {
            user = data.user; // Fix: user data comes from `data.session`
            updateUI();
            loadTasks(user.id);
        }
    });

    logoutButton.addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        taskList.innerHTML = "";
        user = null;
        updateUI();
    });

    async function loadTasks(userId) {
        const { data: tasks, error } = await supabaseClient.from("todos").select("*").eq("user_id", userId);
        if (error) {
            console.error("Error fetching tasks:", error);
            return;
        }

        taskList.innerHTML = ""; // Clear list before adding new tasks
        tasks.forEach(task => displayTask(task));
    }

    addTaskButton.addEventListener("click", async function () {
        if (!user) return alert("Please log in first!");

        const taskText = taskInput.value.trim();
        if (taskText === "") return;

        const { data, error } = await supabaseClient.from("todos").insert([{ 
            user_id: user.id, 
            task: taskText, 
            completed: false 
        }]).select();

        if (!error) {
            displayTask(data[0]);
            taskInput.value = "";
        }
    });

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

    updateUI(); // Run UI update on load
});