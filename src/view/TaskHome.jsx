import React, { useMemo, useState } from "react";
import { Container, Grid, Divider, TextField, Typography, Box, Link } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AddTodoBox from "./AddTodoBox";
import DeleteAllButton from "./DeleteAllButton";
import DeleteTaskButton from "./DeleteTaskButton";
import { useTaskManager } from "../service/TaskManager";
import * as TaskApi from "../api/TaskAPI";

const TodoHome = () => {
  const [queryStr, setQueryStr] = useState("");
  const [activeTodoId, setActiveTodoId] = useState(null);
  const [allDoneOpen, setAllDoneOpen] = useState(false);
  const { tasks } = useTaskManager();

  const todoList = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.label.toLowerCase().includes(queryStr.toLowerCase()))
      .sort((a, b) => {
        if (a.label.toLowerCase() > b.label.toLowerCase()) {
          return 1;
        } else if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
        else return 0;
      });
  }, [tasks, queryStr]);

  const doneList = useMemo(() => {
    const completedList = tasks.filter((t) => t.completed).sort((a, b) => b.time - a.time);
    if (!allDoneOpen && completedList.length > 10) completedList.splice(10);
    return completedList
      .filter((t) => t.completed && t.label.toLowerCase().includes(queryStr.toLowerCase()))
      .sort((a, b) => {
        if (a.label.toLowerCase() > b.label.toLowerCase()) {
          return 1;
        } else if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
        else return 0;
      });
  }, [tasks, allDoneOpen, queryStr]);

  const toggleListAllDone = () => {
    setAllDoneOpen((prev) => !prev);
  };
  const toggleCompleted = async (task) => {
    const taskObj = JSON.parse(JSON.stringify(task));
    taskObj.completed = !taskObj.completed;
    await TaskApi.updateTask(taskObj);
  };
  return (
    <>
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Grid container>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 4,
                pb: 2,
                height: 60,
                width: "100%",
              }}
            >
              <Typography variant="h4">Task Sync</Typography>
              <DeleteAllButton />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                pt: 4,
                pb: 2,
                width: "100%",
              }}
            >
              <AddTodoBox />
              <TextField
                id="outlined-search"
                label="Search"
                type="search"
                value={queryStr}
                style={{ width: "60%", maxWidth: 230 }}
                onChange={(e) => setQueryStr(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                mt: 5,
              }}
            >
              <Box
                sx={{
                  width: "46%",
                }}
              >
                <Box sx={{ ml: 3 }}>
                  <Typography variant="h5">{"To Do"}</Typography>
                </Box>
                <Divider />
                <List>
                  {todoList.map((task) => (
                    <ListItem
                      key={task.id + ""}
                      disablePadding
                      onMouseLeave={(e) => setActiveTodoId(0)}
                      onMouseOver={(e) => setActiveTodoId(task.id)}
                    >
                      <ListItemButton onClick={() => toggleCompleted(task)}>
                        <ListItemIcon>
                          <CheckBoxOutlineBlankIcon style={{ fontSize: "40px", color: "black" }} />
                        </ListItemIcon>
                        <ListItemText>
                          <span style={{ fontSize: "20px" }}>{task.label}</span>
                        </ListItemText>
                      </ListItemButton>
                      {activeTodoId === task.id ? (
                        <DeleteTaskButton task={task} onClose={() => setActiveTodoId(0)} />
                      ) : null}
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box
                sx={{
                  width: "46%",
                }}
              >
                <Box sx={{ ml: 3 }}>
                  <Typography variant="h5">{"Done"}</Typography>
                </Box>
                <Divider />
                <List>
                  {doneList.map((task) => (
                    <ListItem key={task.id + ""} disablePadding>
                      <ListItemButton onClick={() => toggleCompleted(task)}>
                        <ListItemIcon>
                          <CheckBoxOutlinedIcon style={{ fontSize: "40px", color: "black" }} />
                        </ListItemIcon>
                        <ListItemText>
                          <span style={{ fontSize: "20px" }}>{task.label}</span>
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                {!allDoneOpen && tasks.filter((t) => t.completed).length > 10 ? (
                  <Link href="#" onClick={toggleListAllDone}>
                    <span style={{ fontSize: 20 }}>List all done tasks</span>
                  </Link>
                ) : null}
                {allDoneOpen && tasks.filter((t) => t.completed).length > 10 ? (
                  <Link href="#" onClick={toggleListAllDone}>
                    <span style={{ fontSize: 20 }}>List 10 Latest done tasks</span>
                  </Link>
                ) : null}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default TodoHome;
