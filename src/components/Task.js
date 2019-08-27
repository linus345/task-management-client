import React from 'react';
import {
  ListItem,
  ListItemText,
} from '@material-ui/core';
// import {
//   ExpandLess,
//   ExpandMore,
// } from '@material-ui/icons';

import { Draggable } from 'react-beautiful-dnd';

const Task = ({ task, index }) => {
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
        </ListItem>
      )}
    </Draggable>
  )
}

export default Task;