

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // external CSS

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("All"); // All/Active/Completed

  // Fetch tasks when page loads
  useEffect(() => {
    fetchTodos();
  }, []);

  // Get all todos from backend
  const fetchTodos = () => {
    axios.get("http://127.0.0.1:5000/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  };

  // Add new todo
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return; // ignore empty
    axios.post("http://127.0.0.1:5000/todos", { title })
      .then(() => {
        setTitle("");
        fetchTodos();
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Error adding task");
      });
  };

  // Toggle complete/incomplete
  const toggleTodo = (id) => {
    axios.put(`http://127.0.0.1:5000/todos/${id}`)
      .then(() => fetchTodos())
      .catch((err) => {
        alert(err.response?.data?.error || "Error toggling task");
      });
  };

  // Delete task
  const deleteTodo = (id) => {
    axios.delete(`http://127.0.0.1:5000/todos/${id}`)
      .then((res) => {
        alert(res.data.message || "Deleted");
        fetchTodos();
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Error deleting task");
      });
  };

  // Apply filter
  const filteredTodos = todos.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  return (
    <div className="app">
      <h2 className="heading">Todo App</h2>

      {/* Add form */}
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
        />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>

      {/* Filters */}
      <div className="filters">
        <button
          className={filter === "All" ? "active" : ""}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={filter === "Active" ? "active" : ""}
          onClick={() => setFilter("Active")}
        >
          Active
        </button>
        <button
          className={filter === "Completed" ? "active" : ""}
          onClick={() => setFilter("Completed")}
        >
          Completed
        </button>
      </div>

      {/* Todo List */}
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <label className="todo-left">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className={`title ${todo.completed ? "completed" : ""}`}>
                {todo.title}
              </span>
            </label>

            <div className="meta">
              <span className="timestamp">{todo.timestamp}</span>
              <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
