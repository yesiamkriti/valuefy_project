import React from "react";
import Recorder from "./Components/Recorder.js";
import ToDoList from "./Components/todolist.js";
import "./App.css"; // Import the CSS file

function App() {
  return (
    <div className="app-container">
      {/* Left Side - Recorder */}
      <div className="recorder-section">
        <Recorder />
      </div>

      {/* Right Side - To-Do List */}
      <div className="todo-section">
        <ToDoList />
      </div>
    </div>
  );
}

export default App;
