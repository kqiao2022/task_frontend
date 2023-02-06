import React, { createContext, useContext, useEffect } from "react";
import * as TaskApi from "../api/TaskAPI";
const initialState = {
  tasks: [],
};

const actions = {
  INIT_TASK: "INIT_TASK",
  ADD_TASK: "ADD_TASK",
  REMOVE_TASK: "REMOVE_TASK",
  REMOVE_ALL: "REMOVE_ALL",
  UPDATE_TASK: "UPDATE_TASK",
  TOGGLE_COMPLETED: "TOGGLE_COMPLETED",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.INIT_TASK:
      return {
        tasks: [...action.tasks],
      };
    case actions.ADD_TASK:
      return {
        tasks: [...state.tasks, action.task],
      };
    case actions.UPDATE_TASK: {
      const updatedTaskList = state.tasks.map((task) =>
        task.id === action.task.id ? { ...task, ...action.task } : task
      );
      return { tasks: updatedTaskList };
    }
    case actions.REMOVE_TASK: {
      const filteredTasks = state.tasks.filter((task) => task.id !== action.taskId);
      return { tasks: filteredTasks };
    }
    case actions.REMOVE_ALL: {
      return { tasks: [] };
    }

    default:
      return state;
  }
};

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  useEffect(() => {
    TaskApi.findAll().then((res) => {
      if (res.ok) dispatch({ type: actions.INIT_TASK, tasks: res.message });
    });
  }, []);

  const value = {
    tasks: state.tasks,
    addTask: async (task) => {
      if (state.tasks.findIndex((t) => t.id === task.id) < 0) dispatch({ type: actions.ADD_TASK, task });
    },
    updateTask: async (task) => {
      dispatch({ type: actions.UPDATE_TASK, task });
    },
    removeTask: async (taskId) => {
      dispatch({ type: actions.REMOVE_TASK, taskId });
    },
    removeAll: async () => {
      dispatch({ type: actions.REMOVE_ALL });
    },
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
export const useTaskManager = () => {
  return useContext(TaskContext);
};
