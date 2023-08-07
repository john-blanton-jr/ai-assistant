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
                    <div className="mt-4 d-flex flex-column align-items-start">
                        {chatHistory.map((message, index) => (
                            <div key={index} className={`d-flex ${message.role === "user" ? 'justify-content-end w-100' : 'justify-content-start w-100'}`}>
                                <div className={`mt-1 pt-2 px-3 fs-6 ${message.role === "user" ? 'bg-primary rounded-user' : 'bg-success rounded-assistant'} d-inline-block text-white`} style={{maxWidth: '75%'}}>
                                    <p style={{color: message.isActive ? 'white' : 'grey'}}>
                                        <strong>{message.role}:</strong> {message.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} id="create-presentation-form">
                        <div className="form-floating my-3">
                            <textarea
                                className="form-control"
                                required
                                onChange={handleUserMessageChange}
                                onKeyDown={handleKeyPress}
                                value={userMessage}
                                id="typeHere"
                                rows="1"
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
