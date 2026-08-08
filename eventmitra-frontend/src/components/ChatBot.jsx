import { useState } from "react";
import { askAI } from "../api/chatApi";

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi! 👋 I'm EventMitra AI. How can I help you today?"
        }
    ]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userMessage = {
            sender: "user",
            text: message
        };

        setMessages(prev => [...prev, userMessage]);
        setMessage("");
        setLoading(true);

        const reply = await askAI(message);

        setMessages(prev => [
            ...prev,
            {
                sender: "bot",
                text: reply
            }
        ]);

        setLoading(false);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontSize: "24px",
                    cursor: "pointer",
                    zIndex: 1000
                }}
            >
                💬
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "90px",
                        right: "20px",
                        width: "350px",
                        height: "500px",
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            background: "#2563eb",
                            color: "white",
                            padding: "15px",
                            fontWeight: "bold"
                        }}
                    >
                        EventMitra AI
                    </div>

                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "10px"
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    textAlign:
                                        msg.sender === "user"
                                            ? "right"
                                            : "left",
                                    marginBottom: "10px"
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        background:
                                            msg.sender === "user"
                                                ? "#2563eb"
                                                : "#e5e7eb",
                                        color:
                                            msg.sender === "user"
                                                ? "white"
                                                : "black",
                                        padding: "8px 12px",
                                        borderRadius: "10px"
                                    }}
                                >
                                    {msg.text}
                                </span>
                            </div>
                        ))}

                        {loading && <p>Thinking...</p>}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            padding: "10px",
                            borderTop: "1px solid #ddd"
                        }}
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: "8px"
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            style={{
                                marginLeft: "10px"
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatBot;