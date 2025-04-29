import { useState, useEffect } from "react";
import axios from "axios";

const ChatBot = ({ isDarkMode, setDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [listening, setListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Setup Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  // Setup Speech Recognition on Mount
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser!");
      return;
    }

    const recog = new window.webkitSpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setListening(false);
    };

    recog.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setErrorMessage(`Speech recognition failed: ${event.error}`);
      setListening(false);

      // Ensure recognition is not null before calling stop
      if (recognition) {
        recognition.stop(); // Stop any active recognition
        setRecognition(null); // Reset recognition
        // Optionally, restart recognition
        setTimeout(() => {
          const newRecog = new window.webkitSpeechRecognition();
          newRecog.continuous = false;
          newRecog.interimResults = false;
          newRecog.lang = "en-US";
          setRecognition(newRecog);
        }, 1000); // Restart after a short delay
      }
    };

    recog.onend = () => {
      setListening(false);
    };

    setRecognition(recog);
  }, []); // Empty array means this effect runs only once on mount

  const startListening = () => {
    if (recognition && !listening) {
      recognition.start();
      setListening(true);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await axios.post("http://localhost:8000/api/chat", {
        question: userInput,
      });
     
     
      const botMessage = response.data.answer || "No response from bot";

      // Speak the bot's message
      const utterance = new SpeechSynthesisUtterance(botMessage);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);

      setMessages([...newMessages, { sender: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error sending message to API:", error);

      const errorMessage = "Sorry, something went wrong.";
      const utterance = new SpeechSynthesisUtterance(errorMessage);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);

      setMessages([...newMessages, { sender: "bot", text: errorMessage }]);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full max-w-md h-[80vh] flex flex-col rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 text-center bg-green-600 dark:bg-green-700 text-white flex justify-between items-center">
          <h3 className="text-lg font-semibold">Chat with AI Bot</h3>
          <button
            onClick={startListening}
            className={`ml-2 px-3 py-1 rounded-full text-sm ${
              listening ? "bg-red-500" : "bg-white text-green-600"
            }`}
          >
            {listening ? "Listening..." : "🎤 Speak"}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>Ask me anything about plants and agriculture</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 text-center text-red-600">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBot;




