import axios from "axios";
import { useContext, useState } from "react"
import UserSessionContext from "../contexts/UserSessionContext";

const BASE_API_URL = '/api';

export default function useAxiosHttp() {
    const { userSession } = useContext(UserSessionContext)

    const post = async <Payload, Response>(path: string, data: Payload): Promise<HttpResponse<Response>> => {
        const response = await axios.post(`${BASE_API_URL}${path}`, data, {
            headers: {
                authorization: userSession.access_token
            }
        });

        return response.data;
    }

    const get = async <Response>(path: string): Promise<HttpResponse<Response>> => {
        const response = await axios.get(`${BASE_API_URL}${path}`, {
            headers: {
                authorization: userSession.access_token
            }
        });

        return response.data;
    }

    return { get, post };
}