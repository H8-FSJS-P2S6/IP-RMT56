import axios from 'axios'

export const p2Api = axios.create({
    baseURL: "https://rmt56.frenval.cloud"
})