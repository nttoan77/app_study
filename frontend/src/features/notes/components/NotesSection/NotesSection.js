// src/features/notes/components/NotesSection.js
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './NotesSection.module.scss';

import useGeneralNotes from '../../hooks/useGeneralNotes';
import NoteList from '../NoteList/NoteList';
import NoteForm from '../NoteForm/NoteForm';

const cx = classNames.bind(styles);

function NotesSection() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    // State lưu danh sách ID ghi chú đã hiển thị thông báo để tránh lặp lại trong phiên làm việc
    const [notifiedIds, setNotifiedIds] = useState(new Set());

    const { notes, loading, isSubmitting, addNote, updateNote, deleteNote, togglePin } = useGeneralNotes();

    // Log kiểm tra số lượng ghi chú khi có sự thay đổi
    // useEffect(() => {
    //     // console.log('📋 [NotesSection] Loaded - Total notes:', notes?.length || 0);
    // }, [notes]);

    // ==================== BỘ QUÉT THỜI GIAN NHẮC NHỞ (SCHEDULER) ====================

    // 1. Yêu cầu quyền thông báo từ trình duyệt khi ứng dụng khởi chạy
    useEffect(() => {
        if ('Notification' in window) {
            if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
                Notification.requestPermission().then((permission) => console.log('🔔 Quyền thông báo:', permission));
            }
        }
    }, []);

    // 2. Định nghĩa hàm gửi thông báo hệ thống và dự phòng (Fallback)
    const sendSystemNotification = (note) => {
        const title = '⏰ Nhắc nhở ghi chú';
        const body = note.title
            ? `"${note.title}": ${note.content || 'Đã đến giờ hẹn!'}`
            : note.content || 'Bạn có một lịch hẹn cần kiểm tra.';

        // Ưu tiên 1: Gửi thông báo đẩy của Trình duyệt (System Notification)
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: body,
                    icon: '/logo192.png',
                    tag: `reminder-${note._id || note.id}`,
                });
                return;
            } catch (err) {
                console.error('❌ Không thể tạo System Notification:', err);
            }
        }

        // Ưu tiên 2: Fallback sang alert truyền thống nếu bị chặn/không hỗ trợ
        alert(`⏰ NHẮC NHỞ:\n\n${body}`);
    };

    // 3. Effect chạy vòng lặp kiểm tra thời gian mỗi 15 giây
    useEffect(() => {
        if (!notes || notes.length === 0) return;

        const checkReminders = () => {
            const now = new Date();

            notes.forEach((note) => {
                const noteId = note._id || note.id;

                // Bỏ qua nếu không có lịch hẹn hoặc đã thông báo rồi
                if (!note.reminderDate || notifiedIds.has(noteId)) return;

                const reminderTime = new Date(note.reminderDate);
                const timeDiff = now.getTime() - reminderTime.getTime();

                // ĐIỀU KIỆN KÍCH HOẠT:
                // - timeDiff >= 0: Đã đến hoặc vượt qua thời gian hẹn
                // - timeDiff < 60000: Nằm trong phạm vi trễ dưới 1 phút (tránh lôi lại các ghi chú cũ từ lịch sử ra thông báo)
                if (timeDiff >= 0 && timeDiff < 60000) {
                    // Đánh dấu đã gửi để không bị lặp ở chu kỳ quét sau
                    setNotifiedIds((prev) => new Set(prev).add(noteId));

                    // Thực hiện bắn thông báo
                    sendSystemNotification(note);
                }
            });
        };

        // Chạy kiểm tra ngay lập tức và thiết lập vòng lặp định kỳ
        checkReminders();
        const intervalId = setInterval(checkReminders, 15000); // Quét mỗi 15 giây để tăng độ chính xác

        return () => clearInterval(intervalId);
    }, [notes, notifiedIds]);

    // ==================== XỬ LÝ ĐÓNG MỞ FORM ====================
    const handleAddNew = () => {
        setEditingNote(null);
        setIsFormOpen(true);
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingNote(null);
    };

    // ==================== XỬ LÝ LƯU GHI CHÚ (KHÁNG LỖI THAM SỐ) ====================
    const handleSubmitNote = async (param1, param2) => {
        try {
            let noteId = null;
            let noteData = null;

            // Kỹ thuật phân tách tham số an toàn (Defensive Parameter Parsing)
            if (typeof param1 === 'string' && param2) {
                noteId = param1;
                noteData = param2;
            } else if (param1 && !param2) {
                if (param1._id || param1.id) {
                    noteId = param1._id || param1.id;
                    noteData = param1;
                } else {
                    noteData = param1;
                }
            } else if (param1 && param2) {
                noteId = param1._id || param1.id || (typeof param2 === 'string' ? param2 : null);
                noteData = typeof param1 === 'object' ? param1 : param2;
            }

            // Tiến hành gọi API thông qua Hook
            if (noteId) {
                await updateNote(noteId, noteData);
                // Xoá khỏi danh sách "đã thông báo" nếu người dùng sửa lại giờ hẹn mới
                setNotifiedIds((prev) => {
                    const next = new Set(prev);
                    next.delete(noteId);
                    return next;
                });
            } else {
                await addNote(noteData);
            }

            // Đóng form và làm sạch state sau khi thành công
            handleCloseForm();
        } catch (error) {
            console.error('❌ Lỗi khi lưu ghi chú:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu ghi chú!';
            alert(errorMsg);
        }
    };

    // ==================== GIAO DIỆN ====================
    return (
        <div className={cx('notes-section')}>
            <div className={cx('section-header')}>
                <div className={cx('header-title-wrapper')}>
                    <h2>Ghi chú của tôi</h2>
                    <span className={cx('note-count-badge')}>{notes?.length || 0}</span>
                </div>
                <button className={cx('add-note-btn')} onClick={handleAddNew} disabled={isSubmitting || loading}>
                    + Thêm ghi chú mới
                </button>
            </div>

            {/* Danh sách ghi chú */}
            <NoteList
                notes={notes}
                onEdit={handleEdit}
                onDelete={deleteNote}
                onTogglePin={togglePin}
                loading={loading}
                isSubmitting={isSubmitting}
            />

            {/* Modal Form thêm/sửa ghi chú */}
            {isFormOpen && (
                <NoteForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    onSubmit={handleSubmitNote}
                    initialData={editingNote}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}

export default NotesSection;
