import React, { useState } from 'react';
import {
  Grid,
  List,
  ListSubheader,
  ListItem,
  TextField,
  Paper,
  Divider,
  Button,
  IconButton,
} from '@material-ui/core';
import {
  MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import { Droppable } from 'react-beautiful-dnd';

import Task from './Task';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    minWidth: '250px',
  },
  ul: {
    paddingBottom: 0,
    marginBottom: theme.spacing(3),
  },
  form: {
    display: 'flex',
    width: '100%',
  },
  input: {
    flexGrow: 1,
    margin: 0,
  },
  inputListItem: {
    padding: 0,
  },
  submitButton: {
    paddingTop: 7.5,
    paddingBottom: 7.5,
  },
  moreButton: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
  },
  listSubHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const TaskColumn = ({ tasks, setTasks, name, columnId, boardId }) => {
  const classes = useStyles();
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!taskTitle) return;
    try {
      const token = localStorage.getItem('auth_token');
      if(!token) return;
      const url = `${process.env.REACT_APP_API_URL}/boards/${boardId}/columns/${columnId}/tasks`;
      const newTaskList = Array.from(tasks);
      const res = await axios.post(url, {
        title: taskTitle,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      newTaskList.push(res.data.task);
      setTasks(prevTaskList => {
        return { ...prevTaskList, [columnId]: newTaskList }
      });
    } catch(error) {
      console.log(error.response);
    }
    
    setTaskTitle('');
  }

  return(
    <Grid item className={classes.root}>
      <Paper>
        <Droppable droppableId={columnId}>
          {provided => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes.ul}
              subheader={
                <ListSubheader className={classes.listSubHeader} component="div">
                  {name}
                  <IconButton className={classes.moreButton} aria-label="show more">
                    <MoreHorizIcon />
                  </IconButton>
                </ListSubheader>
              }
            >
              <Divider />
              {tasks && tasks.map((task, index) => (
                <Task task={task} index={index} key={task._id} />
              ))}
              {provided.placeholder}
              <Divider />
              <ListItem className={classes.inputListItem}>
                <form onSubmit={handleSubmit} className={classes.form}>
                  <TextField
                    id="standard-dense"
                    placeholder="New task"
                    margin="dense"
                    variant="outlined"
                    className={classes.input}
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    onBlur={e => setTaskTitle(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                  >Add</Button>
                </form>
              </ListItem>
            </List>
          )}
        </Droppable>
      </Paper>
    </Grid>
  )
}

export default TaskColumn;