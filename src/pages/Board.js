import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { DragDropContext } from 'react-beautiful-dnd';

import { UserContext } from '../context/UserContext';
import TaskColumn from '../components/TaskColumn';
import Loading from '../components/Loading';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  box: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  columns: {
    display: 'flex',
    flexWrap: 'nowrap',
    width: 'auto',
    minWidth: '100%',
    overflow: 'scroll',
  },
  form: {
    display: 'flex',
    width: '100%',
  },
  input: {
    minWidth: '200px',
    flexGrow: 1,
    margin: 0,
  },
  submitButton: {
    paddingTop: 7.5,
    paddingBottom: 7.5,
  },
  moreButton: {
    margin: theme.spacing(1),
  },
}));

let isMounted = false;

const Board = ({ match }) => {
  const classes = useStyles();
  const { setUser } = useContext(UserContext);
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState(null);
  const [columnName, setColumnName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  isMounted = true;

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const url = process.env.REACT_APP_API_URL + '/boards/' + match.params.id;
        const res = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(res);
        const tasksTemp = {};
        res.data.board.columns.forEach(column => {
          const { _id, tasks: columnTasks } = column;
          tasksTemp[_id] = columnTasks;
        });
        console.log('tasksTemp', tasksTemp);
        if(isMounted) {
          setBoard(res.data.board);
          setTasks(tasksTemp);
          setColumns(res.data.board.columns);
          setIsLoading(false);
        }
      } catch(error) {
        console.log(error.response);
        if(isMounted) {
          setBoard(null);
          setColumns([]);
          setTasks(null);
          setIsLoading(false);
        }
      }
    }

    const token = localStorage.getItem('auth_token');
    if(token) {
      fetchBoard();
    } else {
      if(isMounted) {
        setUser(null);
      }
    }

    // cleanup
    return () => { isMounted = false };
    // to get rid of linter warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // create new column
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!columnName) return;
    try {
      const token = localStorage.getItem('auth_token');
      if(!token) {
        setUser(null);
        return;
      };
      const url = process.env.REACT_APP_API_URL + '/boards/' + match.params.id + '/columns';
      const res = await axios.post(url, {
        name: columnName,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(res);
      setColumns(prev => [...prev, res.data.column]);
      setTasks(prev => {
        return { ...prev, [res.data.column._id]: res.data.column.tasks };
      });
      console.log('tasks', tasks);
      setColumnName('');
    } catch(error) {
      if(error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  }

  const reorderTasks = async (taskId, oldIndex, newIndex, sourceColumnId, destinationColumnId) => {
    const token = localStorage.getItem('auth_token');
    
    try {
      if(!token) throw new Error('No auth token');
      const url = process.env.REACT_APP_API_URL + '/boards/' + match.params.id + '/columns/tasks';
      console.log('url', url);
      const res = await axios.put(url, {
        taskId,
        oldIndex,
        newIndex,
        sourceColumnId,
        destinationColumnId,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }, 
      });
      console.log(res);
    } catch(error) {
      if(error.response) {
        console.log(error.response);
      } else {
        console.error(error);
      }
    }
  }

  const handleDragEnd = ({ destination, source, draggableId }) => {
    if(!destination) return; // dropped outside of list
    if(destination.droppableId === source.droppableId && destination.index === source.index) return; // didn't move
    
    if(source.droppableId === destination.droppableId) {
      // moved within the same column
      const newTaskList = Array.from(tasks[source.droppableId]);
      const task = newTaskList.filter(task => task._id === draggableId)[0];
      newTaskList.splice(source.index, 1);
      newTaskList.splice(destination.index, 0, task);
      console.log('newtasklist', newTaskList);
      setTasks(prevTaskList => {
        console.log('prevtasklist', prevTaskList);
        console.log('droppable', source.droppableId);
        return { ...prevTaskList, [source.droppableId]: newTaskList}
      });
      // make put request to server and update task order in database
      reorderTasks(draggableId, source.index, destination.index, source.droppableId, destination.droppableId);
    } else {
      // moved between different columns
      const startTaskList = tasks[source.droppableId];
      const endTaskList = tasks[destination.droppableId];

      const newStartTaskList = Array.from(startTaskList);
      const newEndTaskList = Array.from(endTaskList);

      const task = newStartTaskList.filter(task => task._id === draggableId)[0];

      newStartTaskList.splice(source.index, 1);
      newEndTaskList.splice(destination.index, 0, task);

      setTasks(prevTaskList => {
        return { ...prevTaskList, [source.droppableId]: newStartTaskList, [destination.droppableId]: newEndTaskList };
      });

      // make put request to server and update task order in database
      reorderTasks(draggableId, source.index, destination.index, source.droppableId, destination.droppableId);
    }
  }

  // if(!board) return 'No board found';

  return(
    <React.Fragment>
      {isLoading ? <Loading /> : board ? (<Grid container className={classes.container}>
          <Box className={classes.box}>
            <Typography variant="h5">{board.label}</Typography>
            <IconButton
              className={classes.moreButton}
              aria-label="show more"
              aria-haspopup="true"
              onClick={e => setAnchorEl(e.currentTarget)}
            >
              <MoreHorizIcon />
            </IconButton>
            <Menu
              id="board-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {['Edit', 'Delete'].map(option => (
                <MenuItem
                  key={option}
                >{option}</MenuItem>
              ))}
            </Menu>
          </Box>
          <Grid item xs={12}>
            <Grid
              className={classes.columns}
              container
            >
              <DragDropContext onDragEnd={handleDragEnd}>
                {columns && columns.map(column => (
                  <TaskColumn 
                    tasks={tasks[column._id]}
                    name={column.name} 
                    columnId={column._id} 
                    boardId={board._id}
                    key={column._id} 
                    setTasks={setTasks}
                  />)
                )}
              </DragDropContext>
              <Grid item>
                <form onSubmit={handleSubmit} className={classes.form}>
                  <TextField
                    id="standard-dense"
                    placeholder="New column"
                    margin="dense"
                    variant="outlined"
                    className={classes.input}
                    value={columnName}
                    onChange={e => setColumnName(e.target.value)}
                    onBlur={e => setColumnName(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                  >Add</Button>
                </form>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : 'No board found'}
    </React.Fragment>
  )
}

export default Board;