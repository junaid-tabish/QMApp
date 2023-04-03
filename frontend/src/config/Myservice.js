import axios from "axios";
import { MAIN_URL } from "./Url";
let token = localStorage.getItem("_token");
export function addQue(data) {
  let token = localStorage.getItem("_token");
  return axios.post(`${MAIN_URL}que/addque/`, data, {
    headers: { authorization: `Bearer ${token}` },
  });
}
export function addToExisting(data, id) {
  let token = localStorage.getItem("_token");
  return axios.post(`${MAIN_URL}que/addtoexisting/${id}`, data, {
    headers: { authorization: `Bearer ${token}` },
  });
}
export function getAllque(email) {
  let token = localStorage.getItem("_token");
  return axios.get(`${MAIN_URL}que/getallque/${email}`, {
    headers: { authorization: `Bearer ${token}` },
  });
}

export function getAllqueSub(email, subject) {
  let token = localStorage.getItem("_token");
  return axios.get(`${MAIN_URL}que/getallquesub/${email}/${subject}`, {
    headers: { authorization: `Bearer ${token}` },
  });
}
export function addSignup(data) {
  return axios.post(`${MAIN_URL}user/signup`, data);
}

export function login(data) {
  return axios.post(`${MAIN_URL}user/login`, data);
}

export function delAndUpdate(email, paperid, data) {
  let token = localStorage.getItem("_token");
  return axios.put(`${MAIN_URL}que/delandupdate/${email}/${paperid}`, data, {
    headers: { authorization: `Bearer ${token}` },
  });
}
