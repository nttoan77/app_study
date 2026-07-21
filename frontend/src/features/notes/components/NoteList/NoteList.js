// // src/features/notes/components/NoteList.js
// import React from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteList.module.scss';
// import NoteItem from '../NoteItem/NoteItem'; 

// const cx = classNames.bind(styles);

// function NoteList({
//     notes = [],
//     onEdit,
//     onDelete,
//     onTogglePin,
//     loading = false,
//     isSubmitting = false, // Thêm để disable tương tác khi đang xử lý
// }) {
//     // ==================== LOADING STATE ====================
//     if (loading) {
//         return (
//             <div className={cx('loading')}>
//                 <div className={cx('spinner')}></div>
//                 Đang tải ghi chú...
//             </div>
//         );
//     }

//     // ==================== EMPTY STATE ====================
//     if (notes.length === 0) {
//         return (
//             <div className={cx('empty-state')}>
//                 <div className={cx('empty-icon')}>📝</div>
//                 <p>Chưa có ghi chú nào</p>
//                 <small>Hãy tạo ghi chú đầu tiên để theo dõi quá trình ứng tuyển của bạn.</small>
//             </div>
//         );
//     }

//     // ==================== SORT NOTES ====================
//     // const sortedNotes = [...notes].sort((a, b) => {
//     //     // Ưu tiên ghi chú được ghim
//     //     if (a.isPinned && !b.isPinned) return -1;
//     //     if (!a.isPinned && b.isPinned) return 1;

//     //     // Sau đó sắp theo thời gian mới nhất
//     //     return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
//     // });
//     const sortedNotes = [...notes].sort((a, b) => {
//         if (a.isPinned !== b.isPinned) return b.isPinned - a.isPinned;
    
//         return new Date(b.createdAt) - new Date(a.createdAt);
//     });

//     return (
//         <div className={cx('notes-list')}>
//             {sortedNotes.map((note) => (
//                 <NoteItem
//                     key={note._id || note.id} 
//                     note={note}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                     onTogglePin={onTogglePin}
//                     isSubmitting={isSubmitting}
//                 />
//             ))}
//         </div>
//     );
// }

// export default NoteList;


// ================

// src/features/notes/components/NoteList.js
import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './NoteList.module.scss';
import NoteItem from '../NoteItem/NoteItem'; 

const cx = classNames.bind(styles);

function NoteList({
    notes = [],
    onEdit,
    onDelete,
    onTogglePin,
    loading = false,
    isSubmitting = false, // Vô hiệu hóa tương tác khi đang xử lý
}) {

    // ==================== TỐI ƯU HÓA SẮP XẾP VỚI USEMEMO ====================
    // Chỉ tính toán sắp xếp lại khi mảng `notes` thực sự thay đổi
    const sortedNotes = useMemo(() => {
        if (!Array.isArray(notes) || notes.length === 0) return [];

        return [...notes].sort((a, b) => {
            // 1. Ưu tiên ghi chú được ghim lên đầu (true đứng trước false)
            if (!!a.isPinned !== !!b.isPinned) {
                return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
            }
        
            // 2. Chuyển đổi sang timestamp an toàn phòng trường hợp API lỗi/thiếu trường ngày tháng
            const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();

            // Sắp xếp giảm dần (Mới nhất lên đầu)
            return timeB - timeA;
        });
    }, [notes]);

    // ==================== TRẠNG THÁI LOADING ====================
    if (loading) {
        return (
            <div className={cx('loading')} aria-live="polite">
                <div className={cx('spinner')}></div>
                <span>Đang tải ghi chú...</span>
            </div>
        );
    }

    // ==================== TRẠNG THÁI DANH SÁCH TRỐNG ====================
    if (notes.length === 0) {
        return (
            <div className={cx('empty-state')}>
                <div className={cx('empty-icon')} role="img" aria-label="note-icon">📝</div>
                <p className={cx('empty-title')}>Chưa có ghi chú nào</p>
                <small className={cx('empty-desc')}>
                    Hãy tạo ghi chú đầu tiên để theo dõi quá trình ứng tuyển của bạn.
                </small>
            </div>
        );
    }

    // ==================== HIỂN THỊ DANH SÁCH GHI CHÚ ====================
    return (
        <div className={cx('notes-list')}>
            {sortedNotes.map((note, index) => {
                // Xác định key duy nhất an toàn tuyệt đối
                const itemKey = note._id || note.id || `temp-key-${index}`;

                return (
                    <NoteItem
                        key={itemKey} 
                        note={note}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onTogglePin={onTogglePin}
                        isSubmitting={isSubmitting}
                    />
                );
            })}
        </div>
    );
}

export default NoteList;