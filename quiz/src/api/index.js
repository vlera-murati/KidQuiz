import axios from "axios";

export const BASE_URL = 'http://localhost:65059/';
export const endpoints = {
  participant: 'Participants',
  questions: 'Questions',
  getAnswers: 'Questions/GetAnswers'
};

export const createApi = endpoint => {
  const url = `${BASE_URL}api/${endpoint}`;
  return {
    fetch: async () => await axios.get(url),
    fetchById: async (id) => await axios.get(`${url}/${id}`),
    post: async (newRecord) => await axios.post(url, newRecord),
    put: async (id, updateRecord) => await axios.put(`${url}/${id}`, updateRecord),
    delete: async (id) => await axios.delete(`${url}/${id}`)
  }
};
