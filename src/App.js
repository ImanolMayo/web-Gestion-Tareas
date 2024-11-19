import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList.js';
import TaskForm from './components/TaskForm.js';

const STORAGE_KEY = 'taskManager_tasks';

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
      return [];
    }
  });
  
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error al guardar las tareas:', error);
    }
  }, [tasks]);

  const addTask = (task) => {
    try {
      setTasks(prevTasks => [...prevTasks, task]);
    } catch (error) {
      console.error('Error al añadir la tarea:', error);
    }
  };

  const deleteTask = (id) => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  const toggleTask = (id) => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado de la tarea:', error);
    }
  };

  const updateTask = (id, updatedTask) => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const addFileToTask = (taskId, file) => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                files: [...(task.files || []), { ...file, completed: false }]
              }
            : task
        )
      );
    } catch (error) {
      console.error('Error al añadir el archivo:', error);
    }
  };

  const toggleFileCompletion = (taskId, fileIndex) => {
    try {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                files: task.files.map((file, index) =>
                  index === fileIndex ? { ...file, completed: !file.completed } : file
                )
              }
            : task
        )
      );
    } catch (error) {
      console.error('Error al cambiar el estado del archivo:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return React.createElement('div', { className: 'App' },
    React.createElement('header', { className: 'App-header' },
      React.createElement('h1', null, 'Gestión de Tareas'),
      React.createElement(TaskForm, { addTask }),
      React.createElement('div', { className: 'filter-buttons' },
        React.createElement('button', {
          onClick: () => setFilter('all'),
          className: filter === 'all' ? 'active' : ''
        }, 'Todas'),
        React.createElement('button', {
          onClick: () => setFilter('completed'),
          className: filter === 'completed' ? 'active' : ''
        }, 'Completadas'),
        React.createElement('button', {
          onClick: () => setFilter('pending'),
          className: filter === 'pending' ? 'active' : ''
        }, 'Pendientes')
      ),
      React.createElement(TaskList, {
        tasks: filteredTasks,
        deleteTask,
        toggleTask,
        updateTask,
        addFileToTask,
        toggleFileCompletion
      })
    )
  );
}

export default App;