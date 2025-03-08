import React, { useState, useEffect } from "react";
import "./todolist.css"; // Import the CSS file

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [suggestedTasks, setSuggestedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchSuggestedTasks();
  }, []);

  const fetchSuggestedTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      if (data && data.tasks.length > 0) {
        setSuggestedTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = () => {
    if (selectedTask) {
      setTasks([...tasks, selectedTask]);
      setSuggestedTasks(suggestedTasks.filter(task => task !== selectedTask));
      setSelectedTask(null);
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h2>To-Do List</h2>

      <div className="suggestion-container">
        <h4>Suggested Task:</h4>
        {suggestedTasks.length > 0 ? (
          <select
            value={selectedTask || ""}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="select"
          >
            <option value="" disabled>Select a task</option>
            {suggestedTasks.map((suggestedTask, index) => (
              <option key={index} value={suggestedTask}>
                {suggestedTask}
              </option>
            ))}
          </select>
        ) : (
          <p className="no-suggestions">No suggestions available.</p>
        )}
        <button onClick={addTask} className="add-button" disabled={!selectedTask}>
          ➕ Add Selected Task
        </button>
      </div>

      <ul className="list">
        {tasks.map((t, index) => (
          <li key={index} className="list-item">
            {t}
            <button onClick={() => removeTask(index)} className="delete-button">
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
