import { getAllque } from "../config/Myservice";

export default function getData(email) {
  return (dispatch) => {
    getAllque(email).then((res) => {
      console.log(res.data.data);
      dispatch({ type: "GET_DATA", payload: res.data.data });
    });
  };
}
