// src/components/chat/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import style from './ChatAI.module.scss'; // ← Điều chỉnh đường dẫn nếu cần
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const ChatInput = ({ onSendMessage, isLoading }) => {
    const [inputText, setInputText] = useState('');
    const textareaRef = useRef(null);

    // Tự động điều chỉnh chiều cao textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [inputText]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() === '' || isLoading) return;

        onSendMessage(inputText.trim());
        setInputText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cx('inputArea')}>
            <div className={cx('inputWrapper')}>
                {/* Input Area */}
                <input
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn của bạn..."
                    rows="1"
                    className={cx('chatTextarea')}
                    disabled={isLoading}
                />

                {/* Send Button */}
                <button type="submit" disabled={!inputText.trim() || isLoading} className={cx('sendButton')}>
                    {isLoading ? (
                        <div className={cx('loadingSpinner')}></div>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={cx('sendIcon')}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.874L5.999 12zm0 0h7.07"
                            />
                        </svg>
                    )}
                </button>
            </div>

        </form>
    );
};

export default ChatInput;
