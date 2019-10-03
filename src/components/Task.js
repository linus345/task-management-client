import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
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
  const [anchorEl, setAnchorEl] = useState(null);

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
          <IconButton
            className={classes.moreButton}
            aria-label="show more"
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
        </ListItem>
      )}
    </Draggable>
  )
}

export default Task;