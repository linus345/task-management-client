import React from 'react';
import {
  Grid,
  List,
  ListSubheader,
  Paper,
  Divider,
} from '@material-ui/core';

import { Droppable } from 'react-beautiful-dnd';

import Task from './Task';

const TaskColumn = ({ tasks, name, columnId }) => {
  return(
    <Grid item>
      <Paper>
        <Droppable droppableId={columnId}>
          {provided => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              subheader={
                <ListSubheader component="div">
                  {name}
                </ListSubheader>
              }
            >
              <Divider />
              {/* .filter(task => task.column === columnId) */}
              {tasks.map((task, index) => (
                <Task task={task} index={index} key={task._id} />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </Paper>
    </Grid>
  )
}

export default TaskColumn;