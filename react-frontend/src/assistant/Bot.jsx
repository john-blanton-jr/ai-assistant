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
            event.preventDefault();  // Prevent the default action (creating a new line)
            handleSubmit(event);  // Submit the form
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const data = {
            chat_history: chatHistory,
            user_message: userMessage
        };
        
        // console.log(JSON.stringify(data));
        
        const chatUrl = "http://localhost:8000/chat/";
        const fetchConfig = {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        };
    
        // Add the user's message to the chat history before sending the request
        setChatHistory(prevChatHistory => [...prevChatHistory, {role: "user", content: userMessage}]);
        
        // Clear the text field immediately after sending the request
        setUserMessage("");
    
        const messageResponse = await fetch(chatUrl, fetchConfig);
        if (messageResponse.ok) {
            const response = await messageResponse.json();
            // console.log('Response:', response);
    
            // Extract the bot's message from the response
            const botMessageContent = response.bot_message;
    
            // Add the bot's response to the chat history
            setChatHistory(prevChatHistory => {
                const updatedChatHistory = [...prevChatHistory, {role: "assistant", content: botMessageContent}];
                // console.log('Updated chat history:', updatedChatHistory);
                return updatedChatHistory;
            });
        }
    }

    return (
        <div className="row">
            <div className="offset-3 col-6">
                <div className="shadow p-4 mt-4">
                    <h1 className="text-center">Chat</h1>
                    <div className="mt-4">
                        {chatHistory.map((message, index) => (
                            <p key={index}><strong>{message.role}:</strong> {message.content}</p>
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
