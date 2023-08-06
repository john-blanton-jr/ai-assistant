import React, { useState } from 'react';

function BotChat() {
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleUserMessageChange = (event) => {
        const value = event.target.value;
        setUserMessage(value);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit(event);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        let activeChatHistory = [...chatHistory, {role: "user", content: userMessage, isActive: true}];

        while (activeChatHistory.reduce((acc, msg) => acc + msg.content.split(' ').length, 0) * 3 > 4000) {
            activeChatHistory[0].isActive = false;
            activeChatHistory.shift();
        }

        const data = {
            chat_history: activeChatHistory,
            user_message: userMessage
        };

        const chatUrl = "http://localhost:8000/chat/";
        const fetchConfig = {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        };

        setChatHistory(prevChatHistory => [...prevChatHistory, {role: "user", content: userMessage, isActive: true}]);
        setUserMessage("");

        const messageResponse = await fetch(chatUrl, fetchConfig);
        if (messageResponse.ok) {
            const response = await messageResponse.json();
            const botMessageContent = response.bot_message;
            setChatHistory(prevChatHistory => [...prevChatHistory, {role: "assistant", content: botMessageContent, isActive: true}]);
        }
    }

    return (
        <div className="row">
            <div className="offset-3 col-6">
                <div className="shadow p-4 mt-4">
                    <h1 className="text-center">Chat</h1>
                    <div className="mt-4">
                        {chatHistory.map((message, index) => (
                            <p key={index} style={{color: message.isActive ? 'black' : 'grey'}}>
                                <strong>{message.role}:</strong> {message.content}
                            </p>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} id="create-presentation-form">
                        <div className="form-floating mb-3">
                            <textarea
                                className="form-control"
                                required
                                onChange={handleUserMessageChange}
                                onKeyDown={handleKeyPress}
                                value={userMessage}
                                id="typeHere"
                                rows="3"
                                maxLength="1500"
                            ></textarea>
                            <label htmlFor="typeHere"></label>
                        </div>
                        <button className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BotChat;
