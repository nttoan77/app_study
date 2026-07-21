// src/features/notes/components/ReminderScheduler/ReminderScheduler.js
import { useEffect, useContext, useCallback, useRef } from 'react';
import { noteService } from '../../services/noteService';
import { useNotification } from '../../../../context/NotificationContext';
import { AuthContext } from '../../../../context/AuthContext';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8888';

function ReminderScheduler() {
    const { addNotification } = useNotification();
    const { user } = useContext(AuthContext);

    const socketRef = useRef(null);
    // Lưu Map gồm: key -> timestamp lúc bắn thông báo
    const notifiedMapRef = useRef(new Map());

    const triggerNotification = useCallback(
        (data) => {
            if (addNotification) {
                addNotification(data);
            }
        },
        [addNotification],
    );

    // Dọn dẹp cache để tránh lãng phí bộ nhớ và tránh bị kẹt key khi sửa lịch
    const cleanupOldKeys = useCallback(() => {
        const now = Date.now();
        const TEN_MINUTES = 10 * 60 * 1000;
        for (const [key, timestamp] of notifiedMapRef.current.entries()) {
            if (now - timestamp > TEN_MINUTES) {
                notifiedMapRef.current.delete(key);
            }
        }
    }, []);

    // 1. KẾT NỐI SOCKET REAL-TIME
    useEffect(() => {
        if (!user) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        const userId = (user._id || user.id)?.toString();
        if (!userId) return;

        if (!socketRef.current) {
            socketRef.current = io(SOCKET_URL, {
                transports: ['websocket'],
                autoConnect: true,
            });
        }

        const socket = socketRef.current;

        const joinUserRoom = () => {
            console.log('🔌 Socket kết nối, gia nhập Room:', userId);
            socket.emit('join_room', userId);
        };

        if (socket.connected) joinUserRoom();
        socket.on('connect', joinUserRoom);

        const handleNewNotification = (data) => {
            console.log('🔔 [SOCKET RECEIVED] Thông báo mới:', data);
            
            // Xóa cache cũ của Note này nếu có để nhận lịch mới vừa cập nhật
            const noteId = (data._id || data.id)?.toString();
            if (noteId) {
                for (const key of notifiedMapRef.current.keys()) {
                    if (key.startsWith(`${noteId}_`)) {
                        notifiedMapRef.current.delete(key);
                    }
                }
            }

            triggerNotification(data);
        };

        socket.on('new_notification', handleNewNotification);

        return () => {
            socket.off('connect', joinUserRoom);
            socket.off('new_notification', handleNewNotification);
        };
    }, [user, triggerNotification]);

    // 2. CHECK LỊCH DỰ PHÒNG (KHI SWITCH TAB & POLLING ĐỊNH KỲ)
    const checkUpcomingReminders = useCallback(async () => {
        if (!user) return;
        try {
            cleanupOldKeys();

            const res = await noteService.getReminders(`?t=${Date.now()}`);
            const notes = res?.data || res || [];
            const now = Date.now();

            notes.forEach((note) => {
                if (!note.reminderDate) return;

                const reminderTime = new Date(note.reminderDate).getTime();
                const noteId = (note._id || note.id)?.toString();
                if (!noteId || isNaN(reminderTime)) return;

                const uniqueReminderKey = `${noteId}_${reminderTime}`;

                // Điều kiện bắn: Đã đến/qua giờ nhắc + Trong vòng 5 phút trở lại + Chưa được báo
                const CATCH_UP_LIMIT = 5 * 60 * 1000; // 5 phút
                const isOverdue = now >= reminderTime;
                const isWithinCatchUpWindow = (now - reminderTime) <= CATCH_UP_LIMIT;
                const isNotNotifiedYet = !notifiedMapRef.current.has(uniqueReminderKey);

                if (isOverdue && isWithinCatchUpWindow && isNotNotifiedYet) {
                    notifiedMapRef.current.set(uniqueReminderKey, now);
                    triggerNotification(note);
                }
            });
        } catch (err) {
            console.error('❌ Lỗi kiểm tra lịch hẹn bù:', err);
        }
    }, [user, triggerNotification, cleanupOldKeys]);

    useEffect(() => {
        checkUpcomingReminders();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkUpcomingReminders();
            }
        };

        // Quét định kỳ mỗi 30 giây
        const intervalId = setInterval(checkUpcomingReminders, 30000);

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(intervalId);
        };
    }, [checkUpcomingReminders]);

    return null;
}

export default ReminderScheduler;