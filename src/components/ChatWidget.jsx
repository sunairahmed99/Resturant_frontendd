import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory, addMessage } from '../redux/slices/chatSlice';
import { API_URL } from '../apiurl';
import './ChatWidget.css';

const socket = io(API_URL);

const ChatWidget = () => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [roomId, setRoomId] = useState('');
    const [showNotification, setShowNotification] = useState(true);
    const chatBodyRef = useRef(null);
    const { messages: allMessages } = useSelector(state => state.chat);
    const messages = allMessages[roomId] || [];

    useEffect(() => {
        const timer = setTimeout(() => setShowNotification(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        let id = localStorage.getItem('chat_room_id');
        if (!id) {
            id = 'room_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_room_id', id);
        }
        setRoomId(id);

        dispatch(fetchChatHistory(id));
        socket.emit('join_room', id);

        socket.on('receive_message', (data) => {
            dispatch(addMessage(data));
        });

        return () => {
            socket.off('receive_message');
        };
    }, [dispatch]);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const messageData = {
            roomId,
            sender: 'User',
            senderType: 'user',
            text: inputText,
            timestamp: new Date().toISOString()
        };

        socket.emit('send_message', messageData);
        setInputText('');
    };

    return (
        <div className="chat-widget-wrapper">
            {showNotification && !isOpen && (
                <div className="chat-notification" onClick={() => setIsOpen(true)}>
                    How can I help you?
                </div>
            )}
            <div className="chat-bubble-btn" onClick={() => {
                setIsOpen(!isOpen);
                setShowNotification(false);
            }}>
                <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'} text-white fs-3`}></i>
            </div>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <img src="https://ui-avatars.com/api/?name=ZEST+%26+ZEST&background=075E54&color=fff" alt="Admin" />
                        <div>
                            <h6 className="m-0 fw-bold">ZEST & ZEST Support</h6>
                            <small className="opacity-75">Online</small>
                        </div>
                    </div>

                    <div className="chat-body" ref={chatBodyRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.senderType === 'user' ? 'sent' : 'received'}`}>
                                <div className="text">{msg.text}</div>
                                <div className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-footer">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <div className="send-btn" onClick={handleSendMessage}>
                            <i className="bi bi-send-fill"></i>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
