export const SUCCESS_ALERT = 'SUCCESS_ALERT';
export const ERROR_ALERT = 'ERROR_ALERT';

export const alertsReducer = (state, action) => {
  switch(action.type) {
    case SUCCESS_ALERT:
      return {
        error: state.error,
        success: action.message, 
      };
    case ERROR_ALERT:
      return {
        error: action.message,
        success: state.success, 
      };
    default:
      return state;
  }
}