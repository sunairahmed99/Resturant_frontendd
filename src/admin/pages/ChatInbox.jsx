import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveRooms, fetchChatHistory, addRoom, addMessage } from '../../redux/slices/chatSlice';
import { API_URL } from '../../apiurl';
import './ChatInbox.css';

const socket = io(API_URL);

const ChatInbox = () => {
    const dispatch = useDispatch();
    const { rooms, messages } = useSelector(state => state.chat);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [inputText, setInputText] = useState('');
    const chatBodyRef = useRef(null);

    useEffect(() => {
        socket.emit('join_room', 'admins');
        dispatch(fetchActiveRooms());

        socket.on('receive_message', (data) => {
            dispatch(addMessage(data));
            dispatch(addRoom(data.roomId));
        });

        return () => {
            socket.off('receive_message');
        };
    }, [dispatch]);

    useEffect(() => {
        if (!selectedRoom) return;
        dispatch(fetchChatHistory(selectedRoom));
    }, [selectedRoom, dispatch]);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [selectedRoom, messages]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !selectedRoom) return;

        const messageData = {
            roomId: selectedRoom,
            sender: 'Admin',
            senderType: 'admin',
            text: inputText,
            timestamp: new Date().toISOString()
        };

        socket.emit('send_message', messageData);
        setInputText('');
    };

    const handleSelectRoom = (roomId) => {
        setSelectedRoom(roomId);
        socket.emit('join_room', roomId);
    };

    return (
        <div className="chat-inbox-container">
            {/* Sidebar: Chat List */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h5>Active Chats</h5>
                </div>
                <div className="chat-list">
                    {rooms.length === 0 ? (
                        <div className="p-4 text-center text-muted">No active chats</div>
                    ) : (
                        rooms.map(roomId => (
                            <div
                                key={roomId}
                                className={`chat-list-item ${selectedRoom === roomId ? 'active' : ''}`}
                                onClick={() => handleSelectRoom(roomId)}
                            >
                                <div className="room-avatar">
                                    {roomId.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="room-info">
                                    <div className="room-name text-truncate">User: {roomId}</div>
                                    <div className="room-last-msg">
                                        {messages[roomId]?.[messages[roomId].length - 1]?.text || 'Started a conversation'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main: Chat View */}
            <div className="chat-main">
                {selectedRoom ? (
                    <>
                        <div className="chat-main-header">
                            <div className="room-avatar avatar">
                                {selectedRoom.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="info">
                                <h6>{selectedRoom}</h6>
                                <small>Active Now</small>
                            </div>
                        </div>

                        <div className="chat-messages" ref={chatBodyRef}>
                            {messages[selectedRoom]?.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`msg-wrapper ${msg.senderType === 'admin' ? 'sent' : 'received'}`}
                                >
                                    <div className="msg-bubble">
                                        <div className="msg-text">{msg.text}</div>
                                        <div className="msg-footer">
                                            <span className="msg-time">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="chat-main-footer">
                            <div className="chat-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Type a message"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                            </div>
                            <button className="send-btn-circle" onClick={handleSendMessage}>
                                <i className="bi bi-send-fill"></i>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <i className="bi bi-chat-dots"></i>
                        <h4>WhatsApp Web for Admin</h4>
                        <p>Select a user to start chatting and providing support.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInbox;
