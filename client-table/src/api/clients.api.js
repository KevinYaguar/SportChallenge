import axios from 'axios';

const clientApi = axios.create({
    baseURL: "http://localhost:8000/client/api/v1/client/"
})

export const getAllClients = () => clientApi.get("/")

export const deleteClient = (id) => clientApi.delete(`${id}`)