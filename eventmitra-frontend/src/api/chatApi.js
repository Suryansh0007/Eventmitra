import axios from "axios";
import { apiUrl } from "./baseUrl";

const BASE_URL = apiUrl("/api/chat");

export const askAI = async (message) => {
    try {
        const response = await axios.post(
            BASE_URL,
            {
                message: message,
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);

        return "Sorry, I'm unable to respond right now. Please try again.";
    }
};
