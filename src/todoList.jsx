import { useState } from "react";
import { TodoItem } from "./todoItem";
import { useFilteredTodos } from "./hooks/useFilteredTodos";

export function TodoList() {
  const { filteredTodos, setFilter } = useFilteredTodos();
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(5);

  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

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
      <ul className="list-group list-group-flush ps-2 pe-2 pt-2">
        {currentTodos.length === 0 && (
          <h6 className="text-center m-3">No todos available</h6>
        )}
        {currentTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
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
