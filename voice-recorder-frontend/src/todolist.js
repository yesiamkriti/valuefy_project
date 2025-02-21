import React, { useState } from "react";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.container}>
      <h2>To-Do List</h2>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task..."
          style={styles.input}
        />
        <button onClick={addTask} style={styles.button}>Add</button>
      </div>
      <ul style={styles.list}>
        {tasks.map((t, index) => (
          <li key={index} style={styles.listItem}>
            {t}
            <button onClick={() => removeTask(index)} style={styles.deleteButton}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "300px",
    margin: "auto",
    padding: "20px",
    border: "2px solid #ccc",
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    backgroundColor: "#0275d8",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "10px"
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "5px"
  },
  deleteButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    cursor: "pointer"
  }
};

export default ToDoList;
