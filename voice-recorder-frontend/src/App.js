import React from 'react';
import Recorder from './Components/Recorder.js';
import ToDoList from './Components/todolist.js';
function App() {
  return (
    <div style={styles.container}>
      {/* Left Side - Recorder */}
      <div style={styles.recorderSection}>
        <Recorder />
      </div>

      {/* Right Side - To-Do List */}
      <div style={styles.todoSection}>
        <ToDoList />
      </div>
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "30px",
    padding: "20px",
    maxWidth: "900px",
    margin: "auto",
  },
  recorderSection: {
    flex: 1,
    minWidth: "300px",
  },
  todoSection: {
    flex: 1.5,
    minWidth: "400px",
  },
};
export default App;
