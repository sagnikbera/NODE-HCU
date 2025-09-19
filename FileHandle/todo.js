const fs = require("fs");
const filePath = "./tasks.json";

const loadTasks = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

const saveTasks = (task) => {
  const dataJSON = JSON.stringify(task);
  fs.writeFileSync(filePath, dataJSON);
  console.log("Task Added ", task);
};

const addTask = (task) => {
  const tasks = loadTasks();
  tasks.push({ task });
  saveTasks(tasks);
};

const listTask = () => {
  const tasks = loadTasks();
  tasks.forEach((task, index) => {
    console.log(`${index + 1} - ${task.task}`);
  });
};

const removeTask = (index) => {
  const tasks = loadTasks();

  if (index < 1 || index > tasks.length) {
    console.log("Invalid task number!");
    return;
  }

  const removed = tasks.splice(index - 1, 1);
  saveTasks(tasks);
  console.log(`Removed task: ${removed[0].task}`);
};

const command = process.argv[2];
const argument = process.argv[3];

if (command === "add") {
  addTask(argument);
} else if (command === "list") {
  listTask();
} else if (command === "remove") {
  removeTask(parseInt(argument));
} else {
  console.log("Command not found");
}
