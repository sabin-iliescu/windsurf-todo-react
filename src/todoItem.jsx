import { useState, useRef, useEffect, useCallback } from "react";
import { useTodoContext } from "./store/todoContext.jsx";
import PrioritySelect from "./prioritySelect.jsx";
import "./styles.css";

export function TodoItem({ todo, index }) {
  const { dispatch, ACTIONS } = useTodoContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(todo.name);
  const [editedPriority, setEditedPriority] = useState(todo.priority);
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate);
  const editInputRef = useRef(null);
  const itemRef = useRef(null);

  const toggleEdit = useCallback(() => {
    setIsEditing(!isEditing);
    setEditedName(todo.name);
    setEditedPriority(todo.priority);
  }, [isEditing, todo.name, todo.priority]);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setEditedPriority(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setEditedDueDate(e.target.value);
  };

  const todoPriorityClass = useCallback(() => {
    if (todo.priority === "high") {
      return "badge rounded-pill bg-danger p-2";
    } else if (todo.priority === "medium") {
      return "badge rounded-pill bg-warning p-2";
    } else {
      return "badge rounded-pill bg-info p-2";
    }
  });

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!editedName) return;

      dispatch({
        type: ACTIONS.EDIT_TODO,
        payload: {
          id: todo.id,
          name: editedName,
          priority: editedPriority,
          dueDate: editedDueDate,
        },
      });
      toggleEdit();
      setEditedName("");
      setEditedPriority(todo.priority);
      setEditedDueDate(todo.dueDate);
    },
    [
      dispatch,
      ACTIONS.EDIT_TODO,
      editedName,
      todo.id,
      toggleEdit,
      editedPriority,
      editedDueDate,
    ]
  );

  return (
    <div className="draggable">
      <div className="drag-handle">
        <span>⋮</span>
      </div>
      <div className="todo-item">
        {isEditing ? (
          <form
            className="d-flex align-items-center w-100"
            onSubmit={handleSubmit}
          >
            <div className="d-flex align-items-center w-100">
              <input
                type="text"
                className="form-control me-2"
                value={editedName}
                onChange={handleNameChange}
                style={{ maxWidth: '200px' }}
              />
              <input
                type="date"
                className="form-control me-2"
                value={editedDueDate}
                onChange={handleDueDateChange}
                style={{ maxWidth: '150px' }}
              />
              <PrioritySelect
                priority={editedPriority}
                setPriority={handlePriorityChange}
                isItem={true}
              />
              <button
                type="submit"
                className="btn btn-info ms-2"
                style={{ minWidth: '80px' }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={toggleEdit}
                style={{ minWidth: '80px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="d-flex align-items-center w-100">
            <div className="form-check me-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={todo.completed}
                onChange={(e) => {
                  dispatch({
                    type: ACTIONS.TOGGLE_TODO,
                    payload: { id: todo.id },
                  });
                }}
              />
            </div>
            <span
              className="flex-grow-1"
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              {todo.name}
            </span>
            <span className="badge rounded-pill bg-dark me-2">
              {todo.dueDate}
            </span>
            <span className={todoPriorityClass()}>
              {todo.priority}
            </span>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-warning me-2"
                onClick={toggleEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  dispatch({
                    type: ACTIONS.DELETE_TODO,
                    payload: todo.id,
                  })
                }
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
