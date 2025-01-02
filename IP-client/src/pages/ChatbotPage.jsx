import axios from "axios";
import { useState } from "react";
import "../assets/styles/global.css";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Send the user's message and get a response
  const sendMessage = async (userMessage) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/chat", // Make sure the API endpoint is correct
        { message: userMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Ensure token is available
          },
        }
      );

      // Debugging log to check response structure
      console.log("Response from server:", response.data);

      // If the response contains text
      if (response.data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: userMessage },
          { role: "bot", content: response.data.response },
        ]);
      }

      // If response contains buttons, render them as clickable options
      if (response.data.type === "buttons" && response.data.buttons) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: userMessage },
          {
            role: "bot",
            content: response.data.response,
            buttons: response.data.buttons,
          },
        ]);
      }
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle button click (to get FAQ answer)
  const handleButtonClick = async (buttonId) => {
    const faqList = [
      {
        id: 1,
        question: "What payment methods do you accept?",
        answer: "We accept credit cards payment through the Midtrans.",
      },
      {
        id: 2,
        question: "What is your return policy?",
        answer: "We offer a 7-day return policy.",
      },
      {
        id: 3,
        question: "Do you ship internationally?",
        answer: "No, we only ship in Indonesia.",
      },
      {
        id: 4,
        question: "How can I contact customer support?",
        answer: "Please reach out at support@ecommerce.com.",
      },
      {
        id: 5,
        question: "Are my payment details secure?",
        answer:
          "Yes, your payment details are securely processed using Midtrans gateway.",
      },
    ];

    // Find the corresponding question from faqList using the buttonId
    const faq = faqList.find((faqItem) => faqItem.id === buttonId);

    if (faq) {
      // Send the real question message
      const buttonMessage = faq.question;
      sendMessage(buttonMessage);
    } else {
      console.log("FAQ not found!");
    }
  };

  return (
    <div
      className="chat-container"
      style={{ maxHeight: "80vh", overflowY: "auto" }}
    >
      <div className="chatbox">
        {messages.map((msg, index) => {
          if (msg.buttons) {
            return (
              <div key={index}>
                <p>{msg.content}</p>
                <div className="buttons-container">
                  {msg.buttons.map((button) => (
                    <button
                      className="button"
                      key={button.id}
                      onClick={() => handleButtonClick(button.id)}
                    >
                      {button.question}
                    </button>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <p
                key={index}
                className={msg.role === "user" ? "message user" : "message bot"}
              >
                {msg.content}
              </p>
            );
          }
        })}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={() => sendMessage(input)}>Send</button>
      </div>
    </div>
  );
};

export default ChatbotPage;
