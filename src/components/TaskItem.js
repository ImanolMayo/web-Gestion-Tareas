import React, { useState } from 'react';

function TaskItem({ task, deleteTask, toggleTask, updateTask, addFileToTask, toggleFileCompletion }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleUpdate = () => {
    if (!newText.trim()) return;
    updateTask(task.id, { ...task, text: newText });
    setIsEditing(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileObj = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        content: await readFileAsDataURL(file)
      };
      
      addFileToTask(task.id, fileObj);
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const downloadFile = (fileContent, fileName) => {
    const link = document.createElement('a');
    link.href = fileContent;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return React.createElement('div', { className: 'task-item' },
    React.createElement('div', { className: 'task-content' },
      isEditing
        ? React.createElement('div', { className: 'edit-mode' },
            React.createElement('input', {
              type: 'text',
              value: newText,
              onChange: (e) => setNewText(e.target.value),
              className: 'edit-input'
            }),
            React.createElement('button', {
              onClick: handleUpdate,
              className: 'save-button'
            }, 'Guardar'),
            React.createElement('button', {
              onClick: () => setIsEditing(false),
              className: 'cancel-button'
            }, 'Cancelar')
          )
        : React.createElement('div', { className: 'view-mode' },
            React.createElement('span', {
              style: { textDecoration: task.completed ? 'line-through' : 'none' },
              className: 'task-text'
            }, task.text),
            React.createElement('div', { className: 'task-actions' },
              React.createElement('button', {
                onClick: () => toggleTask(task.id),
                className: 'toggle-button'
              }, task.completed ? '↩️' : '✓'),
              React.createElement('button', {
                onClick: () => setIsEditing(true),
                className: 'edit-button'
              }, '✎'),
              React.createElement('button', {
                onClick: () => deleteTask(task.id),
                className: 'delete-button'
              }, '🗑️')
            )
          )
    ),
    React.createElement('div', { className: 'file-section' },
      React.createElement('input', {
        type: 'file',
        onChange: handleFileChange,
        className: 'file-input'
      }),
      task.files && task.files.length > 0 && React.createElement('div', { className: 'files-list' },
        React.createElement('h4', null, 'Archivos adjuntos:'),
        task.files.map((file, index) =>
          React.createElement('div', { key: index, className: 'file-item' },
            React.createElement('span', { className: 'file-name' }, file.name),
            React.createElement('button', {
              onClick: () => downloadFile(file.content, file.name),
              className: 'download-button'
            }, '⬇️'),
            React.createElement('button', {
              onClick: () => toggleFileCompletion(task.id, index),
              className: 'file-status-button'
            }, file.completed ? '↩️' : '✓')
          )
        )
      )
    )
  );
}

export default TaskItem;