import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons';

import { Draggable } from 'react-beautiful-dnd';

const useStyles = makeStyles(theme => ({
  moreButton: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
  },
}));

const Task = ({ task, index }) => {
  const classes = useStyles();
  return(
    <Draggable draggableId={task._id} index={index}>
      {provided => (
        <ListItem 
          button
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <ListItemText primary={task.title} />
          <IconButton className={classes.moreButton} aria-label="show more">
            <MoreHorizIcon />
          </IconButton>
        </ListItem>
      )}
    </Draggable>
  )
}

export default Task;