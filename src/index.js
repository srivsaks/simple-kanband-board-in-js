import "./styles.css";

let tasks = [];

class Task {
  constructor(id, content, title) {
    this.id = id;
    this.content = content;
    this.title = title;
    this.status = "TODO";
  }
}

const container = document.querySelector(".container");
const toDOContainer = document.querySelector(".to-do-wrapper");
const progressContainer = document.querySelector(".progress-wrapper");
const doneContainer = document.querySelector(".done-wrapper");

function onDragStart() {}

function createTaskElement(item) {
  const div = document.createElement("div");
  div.textContent = item.content;
  div.classList.add("task");
  div.setAttribute("taskId", item.id);
  div.draggable = true;
  div.addEventListener("dragstart", (e) => {
    console.log(e);
    e.dataTransfer.setData("data", item.id);
  });
  return div;
}

function loadTasks() {
  toDOContainer.innerHTML = `TO-DO
  <div class="create-task-wrapper">
    <button class="create-task-btn">Create task</button>
  </div>`;
  progressContainer.innerHTML = `In Progress`;
  doneContainer.innerHTML = `Done`;

  //localStorage.removeItem("tasks");
  const tasksArrJSON = localStorage.getItem("tasks");
  if (!tasksArrJSON) return;
  const tasksArr = JSON.parse(tasksArrJSON).key;
  tasksArr.forEach((item) => {
    const div = createTaskElement(item);
    if (item.status === "TODO") toDOContainer.appendChild(div);
    else if (item.status === "Progress") progressContainer.appendChild(div);
    else doneContainer.appendChild(div);
  });
  tasks = JSON.parse(tasksArrJSON).key;
}

function storeTasks() {
  localStorage.setItem("tasks", JSON.stringify({ key: tasks }));
  //localStorage.setItem("progress", JSON.stringify({ key: progressTasks }));
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("create-task-btn")) {
    // create a new task
    const newTask = new Task(
      new Date().getTime(),
      `Task Number ${tasks.length}`,
      `task ${tasks.length}`
    );
    tasks.push(newTask);
    storeTasks();

    const div = createTaskElement(newTask);
    toDOContainer.appendChild(div);
  }
});

document.addEventListener("DOMContentLoaded", loadTasks());

progressContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

toDOContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

doneContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

progressContainer.addEventListener("drop", (e) => {
  const curr = e.currentTarget;
  const id = e.dataTransfer.getData("data");
  console.log(e.dataTransfer.getData("data"), curr);

  //const newTasks = JSON.parse(JSON.stringify(tasks));
  const newTasks = tasks.map((task) => {
    if (parseInt(task.id) !== parseInt(id)) {
      return task;
    } else {
      return {
        ...task,
        status: "Progress"
      };
    }
  });

  tasks = newTasks;
  //progressTasks = newProgressTasks;
  storeTasks();
  loadTasks();
  //curr.appendChild(ele);
});

toDOContainer.addEventListener("drop", (e) => {
  console.log("hey");
  const curr = e.currentTarget;
  const id = e.dataTransfer.getData("data");
  console.log(e.dataTransfer.getData("data"), curr);

  //const newTasks = JSON.parse(JSON.stringify(tasks));
  const newTasks = tasks.map((task) => {
    if (parseInt(task.id) !== parseInt(id)) {
      return task;
    } else {
      return {
        ...task,
        status: "TODO"
      };
    }
  });

  tasks = newTasks;
  storeTasks();
  loadTasks();
});

doneContainer.addEventListener("drop", (e) => {
  const curr = e.currentTarget;
  const id = e.dataTransfer.getData("data");
  console.log(e.dataTransfer.getData("data"), curr);

  //const newTasks = JSON.parse(JSON.stringify(tasks));
  const newTasks = tasks.map((task) => {
    if (parseInt(task.id) !== parseInt(id)) {
      return task;
    } else {
      return {
        ...task,
        status: "Done"
      };
    }
  });

  tasks = newTasks;
  storeTasks();
  loadTasks();
});
