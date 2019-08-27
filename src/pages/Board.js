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
  const [columns, setColumns] = useState(null);
  const [tasks, setTasks] = useState([]);

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
        setBoard(res.data.board);
        setColumns(res.data.board.columns);
        setTasks(res.data.board.tasks);
      } catch(error) {
        console.log(error.response);
        setBoard(null);
        setColumns(null);
        setTasks([]);
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

  const handleDragEnd = ({ destination, source, draggableId }) => {
    if(!destination) return; // dropped outside of list
    if(destination.droppableId === source.droppableId && destination.index === source.index) return; // didn't move

    // task was moved to different index/column so we have to reorder task array
    console.log('tasks', tasks);
    console.log('destinatiton', destination);
    console.log('source', source);
    console.log('draggableId', draggableId);
    // const newTaskList = Array.from(tasks);
    // console.log('task list', newTaskList);
    // newTaskList.splice(source.index, 1);
    // newTaskList(destination.index, 0, )
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
            {columns && columns.map(column => <TaskColumn tasks={tasks} name={column.name} columnId={column._id} key={column._id} />)}
          </DragDropContext>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Board;