import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  Suspense,
} from "react";

export const ACTIONS = {
  NEW_TODO: "newTodo",
  TOGGLE_TODO: "toggleTodo",
  DELETE_TODO: "deleteTodo",
  EDIT_TODO: "editTodo",
  REORDER_TODOS: "reorderTodos",
};

export const TodoContext = createContext({
  todos: [],
  dispatch: () => {},
});

function todoReducer(todos, action) {
  switch (action.type) {
    case ACTIONS.NEW_TODO:
      return [
        ...todos,
        addTodo(
          action.payload.name,
          action.payload.completed,
          action.payload.priority,
          action.payload.dueDate
        ),
      ];
    case ACTIONS.TOGGLE_TODO:
      return todos.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case ACTIONS.DELETE_TODO:
      return todos.filter((todo) => todo.id !== action.payload.id);
    case ACTIONS.EDIT_TODO:
      return todos.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              name: action.payload.name || todo.name,
              priority: action.payload.priority || todo.priority,
              dueDate: action.payload.dueDate || todo.dueDate,
            }
          : todo
      );
    case ACTIONS.REORDER_TODOS:
      return action.payload;
    default:
      return todos;
  }
}

function addTodo(name, completed, priority, dueDate) {
  return { id: Date.now(), name, completed, priority, dueDate };
}

export function useTodoContext() {
  return useContext(TodoContext);
}

function useTodos(initialTodos) {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  return { todos, dispatch, ACTIONS };
}

export function TodoProvider({ children }) {
  const { todos, dispatch } = useTodos(
    JSON.parse(localStorage.getItem("TODOS")) || []
  );

  useEffect(() => {
    localStorage.setItem("TODOS", JSON.stringify(todos));
  }, [todos]);

  return (
    <TodoContext.Provider value={{ todos, dispatch, ACTIONS }}>
      <Suspense fallback={<div>Loading todos...</div>}>{children}</Suspense>
    </TodoContext.Provider>
  );
}
