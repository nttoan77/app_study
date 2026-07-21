// src/components/Chat/ChatButton.jsx
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import style from './ChatAI.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

function ChatButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Nút Chat nổi */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cx('chatButton')}
                title="Mở chatbot"
            >
                <MessageCircle size={28} />
            </button>

            {/* Chat Window */}
            {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
        </>
    );
}

export default ChatButton;