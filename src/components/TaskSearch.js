import React from 'react';

const TaskSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="task-search" style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
      />
    </div>
  );
};

export default TaskSearch;
