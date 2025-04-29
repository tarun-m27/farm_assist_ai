const axios = require("axios");

const handleChat = async (req, res) => {
  
  console.log("UBJASBJCJSC")
  if (!req.is("application/json")) {
    return res.status(415).json({ error: "Request must be JSON" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert agriculture advisor. Provide accurate and detailed farming-related answers in both English and Kannada. Ensure the Kannada translation is precise, culturally appropriate, and uses correct agricultural terminology. If the question is not related to farming, politely decline to answer.",
          },
          { role: "user", content: question },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "AgriBot",
        },
      }
    );




    if (response.data.choices && response.data.choices.length > 0) {
      const answer = response.data.choices[0].message.content;
      return res.json({ answer });
    } else {
      return res.status(500).json({ error: "No response from OpenAI" });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res
      .status(500)
      .json({ error: `API request failed: ${error.message}` });
  }
};

module.exports = { handleChat };
