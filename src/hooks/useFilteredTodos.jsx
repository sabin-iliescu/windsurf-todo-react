import { useState, useEffect, useMemo } from "react";
import { useTodoContext } from "../store/todoContext.jsx";

export function useFilteredTodos() {
  const { todos } = useTodoContext();
  const [filter, setFilter] = useState("all");

  // Get filtered and sorted todos
  const getFilteredTodos = () => {
    const priorityMap = {
      high: 1,
      medium: 2,
      low: 3,
    };

    let sortedTodos = [...todos].sort((a, b) => {
      return priorityMap[a.priority] - priorityMap[b.priority];
    });

    switch (filter) {
      case "completed":
        return sortedTodos.filter((todo) => todo.completed);
      case "active":
        return sortedTodos.filter((todo) => !todo.completed);
      default:
        return sortedTodos;
    }
  };

  // Memoize the filtered todos to avoid unnecessary re-renders
  const filteredTodos = useMemo(() => getFilteredTodos(), [todos, filter]);

  return { filteredTodos, setFilter };
}

export default useFilteredTodos;
