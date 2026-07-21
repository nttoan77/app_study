// src/components/chat/ChatMessage.jsx
import React from 'react';
import style from './ChatAI.module.scss';   // Điều chỉnh đường dẫn nếu cần
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

const ChatMessage = ({ message, isUser }) => {
    return (
        <div className={cx('messageWrapper', { user: isUser, bot: !isUser })}>
            <div className={cx('messageContainer', { user: isUser, bot: !isUser })}>
                
                {/* Avatar Bot */}
                {!isUser && (
                    <div className={cx('botAvatar')}>
                        bot
                    </div>
                )}

                {/* Bubble Message */}
                <div className={cx('messageBubble', { user: isUser, bot: !isUser })}>
                    {/* Nội dung tin nhắn */}
                    <p className={cx('messageText')}>
                        {message.text}
                    </p>

                    {/* Thời gian */}
                    <span className={cx('messageTime')}>
                        {message.time ||
                            new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;