const initialState = { allque: [], login: "" };

function reducer(state = initialState, actions) {
  switch (actions.type) {
    case "isuser":
      if (localStorage.getItem("user")) return { ...state, login: true };
      else {
        return { ...state, login: false };
      }
    default:
      return state;
  }
}

export default reducer;
