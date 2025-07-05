import React, { useState } from 'react';

const TaskItem = ({ task, onToggle, onDelete, onEdit, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority || 'Medium');
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [editCategory, setEditCategory] = useState(task.category || 'General');

  const handleEdit = () => {
    if (editTitle.trim()) {
      onEdit(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        dueDate: editDueDate || null,
        category: editCategory
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority || 'Medium');
    setEditDueDate(task.dueDate || '');
    setEditCategory(task.category || 'General');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${className}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-input"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="edit-textarea"
            rows="2"
          />
          <select
            value={editPriority}
            onChange={e => setEditPriority(e.target.value)}
            className="edit-input"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={editDueDate}
            onChange={e => setEditDueDate(e.target.value)}
            className="edit-input"
          />
          <input
            type="text"
            value={editCategory}
            onChange={e => setEditCategory(e.target.value)}
            className="edit-input"
            placeholder="Category (e.g. Work, Personal)"
          />
          <div className="edit-buttons">
            <button onClick={handleEdit} className="save-btn">
              Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-content">
          <div className="task-header">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="task-checkbox"
            />
            <h4 className={`task-title ${task.completed ? 'completed-text' : ''}`}>
              {task.title}
            </h4>
            <span className={`priority-label priority-${(task.priority || 'Medium').toLowerCase()}`}>{task.priority || 'Medium'}</span>
            {task.category && (
              <span className="category-label" style={{ marginLeft: '0.5rem', background: '#eee', color: '#333', borderRadius: '8px', padding: '0.2em 0.7em', fontSize: '0.8em' }}>{task.category}</span>
            )}
          </div>
          
          {task.description && (
            <p className={`task-description ${task.completed ? 'completed-text' : ''}`}>
              {task.description}
            </p>
          )}
          
          <div className="task-meta">
            <span className="created-date">
              Created: {formatDate(task.createdAt)}
            </span>
            {task.dueDate && (
              <div className="due-date" style={{ marginTop: '0.5rem', color: '#888' }}>
                Due: {task.dueDate}
              </div>
            )}
            <div className="task-actions">
              <button 
                onClick={() => setIsEditing(true)} 
                className="edit-btn"
                disabled={task.completed}
              >
                Edit
              </button>
              <button onClick={handleDelete} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;