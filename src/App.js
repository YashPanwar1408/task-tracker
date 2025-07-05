import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import TaskSearch from './components/TaskSearch';
import { loadTasks, saveTasks } from './utils/localStorage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    // Persist dark mode preference in localStorage
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    if (savedUser) {
      setUser(savedUser);
    }
    
    const savedTasks = loadTasks();
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleLogin = (username) => {
    localStorage.setItem('username', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('tasks');
    setUser(null);
    setTasks([]);
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, updates) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    switch (filter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      default:
        break;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    }
    return filtered;
  };

  const getTaskCounts = () => {
    return {
      all: tasks.length,
      pending: tasks.filter(task => !task.completed).length,
      completed: tasks.filter(task => task.completed).length
    };
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`app${darkMode ? ' dark-mode' : ''}`}>
      <header className="app-header">
        <h1>Personal Task Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          <button
            onClick={() => setDarkMode(dm => !dm)}
            className="logout-btn"
            style={{ background: darkMode ? '#444' : '#f1c40f', color: darkMode ? '#fff' : '#333', marginLeft: '1rem' }}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <TaskForm onAddTask={addTask} />
        <TaskSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="task-section">
          <TaskFilter
            activeFilter={filter}
            onFilterChange={setFilter}
            taskCounts={getTaskCounts()}
          />
          
          <TaskList
            tasks={getFilteredTasks()}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </div>
      </main>
    </div>
  );
}

export default App;