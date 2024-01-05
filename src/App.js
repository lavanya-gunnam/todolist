import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  console.log('Component is rendering');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null); 
  const [editedTask, setEditedTask] = useState(''); 

  useEffect(() => {
    console.log('useEffect is running');
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      console.log(response, "fetch");
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== '') {
      try {
        await axios.post('http://localhost:3000/tasks', { task: newTask });
        setNewTask('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const removeTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const startEditing = (taskId, taskText) => {
    setEditingTaskId(taskId);
    setEditedTask(taskText);
  };

  const updateTask = async () => {
    if (editedTask.trim() !== '') {
      try {
        await axios.put(`http://localhost:3000/tasks/${editingTaskId}`, { task: editedTask });
        setEditingTaskId(null);
        setEditedTask('');
        fetchTasks();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center">To-Do List</h1>
            </div>
            <div className="card-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder={editingTaskId !== null ? "Update task" : "Enter a new task"}
                  value={editingTaskId !== null ? editedTask : newTask}
                  onChange={(e) => (editingTaskId !== null ? setEditedTask(e.target.value) : setNewTask(e.target.value))}
                />
                <div className="input-group-append">
                  <button
                    className={`btn ${editingTaskId !== null ? "btn-success" : "btn-primary"} ms-2`}
                    onClick={editingTaskId !== null ? updateTask : addTask}
                  >
                    {editingTaskId !== null ? "Update" : "Add"}
                  </button>
                </div>
              </div>
              <ul className="list-group">
                {tasks.map((task) => (
                  <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                   
                      <div>
                        {task.task}
                        <button className="btn btn-danger ms-2" onClick={() => removeTask(task.id)}>
                          Remove
                        </button>
                        <button className="btn btn-warning ms-2" onClick={() => startEditing(task.id, task.task)}>
                          Edit
                        </button>
                      </div>
                 
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
