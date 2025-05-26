import { useState, useEffect } from "react";
import { TodoItem } from "./todoItem";
import { useFilteredTodos } from "./hooks/useFilteredTodos";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { useTodoContext } from "./store/todoContext.jsx";
import { ACTIONS } from "./store/todoContext.jsx";

export function TodoList() {
  const { filteredTodos, setFilter } = useFilteredTodos();
  const { todos, dispatch } = useTodoContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(5);

  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get the current page of filtered todos
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    // Get the todo being moved
    const movedTodo = currentTodos[result.source.index];
    const sourceIndex = todos.findIndex(todo => todo.id === movedTodo.id);

    // Get the target todo's index
    const targetTodo = currentTodos[result.destination.index];
    const destinationIndex = todos.findIndex(todo => todo.id === targetTodo.id);

    // Create a copy of the todos array
    const newTodos = [...todos];

    // Remove the moved todo
    const [movedTodoFromTodos] = newTodos.splice(sourceIndex, 1);

    // Insert it at the destination position
    newTodos.splice(destinationIndex, 0, movedTodoFromTodos);

    // Dispatch the reorder action
    dispatch({
      type: ACTIONS.REORDER_TODOS,
      payload: newTodos
    });

    // Reset pagination and filter
    setCurrentPage(1);
    setFilter('all');

    // Force a re-render to update the UI
    setCurrentPage(currentPage);
  };



  return (
    <div className="card">
      <div className="card-header">
        <h1>Todo List</h1>
        <div className="btn-group mt-3" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFilter("active")}
          >
            Active
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="list-group list-group-flush ps-2 pe-2 pt-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {currentTodos.length === 0 && (
                    <h6 className="text-center m-3">No todos available</h6>
                  )}
                  {currentTodos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable"
                        >
                          <TodoItem
                            todo={todo}
                            index={todos.findIndex(t => t.id === todo.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <a onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default TodoList;
