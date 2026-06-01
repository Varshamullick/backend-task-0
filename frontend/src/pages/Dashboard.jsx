import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await taskAPI.getTasks();
      setTasks(res.data.data);
    } catch {
      setMessage('Could not load tasks');
    }
  };

  const saveTask = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await taskAPI.updateTask(editId, form);
        setMessage('Task updated');
      } else {
        await taskAPI.createTask(form);
        setMessage('Task created');
      }
      setForm({ title: '', description: '' });
      setEditId(null);
      loadTasks();
    } catch {
      setMessage('Save failed');
    }
  };

  const editTask = (task) => {
    setEditId(task._id);
    setForm({ title: task.title, description: task.description || '' });
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.deleteTask(id);
      setMessage('Task deleted');
      loadTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-page">
      <div className="top-row">
        <div>
          <h1>Dashboard</h1>
          <p>Hi {user?.username}, manage your tasks below.</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {message && <p className="message-text">{message}</p>}

      <form className="task-form" onSubmit={saveTask}>
        <h2>{editId ? 'Edit Task' : 'New Task'}</h2>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">{editId ? 'Update' : 'Create'}</button>
      </form>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-item">
              <div>
                <strong>{task.title}</strong>
                {task.description && <p>{task.description}</p>}
              </div>
              <div className="task-actions">
                <button onClick={() => editTask(task)}>Edit</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
