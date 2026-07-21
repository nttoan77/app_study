// src/components/Chat/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import style from './ChatAI.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const ChatWindow = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        const userMsg = {
            text: text.trim(),
            isUser: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8888/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const data = await response.json();

            const botReply = data.success
                ? (data.data?.reply || data.reply || data.message || "Tôi đã nhận được tin nhắn của bạn.")
                : (data.message || "Có lỗi xảy ra, vui lòng thử lại.");

            const botMsg = {
                text: botReply,
                isUser: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            setMessages(prev => [...prev, {
                text: '❌ Không thể kết nối với server. Vui lòng thử lại sau.',
                isUser: false,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cx('chatWindow')}>
            {/* Header */}
            <div className={cx('header')}>
                <div className={cx('title')}>
                    Hỗ Trợ
                </div>
                <button className={cx('closeBtn')} onClick={onClose}>
                    ✕
                </button>
            </div>

            {/* Messages Container */}
            <div className={cx('messagesContainer')}>
                {messages.length === 0 && (
                    <div className={cx('welcomeMessage')}>
                        👋 Xin chào! Tôi có thể hỗ trợ bạn về CV, việc làm, phỏng vấn...
                    </div>
                )}

                {messages.map((msg, index) => (
                    <ChatMessage 
                        key={index} 
                        message={msg} 
                        isUser={msg.isUser} 
                    />
                ))}

                {isLoading && (
                    <div className={cx('loadingMessage')}>
                        <div className={cx('loadingSpinner')}></div>
                        Đang suy nghĩ...
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
            />
        </div>
    );
};

export default ChatWindow;