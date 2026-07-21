// // src/features/notes/components/NoteItem.js
// import React from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteItem.module.scss';

// const cx = classNames.bind(styles);

// const NoteItem = ({
//     note,
//     onEdit,
//     onDelete,
//     onTogglePin,
//     isSubmitting = false,
// }) => {
//     const formatDate = (dateString) => {
//         if (!dateString) return 'Không rõ thời gian';

//         const date = new Date(dateString);
//         return date.toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     // Click vào card → mở chỉnh sửa
//     const handleCardClick = (e) => {
//         if (e.target.closest('button') || e.target.closest('.tag')) return;
//         onEdit(note);
//     };

//     // Click vào tag
//     const handleTagClick = (tag, e) => {
//         e.stopPropagation();
//         alert(`Tag: # ${tag}`);
//         // Ví dụ sau này: onTagFilter(tag);
//     };

//     const handleDelete = (e) => {
//         e.stopPropagation();
//         if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) {
//             onDelete(note._id || note.id);
//         }
//     };

//     const handleTogglePin = (e) => {
//         e.stopPropagation();
//         onTogglePin(note._id || note.id);
//     };

//     const handleEdit = (e) => {
//         e.stopPropagation();
//         onEdit(note);
//     };

//     return (
//         <div
//             className={cx('note-card', { pinned: note.isPinned })}
//             onClick={handleCardClick}
//         >
//             {/* Pin Icon */}
//             {note.isPinned && <div className={cx('pin-icon')}>★</div>}

//             {/* Title */}
//             {note.title && <h3 className={cx('note-title')}>{note.title}</h3>}

//             {/* Content */}
//             <p className={cx('note-content')}>{note.content}</p>

//             {/* Tags */}
//             {note.tags && note.tags.length > 0 && (
//                 <div className={cx('note-tags')}>
//                     {note.tags.map((tag, index) => (
//                         <span
//                             key={index}
//                             className={cx('tag')}
//                             onClick={(e) => handleTagClick(tag, e)}
//                         >
//                             #{tag}
//                         </span>
//                     ))}
//                 </div>
//             )}

//             {/* Footer */}
//             <div className={cx('note-footer')}>
//                 <span className={cx('note-date')}>
//                     {formatDate(note.createdAt || note.updatedAt)}
//                 </span>

//                 <div className={cx('note-actions')}>
//                     <button
//                         className={cx('action-btn', 'pin-btn')}
//                         onClick={handleTogglePin}
//                         disabled={isSubmitting}
//                         title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
//                     >
//                         {note.isPinned ? '★' : '☆'}
//                     </button>

//                     <button
//                         className={cx('action-btn', 'delete-btn')}
//                         onClick={handleDelete}
//                         disabled={isSubmitting}
//                         title="Xóa ghi chú"
//                     >
//                         🗑️
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default NoteItem;

// =============================
// src/features/notes/components/NoteItem.js
// import React, { useState } from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteItem.module.scss';

// const cx = classNames.bind(styles);

// const NoteItem = ({ note, onEdit, onDelete, onTogglePin, isSubmitting = false }) => {
//     const [showTagPopup, setShowTagPopup] = useState(null);

//     const formatDate = (dateString) => {
//         if (!dateString) return 'Không rõ thời gian';

//         const date = new Date(dateString);
//         return date.toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     // Click vào card → mở chỉnh sửa
//     const handleCardClick = (e) => {
//         if (e.target.closest('button') || e.target.closest('.tag')) return;
//         onEdit(note);
//     };

//     // Click vào tag → hiện popup to
//     const handleTagClick = (tag, e) => {
//         e.stopPropagation();
//         setShowTagPopup(tag);
//     };

//     const closeTagPopup = () => {
//         setShowTagPopup(null);
//     };

//     const handleDelete = (e) => {
//         e.stopPropagation();
//         if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) {
//             onDelete(note._id || note.id);
//         }
//     };

//     const handleTogglePin = (e) => {
//         e.stopPropagation();
//         onTogglePin(note._id || note.id);
//     };

//     const handleEdit = (e) => {
//         e.stopPropagation();
//         onEdit(note);
//     };

//     return (
//         <>
//             <div className={cx('note-card', { pinned: note.isPinned })} onClick={handleCardClick}>
//                 {/* Pin Icon */}
//                 {note.isPinned && <div className={cx('pin-icon')}>★</div>}

//                 {/* Title */}
//                 {note.title && <h3 className={cx('note-title')}>{note.title}</h3>}

//                 {/* Content */}
//                 <p className={cx('note-content')}>{note.content}</p>

//                 {/* Tags */}
//                 {note.tags && note.tags.length > 0 && (
//                     <div className={cx('note-tags')}>
//                         {note.tags.map((tag, index) => (
//                             <span key={index} className={cx('tag')} onClick={(e) => handleTagClick(tag, e)}>
//                                 # {tag}
//                             </span>
//                         ))}
//                     </div>
//                 )}

//                 {/* Footer */}
//                 <div className={cx('note-footer')}>
//                     <span className={cx('note-date')}>{formatDate(note.createdAt || note.updatedAt)}</span>

//                     <div className={cx('note-actions')}>
//                         <button
//                             className={cx('action-btn', 'pin-btn')}
//                             onClick={handleTogglePin}
//                             disabled={isSubmitting}
//                             title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
//                         >
//                             {note.isPinned ? '★' : '☆'}
//                         </button>


//                         <button
//                             className={cx('action-btn', 'delete-btn')}
//                             onClick={handleDelete}
//                             disabled={isSubmitting}
//                             title="Xóa ghi chú"
//                         >
//                             🗑️
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* ==================== TAG POPUP TO Ở GIỮA MÀN HÌNH ==================== */}
//             {showTagPopup && (
//                 <div className={cx('tag-popup-overlay')} onClick={closeTagPopup}>
//                     <div className={cx('tag-popup')} onClick={(e) => e.stopPropagation()}>
//                         <button className={cx('close-popup')} onClick={closeTagPopup}>
//                             ✕
//                         </button>

//                         <div className={cx('tag-content')}>
//                             <p className={cx('tag-subtitle')}>Ư điểm được chọn là: </p>
//                             <span className={cx('big-tag')}> {showTagPopup}</span>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default NoteItem;


// =========================================================


// // src/features/notes/components/NoteItem.js
// import React, { useState } from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteItem.module.scss';

// const cx = classNames.bind(styles);

// const NoteItem = ({ note, onEdit, onDelete, onTogglePin, isSubmitting = false }) => {
//     const [showTagPopup, setShowTagPopup] = useState(null);

//     const formatDate = (dateString) => {
//         if (!dateString) return 'Không rõ thời gian';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     // Format ngày nhắc nhở
//     const formatReminderDate = (dateString) => {
//         if (!dateString) return null;
//         const date = new Date(dateString);
//         return date.toLocaleDateString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     const handleCardClick = (e) => {
//         if (e.target.closest('button') || e.target.closest('.tag')) return;
//         onEdit(note);
//     };

//     const handleTagClick = (tag, e) => {
//         e.stopPropagation();
//         setShowTagPopup(tag);
//     };

//     const closeTagPopup = () => setShowTagPopup(null);

//     const handleDelete = (e) => {
//         e.stopPropagation();
//         if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) {
//             onDelete(note._id || note.id);
//         }
//     };

//     const handleTogglePin = (e) => {
//         e.stopPropagation();
//         onTogglePin(note._id || note.id);
//     };

//     const handleEdit = (e) => {
//         e.stopPropagation();
//         onEdit(note);
//     };

//     const reminderText = formatReminderDate(note.reminderDate);

//     return (
//         <>
//             <div className={cx('note-card', { pinned: note.isPinned })} onClick={handleCardClick}>
//                 {/* Pin Icon */}
//                 {note.isPinned && <div className={cx('pin-icon')}>★</div>}

//                 {/* Title */}
//                 {note.title && <h3 className={cx('note-title')}>{note.title}</h3>}

//                 {/* Content */}
//                 <p className={cx('note-content')}>{note.content}</p>

//                 {/* Reminder Date */}
//                 {reminderText && (
//                     <div className={cx('reminder-info')}>
//                         Nhắc nhở: <strong>{reminderText}</strong>
//                     </div>
//                 )}

//                 {/* Tags */}
//                 {note.tags && note.tags.length > 0 && (
//                     <div className={cx('note-tags')}>
//                         {note.tags.map((tag, index) => (
//                             <span 
//                                 key={index} 
//                                 className={cx('tag')} 
//                                 onClick={(e) => handleTagClick(tag, e)}
//                             >
//                                 # {tag}
//                             </span>
//                         ))}
//                     </div>
//                 )}

//                 {/* Footer */}
//                 <div className={cx('note-footer')}>
//                     <span className={cx('note-date')}>
//                         {formatDate(note.createdAt || note.updatedAt)}
//                     </span>

//                     <div className={cx('note-actions')}>
//                         <button
//                             className={cx('action-btn', 'pin-btn')}
//                             onClick={handleTogglePin}
//                             disabled={isSubmitting}
//                             title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
//                         >
//                             {note.isPinned ? '★' : '☆'}
//                         </button>

//                         <button
//                             className={cx('action-btn', 'delete-btn')}
//                             onClick={handleDelete}
//                             disabled={isSubmitting}
//                             title="Xóa ghi chú"
//                         >
//                             🗑️
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Tag Popup */}
//             {showTagPopup && (
//                 <div className={cx('tag-popup-overlay')} onClick={closeTagPopup}>
//                     <div className={cx('tag-popup')} onClick={(e) => e.stopPropagation()}>
//                         <button className={cx('close-popup')} onClick={closeTagPopup}>✕</button>
//                         <div className={cx('tag-content')}>
//                             <p className={cx('tag-subtitle')}>Tag được chọn là:</p>
//                             <span className={cx('big-tag')}>{showTagPopup}</span>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default NoteItem;

// ======================================
// src/features/notes/components/NoteItem.js
// import React, { useState } from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteItem.module.scss';

// const cx = classNames.bind(styles);

// const NoteItem = ({ note, onEdit, onDelete, onTogglePin, isSubmitting = false }) => {
//     const [showTagPopup, setShowTagPopup] = useState(null);

//     // ==================== FORMAT DATE ====================
//     const formatDate = (dateString) => {
//         if (!dateString) return 'Không rõ thời gian';

//         return new Date(dateString).toLocaleString('vi-VN', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     };

//     // ==================== REMINDER DATE ====================
//     const reminderText = note.reminderDate
//         ? new Date(note.reminderDate).toLocaleString('vi-VN', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit',
//           })
//         : null;

//     // ==================== EVENTS ====================
//     const handleCardClick = (e) => {
//         if (e.target.closest('button') || e.target.closest(`.${cx('tag')}`)) return;
//         onEdit(note);
//     };

//     const handleTagClick = (tag, e) => {
//         e.stopPropagation();
//         setShowTagPopup(tag);
//     };

//     const closeTagPopup = () => setShowTagPopup(null);

//     const handleDelete = (e) => {
//         e.stopPropagation();
//         if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) {
//             onDelete(note._id);
//         }
//     };

//     const handleTogglePin = (e) => {
//         e.stopPropagation();
//         onTogglePin(note._id);
//     };

//     // ==================== UI ====================
//     return (
//         <>
//             <div className={cx('note-card', { pinned: note.isPinned })} onClick={handleCardClick}>
//                 {/* PIN */}
//                 {note.isPinned && <div className={cx('pin-icon')}>★</div>}

//                 {/* TITLE */}
//                 {note.title && <h3 className={cx('note-title')}>{note.title}</h3>}

//                 {/* CONTENT */}
//                 <p className={cx('note-content')}>{note.content}</p>

//                 {/* REMINDER */}
//                 {note.reminderDate && (
//                     <div className={cx('reminder-info')}>
//                         📅 Nhắc: <strong>{reminderText}</strong>
//                     </div>
//                 )}

//                 {/* STATUS (optional nhưng rất nên có) */}
//                 {note.isNotified && (
//                     <div className={cx('status-done')}>
//                         🔔 Đã nhắc
//                     </div>
//                 )}

//                 {note.reminderDate && !note.isNotified && (
//                     <div className={cx('status-pending')}>
//                         ⏳ Chưa tới giờ
//                     </div>
//                 )}

//                 {/* TAGS */}
//                 {note.tags?.length > 0 && (
//                     <div className={cx('note-tags')}>
//                         {note.tags.map((tag, index) => (
//                             <span
//                                 key={index}
//                                 className={cx('tag')}
//                                 onClick={(e) => handleTagClick(tag, e)}
//                             >
//                                 # {tag}
//                             </span>
//                         ))}
//                     </div>
//                 )}

//                 {/* FOOTER */}
//                 <div className={cx('note-footer')}>
//                     <span className={cx('note-date')}>
//                         {formatDate(note.createdAt || note.updatedAt)}
//                     </span>

//                     <div className={cx('note-actions')}>
//                         <button
//                             className={cx('action-btn', 'pin-btn')}
//                             onClick={handleTogglePin}
//                             disabled={isSubmitting}
//                             title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
//                         >
//                             {note.isPinned ? '★' : '☆'}
//                         </button>

//                         <button
//                             className={cx('action-btn', 'delete-btn')}
//                             onClick={handleDelete}
//                             disabled={isSubmitting}
//                             title="Xóa ghi chú"
//                         >
//                             🗑️
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* TAG POPUP */}
//             {showTagPopup && (
//                 <div className={cx('tag-popup-overlay')} onClick={closeTagPopup}>
//                     <div className={cx('tag-popup')} onClick={(e) => e.stopPropagation()}>
//                         <button className={cx('close-popup')} onClick={closeTagPopup}>
//                             ✕
//                         </button>
//                         <div className={cx('tag-content')}>
//                             <p>Tag được chọn:</p>
//                             <span className={cx('big-tag')}>{showTagPopup}</span>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default NoteItem;


// ================

// src/features/notes/components/NoteItem.js
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './NoteItem.module.scss';

const cx = classNames.bind(styles);

const NoteItem = ({ note, onEdit, onDelete, onTogglePin, isSubmitting = false }) => {
    const [showTagPopup, setShowTagPopup] = useState(null);

    // Xác định ID an toàn cho cả MongoDB (_id) và các DB khác (id)
    const noteId = note._id || note.id;

    // ==================== HÀM FORMAT DATE AN TOÀN ====================
    const safeFormatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        
        // Kiểm tra xem ngày tháng có hợp lệ không trước khi format
        if (isNaN(date.getTime())) {
            return 'Ngày không hợp lệ';
        }

        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formattedCreatedAt = safeFormatDate(note.createdAt || note.updatedAt) || 'Không rõ thời gian';
    const reminderText = safeFormatDate(note.reminderDate);

    // ==================== XỬ LÝ SỰ KIỆN ====================
    const handleCardClick = (e) => {
        // Nếu click trúng nút bấm, tag hoặc đang trong quá trình submit -> Không mở edit
        if (
            e.target.closest('button') || 
            e.target.closest(`.${cx('tag')}`) || 
            isSubmitting
        ) return;
        
        onEdit(note);
    };

    const handleTagClick = (tag, e) => {
        e.stopPropagation();
        setShowTagPopup(tag);
    };

    const closeTagPopup = () => setShowTagPopup(null);

    const handleDelete = (e) => {
        e.stopPropagation();
        if (!noteId) return;

        if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này không?')) {
            onDelete(noteId);
        }
    };

    const handleTogglePin = (e) => {
        e.stopPropagation();
        if (!noteId) return;
        
        onTogglePin(noteId);
    };

    // ==================== GIAO DIỆN ====================
    return (
        <>
            <div 
                className={cx('note-card', { 
                    pinned: note.isPinned,
                    submitting: isSubmitting // Thêm class để bạn dễ dàng CSS mờ card đi khi đang xử lý
                })} 
                onClick={handleCardClick}
            >
                {/* ICON GHIM */}
                {note.isPinned && <div className={cx('pin-icon')}>★</div>}

                {/* TIÊU ĐỀ */}
                {note.title && <h3 className={cx('note-title')}>{note.title}</h3>}

                {/* NỘI DUNG */}
                <p className={cx('note-content')}>{note.content}</p>

                {/* THỜI GIAN NHẮC NHỞ */}
                {reminderText && (
                    <div className={cx('reminder-info')}>
                        📅 Nhắc: <strong>{reminderText}</strong>
                    </div>
                )}

                {/* TRẠNG THÁI NHẮC NHỞ */}
                {note.reminderDate && (
                    note.isNotified ? (
                        <div className={cx('status-tag', 'done')}>
                            🔔 Đã nhắc nhở
                        </div>
                    ) : (
                        <div className={cx('status-tag', 'pending')}>
                            ⏳ Chưa tới giờ
                        </div>
                    )
                )}

                {/* DANH SÁCH TAGS */}
                {note.tags && note.tags.length > 0 && (
                    <div className={cx('note-tags')}>
                        {note.tags.map((tag, index) => (
                            <span
                                key={`${tag}-${index}`} // Kết hợp tag và index để có key duy nhất tuyệt đối
                                className={cx('tag')}
                                onClick={(e) => handleTagClick(tag, e)}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* PHẦN DƯỚI CÙNG (FOOTER CARD) */}
                <div className={cx('note-footer')}>
                    <span className={cx('note-date')}>
                        {formattedCreatedAt}
                    </span>

                    <div className={cx('note-actions')}>
                        {/* Nút Ghim */}
                        <button
                            className={cx('action-btn', 'pin-btn', { active: note.isPinned })}
                            onClick={handleTogglePin}
                            disabled={isSubmitting}
                            title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
                            type="button"
                        >
                            {note.isPinned ? '★' : '☆'}
                        </button>

                        {/* Nút Xóa */}
                        <button
                            className={cx('action-btn', 'delete-btn')}
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            title="Xóa ghi chú"
                            type="button"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            </div>

            {/* ==================== MODAL XEM CHI TIẾT TAG ==================== */}
            {showTagPopup && (
                <div className={cx('tag-popup-overlay')} onClick={closeTagPopup}>
                    <div className={cx('tag-popup')} onClick={(e) => e.stopPropagation()}>
                        <button className={cx('close-popup')} onClick={closeTagPopup} type="button">
                            ✕
                        </button>
                        <div className={cx('tag-content')}>
                            <p>Tag được chọn là:</p>
                            <span className={cx('big-tag')}>#{showTagPopup}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NoteItem;