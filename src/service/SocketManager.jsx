import React, { useEffect, useState, useContext, createContext } from "react";
import { useTaskManager } from "./TaskManager";
const url = "ws://127.0.0.1:8080";
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const { tasks, addTask, updateTask, removeTask, removeAll } = useTaskManager();

  useEffect(() => {
    if (!ws) {
      const socket = new WebSocket(url);
      setWs(socket);
      socket.onmessage = (event) => {
        if (event.data) {
          try {
            const json = JSON.parse(event.data);
            const eventName = json.name;
            switch (eventName) {
              case "taskCreated":
                addTask(json.task);
                break;
              case "taskUpdated":
                updateTask(json.task);
                break;
              case "taskRemoved":
                removeTask(json.taskId);
                break;
              case "allRemoved":
                removeAll();
                break;
              default:
                break;
            }
          } catch (e) {
            console.log(e);
          }
        }
        socket.onclose = () => {
          console.log("WebSocket Disconnected");
          setWs(null);
        };
      };
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws, addTask, removeAll, removeTask, updateTask, tasks]);
  const value = {
    sendEvent: (event) => {
      ws.send(JSON.stringify(event));
    },
  };
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

const useSocket = () => {
  return useContext(SocketContext);
};
export default useSocket;
