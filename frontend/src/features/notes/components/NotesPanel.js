// // src/features/notes/components/NotesPanel.js
// import React, { useState } from 'react';
// import classNames from 'classnames/bind';
// import styles from '../styles/NotesPanel.module.scss';

// import NoteList from './NoteList/NoteList';
// import NoteForm from './NoteForm/NoteForm';

// const cx = classNames.bind(styles);

// function NotesPanel({
//     applicationId,
//     notes = [],
//     onAddNote,
//     onUpdateNote,
//     onDeleteNote,
//     onTogglePin, // Ưu tiên dùng hàm toggle riêng nếu có
//     loading = false,
//     isSubmitting = false,
// }) {
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [editingNote, setEditingNote] = useState(null);

//     // Mở form thêm mới
//     const handleAddClick = () => {
//         setEditingNote(null);
//         setIsFormOpen(true);
//     };

//     // Mở form chỉnh sửa
//     const handleEdit = (note) => {
//         setEditingNote(note);
//         setIsFormOpen(true);
//     };

//     // Xử lý submit từ NoteForm
//     const handleSubmitNote = async (noteData, noteId = null) => {
//         try {
//             if (noteId) {
//                 // Cập nhật
//                 await onUpdateNote(noteId, noteData);
//             } else {
//                 // Tạo mới
//                 await onAddNote({
//                     ...noteData,
//                     applicationId, // Quan trọng: gán applicationId
//                 });
//             }

//             setIsFormOpen(false);
//             setEditingNote(null);
//         } catch (error) {
//             console.error('❌ Lỗi lưu ghi chú:', error);
//             alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu ghi chú!');
//         }
//     };

//     // Toggle Pin - Ưu tiên dùng hàm riêng nếu được truyền vào
//     const handleTogglePin = async (noteId) => {
//         if (onTogglePin) {
//             await onTogglePin(noteId); // Dùng hàm toggle chuyên dụng
//         } else {
//             // Fallback: dùng updateNote
//             const note = notes.find((n) => n._id === noteId || n.id === noteId);
//             if (note) {
//                 await onUpdateNote(noteId, { isPinned: !note.isPinned });
//             }
//         }
//     };

//     const handleCloseForm = () => {
//         setIsFormOpen(false);
//         setEditingNote(null);
//     };

//     return (
//         <div className={cx('notes-panel')}>
//             <div className={cx('panel-header')}>
//                 <h3>Ghi chú ứng tuyển</h3>
//                 <button className={cx('add-btn')} onClick={handleAddClick} disabled={isSubmitting}>
//                     + Thêm ghi chú
//                 </button>
//             </div>

//             <NoteList
//                 notes={notes}
//                 onEdit={handleEdit}
//                 onDelete={onDeleteNote}
//                 onTogglePin={handleTogglePin}
//                 loading={loading}
//                 isSubmitting={isSubmitting}
//             />

//             <NoteForm
//                 isOpen={isFormOpen}
//                 onClose={handleCloseForm}
//                 onSubmit={handleSubmitNote}
//                 initialData={editingNote}
//                 isSubmitting={isSubmitting}
//             />
//         </div>
//     );
// }

// export default NotesPanel;


// ================================================================
// src/features/notes/components/NotesPanel.js
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '../styles/NotesPanel.module.scss';

import NoteList from './NoteList/NoteList';
import NoteForm from './NoteForm/NoteForm';

const cx = classNames.bind(styles);

function NotesPanel({
    applicationId,
    notes = [],
    onAddNote,
    onUpdateNote,
    onDeleteNote,
    onTogglePin, // Hàm toggle chuyên dụng (nếu có)
    loading = false,
    isSubmitting = false,
}) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    // Tự động đóng form và reset state nếu người dùng đột ngột chuyển sang hồ sơ ứng tuyển khác
    useEffect(() => {
        handleCloseForm();
    }, [applicationId]);

    // Mở form thêm mới
    const handleAddClick = () => {
        setEditingNote(null);
        setIsFormOpen(true);
    };

    // Mở form chỉnh sửa
    const handleEdit = (note) => {
        setEditingNote(note);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingNote(null);
    };

    // ==================== XỬ LÝ LƯU GHI CHÚ (ĐỒNG BỘ THAM SỐ) ====================
    const handleSubmitNote = async (param1, param2) => {
        try {
            let noteId = null;
            let rawData = null;

            // Kỹ thuật phân tách tham số an toàn (Defensive Parameter Parsing)
            // Trường hợp 1: Form truyền đầy đủ (noteId, formData) -> Chế độ Edit
            if (typeof param1 === 'string' && param2) {
                noteId = param1;
                rawData = param2;
            } 
            // Trường hợp 2: Form chỉ truyền 1 tham số (formData) -> Chế độ Create
            else if (param1 && !param2) {
                if (param1._id || param1.id) {
                    noteId = param1._id || param1.id;
                    rawData = param1;
                } else {
                    rawData = param1;
                }
            }
            // Trường hợp 3: Nhận diện dự phòng nếu truyền ngược vị trí
            else if (param1 && param2) {
                noteId = param1._id || param1.id || (typeof param2 === 'string' ? param2 : null);
                rawData = typeof param1 === 'object' ? param1 : param2;
            }

            if (noteId) {
                // Thực hiện cập nhật
                await onUpdateNote(noteId, rawData);
            } else {
                // Tạo mới ghi chú kèm theo applicationId hiện tại
                await onAddNote({
                    ...rawData,
                    applicationId, 
                });
            }

            handleCloseForm();
        } catch (error) {
            console.error('❌ Lỗi lưu ghi chú:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu ghi chú!';
            alert(errorMsg);
        }
    };

    // ==================== XỬ LÝ GHIM GHI CHÚ (FALLBACK AN TOÀN) ====================
    const handleTogglePin = async (noteId) => {
        if (!noteId) return;

        try {
            if (onTogglePin) {
                await onTogglePin(noteId); // Sử dụng api chuyên dụng của backend
            } else if (onUpdateNote) {
                // Fallback: Tìm note trong danh sách local để đảo trạng thái ghim
                const note = notes.find((n) => {
                    const id = n._id || n.id;
                    return String(id) === String(noteId);
                });
                
                if (note) {
                    await onUpdateNote(noteId, { isPinned: !note.isPinned });
                }
            }
        } catch (error) {
            console.error('❌ Lỗi khi thay đổi trạng thái ghim:', error);
            alert('Không thể thay đổi trạng thái ghim lúc này!');
        }
    };

    // ==================== GIAO DIỆN ====================
    return (
        <div className={cx('notes-panel')}>
            <div className={cx('panel-header')}>
                <div className={cx('panel-title-group')}>
                    <h3>Ghi chú ứng tuyển</h3>
                    <span className={cx('count-badge')}>{notes.length}</span>
                </div>
                <button 
                    className={cx('add-btn')} 
                    onClick={handleAddClick} 
                    disabled={isSubmitting || loading}
                >
                    + Thêm ghi chú
                </button>
            </div>

            {/* Danh sách ghi chú */}
            <NoteList
                notes={notes}
                onEdit={handleEdit}
                onDelete={onDeleteNote}
                onTogglePin={handleTogglePin}
                loading={loading}
                isSubmitting={isSubmitting}
            />

            {/* Modal Form */}
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

export default NotesPanel;