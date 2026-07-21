// src/context/NotificationContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission().then((permission) => {
                    console.log('🔔 Quyền thông báo hệ thống:', permission);
                });
            }
        }
    }, []);

    const addNotification = (note) => {
        const title = '⏰ Nhắc nhở lịch hẹn';
        const body = note.title
            ? `"${note.title}": ${note.content || 'Đã đến giờ hẹn!'}`
            : note.content || 'Bạn có một lịch hẹn cần kiểm tra.';

        const newNotif = {
            id: Date.now(),
            title: title,
            body: body,
            time: new Date(),
        };

        // 1. Lưu vào danh sách hiển thị trên UI
        setNotifications((prev) => [newNotif, ...prev]);

        // 2. Bắn System Notification ra OS/Trình duyệt
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                const noteId = note._id || note.id || 'notif';
                // Đảm bảo uniqueTag luôn mới bằng Date.now() để KHÔNG BAO GIỜ bị Chrome nuốt thông báo
                const uniqueTag = `reminder-${noteId}-${Date.now()}`;

                new Notification(title, {
                    body: body,
                    icon: '/logo192.png',
                    tag: uniqueTag,
                    renotify: true, // Ép hiển thị lại kể cả khi trùng tag
                });
            } catch (err) {
                console.error('❌ Không thể tạo System Notification:', err);
            }
        } else {
            alert(`⏰ NHẮC NHỞ:\n\n${body}`);
        }
    };

    return (
        <NotificationContext.Provider value={{ addNotification, notifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
