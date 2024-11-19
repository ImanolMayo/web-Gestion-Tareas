import React, { useState } from 'react';

function TaskForm({ addTask }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      files: []
    };
    
    addTask(newTask);
    setText('');
  };

  return React.createElement('form', {
    onSubmit: handleSubmit,
    className: 'task-form'
  },
    React.createElement('input', {
      type: 'text',
      placeholder: 'Nueva tarea',
      value: text,
      onChange: (e) => setText(e.target.value),
      className: 'task-input'
    }),
    React.createElement('button', {
      type: 'submit',
      className: 'add-button'
    }, 'Agregar')
  );
}

export default TaskForm;