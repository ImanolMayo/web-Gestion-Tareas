import React from 'react';
import TaskItem from './TaskItem.js';

function TaskList({ tasks, deleteTask, toggleTask, updateTask, addFileToTask, toggleFileCompletion }) {
  return React.createElement('div', { className: 'task-list' },
    tasks.map(task =>
      React.createElement(TaskItem, {
        key: task.id,
        task,
        deleteTask,
        toggleTask,
        updateTask,
        addFileToTask,
        toggleFileCompletion
      })
    )
  );
}

export default TaskList;