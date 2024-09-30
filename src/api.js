// api.js
import axios from "axios";

const API_KEY = "sk-abc123xyz";

export const getAssistantResponse = async (userInput) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching response from OpenAI:", error);
    throw new Error("Failed to fetch response from Assistant.");
  }
};
