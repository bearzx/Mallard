const defaultState = {
  isDragStart: false
};

const reducer = (state = defaultState, action) => {
  if (action.type === 'DRAG_START') {
    return {...state, isDragStart: true};
  }

  if (action.type === 'DRAG_END') {
    return {...state, isDragStart: false};
  }

  return state;
};

export default reducer;