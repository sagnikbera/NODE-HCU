```js
// task-manager-commented.js
// A small CLI task manager that saves tasks to a local JSON file (tasks.json).
// This file is your original code with detailed inline comments explaining each
// line, behavior, edge-cases, and suggestions for improvements.

// -----------------------------
// Usage examples (from terminal):
//   node todo.js add "Buy milk"
//   node todo.js list
//   node todo.js remove 2
// Notes:
// - process.argv[3] only captures a single argument token. If you want to accept
//   multi-word task descriptions without quoting, you'll need to join process.argv.slice(3).
// - This script uses synchronous file I/O (fs.readFileSync / fs.writeFileSync).
//   That's fine for small CLI tools, but for larger apps prefer the async API.
// -----------------------------

const fs = require("fs");
const filePath = "./tasks.json"; // relative path where tasks will be stored

/*
 * loadTasks()
 * - Purpose: read tasks.json and return an array of tasks.
 * - Returns: an array ([]) when the file doesn't exist or when any error occurs.
 * - Important: JSON.parse will throw if the file exists but contains invalid JSON.
 *   That error is caught and we fall back to returning an empty array so the app
 *   can continue to function.
 */
const loadTasks = () => {
  try {
    // Read file as a Buffer. Alternative: fs.readFileSync(filePath, 'utf8') to get a string directly.
    const dataBuffer = fs.readFileSync(filePath);

    // Convert Buffer -> string (JSON text)
    const dataJSON = dataBuffer.toString();

    // Convert JSON string -> JavaScript array/object and return it
    return JSON.parse(dataJSON);
  } catch (error) {
    // Any error (file not found, invalid JSON, permission issue...) -> return an empty list
    // Returning [] keeps the rest of the code simple: callers assume an array.
    return [];
  }
};

/*
 * saveTasks(task)
 * - Purpose: overwrite tasks.json with the new tasks array.
 * - Parameter name `task` is a little misleading: it is actually the whole tasks array.
 * - Suggestion: use JSON.stringify(task, null, 2) to write nicely formatted JSON.
 * - Note: Using fs.writeFileSync can overwrite the file atomically on most platforms,
 *   but for extra safety you could write to a temporary file and then rename it.
 */
const saveTasks = (task) => {
  // Convert JS value (usually an array) to a JSON string.
  const dataJSON = JSON.stringify(task);

  // Overwrite the file synchronously. If an error occurs, it will throw.
  fs.writeFileSync(filePath, dataJSON);

  // This console message logs the whole array (not only the newly added task).
  // Consider changing the message to be more descriptive, e.g. "Tasks updated".
  console.log("Task Added ", task);
};

/*
 * addTask(task)
 * - Purpose: add a single task to the stored tasks array.
 * - Behavior: wraps the provided string in an object { task: "..." } and pushes it.
 * - Edge cases: if `task` is undefined (e.g. user forgot to pass an argument),
 *   this will add { task: undefined } to the file. It's good to validate input.
 */
const addTask = (task) => {
  const tasks = loadTasks(); // read current tasks (array)

  // We store each task as an object. This makes it easy to extend later
  // (e.g., add completed:true, createdAt, id, etc.).
  tasks.push({ task });

  // Save the updated array back to disk
  saveTasks(tasks);
};

/*
 * listTask()
 * - Purpose: print all tasks to the console in a numbered list.
 * - Notes: If tasks is empty, this will simply do nothing. You could
 *   print a friendly message like "No tasks found" if desired.
 */
const listTask = () => {
  const tasks = loadTasks();

  // Iterate over the array and print each task with a 1-based index.
  // Access the text via task.task because each entry is stored as { task: "..." }.
  tasks.forEach((task, index) => {
    console.log(`${index + 1} - ${task.task}`);
  });
};

/*
 * removeTask(index)
 * - Purpose: remove a task by its 1-based index (friendly for users).
 * - Behavior: validate the index, remove the correct item using splice,
 *   then save the updated array and print a confirmation.
 * - Important: parseInt(...) should be validated by the caller. If NaN is
 *   passed here, the check (index < 1 || index > tasks.length) will also
 *   evaluate unexpectedly because NaN comparisons are always false; you should
 *   explicitly check Number.isInteger(index) when parsing input from CLI.
 */
const removeTask = (index) => {
  const tasks = loadTasks();

  // Validate index (1-based). If invalid, inform the user and return early.
  if (index < 1 || index > tasks.length) {
    console.log("Invalid task number!");
    return;
  }

  // Remove the requested task and capture the removed item
  const removed = tasks.splice(index - 1, 1);

  // Save the modified list back to disk
  saveTasks(tasks);

  // removed is an array of removed elements; we removed exactly one element,
  // so removed[0] holds the object we deleted (e.g. { task: "Buy milk" }).
  console.log(`Removed task: ${removed[0].task}`);
};

// ===================== CLI HANDLER =====================
// process.argv contains command-line arguments:
//   [0] node path, [1] script path, [2] command, [3] argument
const command = process.argv[2];
const argument = process.argv[3];

// Dispatch based on the command value
if (command === "add") {
  // If you want to accept multi-word task descriptions without requiring
  // quotes, use: const argument = process.argv.slice(3).join(' ')
  addTask(argument);
} else if (command === "list") {
  listTask();
} else if (command === "remove") {
  // parseInt will return NaN if argument is not a number. It's better to
  // validate before calling removeTask, e.g.:
  // const idx = parseInt(argument, 10);
  // if (!Number.isInteger(idx)) { console.log('Please provide a task number'); return }
  removeTask(parseInt(argument));
} else {
  console.log("Command not found");
}

/*
 * Suggestions / improvements you may consider:
 * 1. Input validation: make sure `argument` is provided for add/remove and
 *    that remove receives a valid integer.
 * 2. Pretty JSON output: use JSON.stringify(tasks, null, 2) to make tasks.json readable.
 * 3. Better messages: change saveTasks console.log to 'Tasks updated' instead of 'Task Added'.
 * 4. Use synchronous I/O only for small tools. For performance and better UX
 *    in larger apps, use fs.promises with async/await.
 * 5. Handle concurrent writes: if multiple processes may write to tasks.json,
 *    consider atomic write techniques (write to tmp file then rename).
 * 6. Add unique IDs to tasks to allow removal by id (safer than index-based removal).
 */
```