export const READ = 'READ';
export const CREATE = 'CREATE';
export const UPDATE = 'UPDATE';
export const DELETE = 'DELETE';

export const boardsReducer = (state, action) => {
  switch(action.type) {
    case READ:
      return;
    case CREATE:
      return;
    case UPDATE:
      return;
    case DELETE:
      return;
    default:
      return state;
  }
}