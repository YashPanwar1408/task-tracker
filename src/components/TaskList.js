import React, { useRef } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggle, onDelete, onEdit }) => {
  const removedRef = useRef({});

  const handleDelete = (id) => {
    removedRef.current[id] = true;
    setTimeout(() => {
      onDelete(id);
      delete removedRef.current[id];
    }, 300); // match CSS transition duration
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Add your first task above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={() => handleDelete(task.id)}
          onEdit={onEdit}
          className={removedRef.current[task.id] ? 'removing' : ''}
        />
      ))}
    </div>
  );
};

export default TaskList;