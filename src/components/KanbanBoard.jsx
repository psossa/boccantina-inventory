import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrashIcon } from './Icons';

export default function KanbanBoard() {
  const { tasks, setTasks, addToast } = useApp();
  const [draggedTask, setDraggedTask] = useState(null);
  const [newTaskModal, setNewTaskModal] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('DRY');

  const columns = [
    { id: 'to-order', title: 'To Order', color: '#ef4444' },
    { id: 'ordered', title: 'Ordered', color: '#f59e0b' },
    { id: 'received', title: 'Received', color: '#3b82f6' },
    { id: 'in-stock', title: 'In Stock', color: '#22c55e' },
  ];

  const onDragStart = (e, task, fromCol) => {
    setDraggedTask({ ...task, fromCol });
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, toCol) => {
    e.preventDefault();
    if (!draggedTask) return;
    const { fromCol, ...task } = draggedTask;
    if (fromCol === toCol) return;
    setTasks(prev => {
      const updated = { ...prev };
      updated[fromCol] = updated[fromCol].filter(t => t.id !== task.id);
      updated[toCol] = [...updated[toCol], task];
      return updated;
    });
    addToast(`Moved "${task.title}" to ${columns.find(c => c.id === toCol).title}`);
    setDraggedTask(null);
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task = { id: 't' + Date.now(), title: newTaskTitle, category: newTaskCategory, priority: 'medium', date: new Date().toISOString().split('T')[0] };
    setTasks(prev => ({ ...prev, [newTaskModal]: [...prev[newTaskModal], task] }));
    setNewTaskTitle('');
    setNewTaskModal(null);
    addToast('Task added');
  };

  const deleteTask = (colId, taskId) => {
    setTasks(prev => ({ ...prev, [colId]: prev[colId].filter(t => t.id !== taskId) }));
    addToast('Task removed');
  };

  return (
    <div className="container dashboard">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h3 className="section-title">Supply Kanban</h3>
          <p className="section-subtitle">Drag and drop tasks between columns</p>
        </div>
      </div>
      <div className="kanban-board">
        {columns.map(col => (
          <div key={col.id} className="kanban-column" onDragOver={onDragOver} onDrop={e => onDrop(e, col.id)}>
            <div className="kanban-header">
              <div className="kanban-title">
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                {col.title}
              </div>
              <span className="kanban-count">{tasks[col.id].length}</span>
            </div>
            {tasks[col.id].map(task => (
              <div key={task.id} className="kanban-card" draggable onDragStart={e => onDragStart(e, task, col.id)}>
                <div className="kanban-card-title">{task.title}</div>
                <div className="kanban-card-meta">{task.category} · {task.date}</div>
                <div className="kanban-card-footer">
                  <span className={`badge badge-${task.priority === 'high' ? 'critical' : task.priority === 'medium' ? 'low' : 'ok'}`}>{task.priority}</span>
                  <button className="btn btn-icon btn-outline" style={{ width: '28px', height: '28px' }} onClick={() => deleteTask(col.id, task.id)}><TrashIcon /></button>
                </div>
              </div>
            ))}
            <button className="kanban-add" onClick={() => setNewTaskModal(col.id)}>+ Add Task</button>
          </div>
        ))}
      </div>
      {newTaskModal && (
        <div className="modal-overlay" onClick={() => setNewTaskModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: 600 }}>New Task</h3>
              <button className="modal-close" onClick={() => setNewTaskModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Task Title</label>
                <input className="input" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="e.g., Order fresh produce" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="input select" value={newTaskCategory} onChange={e => setNewTaskCategory(e.target.value)}>
                  {['DRY','BREAD','VERDURAS','BEVERAGES','BEER','WINE','PAPER','JANITORIAL'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={addTask}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
