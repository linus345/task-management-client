import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { DragDropContext } from 'react-beautiful-dnd';

import { UserContext } from '../context/UserContext';
import TaskColumn from '../components/TaskColumn';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gridGap: theme.spacing(1),
    width: '100%',
  },
}));

const Board = ({ match }) => {
  const classes = useStyles();
  const { setUser } = useContext(UserContext);
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState(null);

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
        setBoard(res.data.board);
        setTasks(tasksTemp);
        setColumns(res.data.board.columns);
      } catch(error) {
        console.log(error.response);
        setBoard(null);
        setColumns([]);
        setTasks(null);
      }
    }

    const token = localStorage.getItem('auth_token');
    if(token) {
      fetchBoard();
    } else {
      setUser(null);
    }
    // to get rid of linter warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if(!board) return 'No board found';

  return(
    <Grid container className={classes.container}>
      <Typography gutterBottom variant="h5">{board.label}</Typography>
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
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Board;