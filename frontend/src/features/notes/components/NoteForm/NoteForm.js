// // src/features/notes/components/NoteForm.js
// import React, { useState, useEffect } from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteForm.module.scss';

// const cx = classNames.bind(styles);

// function NoteForm({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false, title = '' }) {
//     const [formData, setFormData] = useState({
//         title: '',
//         content: '',
//         tags: '',
//         isPinned: false,
//     });

//     // Reset / Fill form khi modal mở hoặc initialData thay đổi
//     useEffect(() => {
//         if (initialData) {
//             setFormData({
//                 title: initialData.title || '',
//                 content: initialData.content || '',
//                 tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
//                 isPinned: !!initialData.isPinned,
//             });
//         } else {
//             setFormData({
//                 title: '',
//                 content: '',
//                 tags: '',
//                 isPinned: false,
//             });
//         }
//     }, [initialData, isOpen]);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     // ==================== CHỮA Ở ĐÂY ====================
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.content.trim()) {
//             alert('Vui lòng nhập nội dung ghi chú!');
//             return;
//         }

//         const tagsArray = formData.tags
//             ? formData.tags
//                   .split(',')
//                   .map((tag) => tag.trim())
//                   .filter(Boolean)
//             : [];

//         const noteData = {
//             title: formData.title.trim(),
//             content: formData.content.trim(),
//             tags: tagsArray,
//             isPinned: formData.isPinned,
//         };

//         try {
//             // Debug log giúp xem dữ liệu đang gửi gì
//             console.log('📤 [NoteForm] Sending data:', {
//                 isUpdate: !!initialData,
//                 noteId: initialData?._id || initialData?.id,
//                 noteData,
//             });

//             if (initialData) {
//                 // Mode Edit - ĐÃ SỬA: Đảm bảo thứ tự tham số đúng
//                 const noteId = initialData._id || initialData.id;

//                 if (!noteId) {
//                     throw new Error('Không tìm thấy ID ghi chú để cập nhật');
//                 }

//                 await onSubmit(noteId, noteData); // ← Quan trọng: id trước, data sau
//             } else {
//                 // Mode Create
//                 await onSubmit(noteData);
//             }

//             onClose(); // Đóng modal sau khi submit thành công
//         } catch (error) {
//             console.error('❌ Lỗi lưu note:', error);
//             alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu ghi chú!');
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className={cx('modal-overlay')}>
//             <div className={cx('modal-content')}>
//                 <div className={cx('modal-header')}>
//                     <h3>{title || (initialData ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới')}</h3>
//                     <button className={cx('close-btn')} onClick={onClose} type="button" disabled={isSubmitting}>
//                         ✕
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     <div className={cx('form-group')}>
//                         <label htmlFor="title">Tiêu đề ghi chú</label>
//                         <input
//                             type="text"
//                             id="title"
//                             name="title"
//                             value={formData.title}
//                             onChange={handleChange}
//                             placeholder="Ví dụ: Câu hỏi phỏng vấn React"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div className={cx('form-group')}>
//                         <label htmlFor="content">
//                             Nội dung <span className={cx('required')}>*</span>
//                         </label>
//                         <textarea
//                             id="content"
//                             name="content"
//                             value={formData.content}
//                             onChange={handleChange}
//                             placeholder="Nhập nội dung ghi chú..."
//                             rows={8}
//                             required
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     {/* ==================== THÊM LẠI INPUT TAGS ==================== */}
//                     <div className={cx('form-group')}>
//                         <label htmlFor="tags">Tags (cách nhau bởi dấu phẩy)</label>
//                         <input
//                             type="text"
//                             id="tags"
//                             name="tags"
//                             value={formData.tags}
//                             onChange={handleChange}
//                             placeholder="react, javascript, interview, todo"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div className={cx('modal-footer')}>
//                         <div className={cx('checkbox-group')}>
//                             <label className={cx('checkbox-label')}>
//                                 <input
//                                     type="checkbox"
//                                     name="isPinned"
//                                     checked={formData.isPinned}
//                                     onChange={handleChange}
//                                     disabled={isSubmitting}
//                                 />
//                                 Ghim ghi chú này lên đầu
//                             </label>
//                         </div>
//                         <div className={cx('btn-footer')}>
//                             <button  type="button"
//                                 className={cx('btn', 'btn-cancel')}
//                                 onClick={onClose}
//                                 disabled={isSubmitting}

//                             >
//                             Hủy
//                             </button>
//                             <button
//                                 type="submit"
//                                 className={cx('btn', 'btn-primary')}
//                                 disabled={isSubmitting || !formData.content.trim()}
//                             >
//                                 {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Lưu ghi chú'}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default NoteForm;

// ===============================
// src/features/notes/components/NoteForm.js
// import React, { useState, useEffect } from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteForm.module.scss';

// const cx = classNames.bind(styles);

// function NoteForm({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false, title = '' }) {
//     const [formData, setFormData] = useState({
//         title: '',
//         content: '',
//         tags: '',
//         isPinned: false,
//         reminderDate: '',   // ← Thêm trường này
//     });

//     // Reset / Fill form
//     useEffect(() => {
//         if (initialData) {
//             setFormData({
//                 title: initialData.title || '',
//                 content: initialData.content || '',
//                 tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
//                 isPinned: !!initialData.isPinned,
//                 reminderDate: initialData.reminderDate
//                     ? new Date(initialData.reminderDate).toISOString().slice(0, 16)
//                     : '',
//             });
//         } else {
//             setFormData({
//                 title: '',
//                 content: '',
//                 tags: '',
//                 isPinned: false,
//                 reminderDate: '',
//             });
//         }
//     }, [initialData, isOpen]);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.content.trim()) {
//             alert('Vui lòng nhập nội dung ghi chú!');
//             return;
//         }

//         const tagsArray = formData.tags
//             ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
//             : [];

//         const noteData = {
//             title: formData.title.trim(),
//             content: formData.content.trim(),
//             tags: tagsArray,
//             isPinned: formData.isPinned,
//             reminderDate: formData.reminderDate || null,   // ← Thêm vào đây
//         };

//         try {
//             if (initialData) {
//                 const noteId = initialData._id || initialData.id;
//                 if (!noteId) throw new Error('Không tìm thấy ID ghi chú');
//                 await onSubmit(noteId, noteData);
//             } else {
//                 await onSubmit(noteData);
//             }

//             onClose();
//         } catch (error) {
//             console.error('❌ Lỗi lưu note:', error);
//             alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu ghi chú!');
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className={cx('modal-overlay')}>
//             <div className={cx('modal-content')}>
//                 <div className={cx('modal-header')}>
//                     <h3>{title || (initialData ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới')}</h3>
//                     <button className={cx('close-btn')} onClick={onClose} type="button" disabled={isSubmitting}>
//                         ✕
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     <div className={cx('form-group')}>
//                         <label htmlFor="title">Tiêu đề ghi chú</label>
//                         <input
//                             type="text"
//                             id="title"
//                             name="title"
//                             value={formData.title}
//                             onChange={handleChange}
//                             placeholder="Ví dụ: Phỏng vấn công ty ABC"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div className={cx('form-group')}>
//                         <label htmlFor="content">Nội dung <span className={cx('required')}>*</span></label>
//                         <textarea
//                             id="content"
//                             name="content"
//                             value={formData.content}
//                             onChange={handleChange}
//                             placeholder="Nhập nội dung ghi chú..."
//                             rows={8}
//                             required
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div className={cx('form-group')}>
//                         <label htmlFor="tags">Tags (cách nhau bởi dấu phẩy)</label>
//                         <input
//                             type="text"
//                             id="tags"
//                             name="tags"
//                             value={formData.tags}
//                             onChange={handleChange}
//                             placeholder="react, javascript, interview"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     {/* ==================== PHẦN ĐẶT LỊCH NHẮC NHỞ ==================== */}
//                     <div className={cx('form-group')}>
//                         <label htmlFor="reminderDate">
//                             ⏰ Đặt lịch nhắc nhở (tùy chọn)
//                         </label>
//                         <input
//                             type="datetime-local"
//                             id="reminderDate"
//                             name="reminderDate"
//                             value={formData.reminderDate}
//                             onChange={handleChange}
//                             disabled={isSubmitting}
//                         />
//                         <small className={cx('hint')}>Hệ thống sẽ thông báo khi đến giờ</small>
//                     </div>

//                     <div className={cx('modal-footer')}>
//                         <div className={cx('checkbox-group')}>
//                             <label className={cx('checkbox-label')}>
//                                 <input
//                                     type="checkbox"
//                                     name="isPinned"
//                                     checked={formData.isPinned}
//                                     onChange={handleChange}
//                                     disabled={isSubmitting}
//                                 />
//                                 Ghim ghi chú này lên đầu
//                             </label>
//                         </div>

//                         <div className={cx('btn-footer')}>
//                             <button
//                                 type="button"
//                                 className={cx('btn', 'btn-cancel')}
//                                 onClick={onClose}
//                                 disabled={isSubmitting}
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 type="submit"
//                                 className={cx('btn', 'btn-primary')}
//                                 disabled={isSubmitting || !formData.content.trim()}
//                             >
//                                 {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Lưu ghi chú'}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default NoteForm;
// =============================

// src/features/notes/components/NoteForm.js
// import React, { useState, useEffect } from 'react';
// import classNames from 'classnames/bind';
// import styles from './NoteForm.module.scss';

// const cx = classNames.bind(styles);

// function NoteForm({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false, title = '' }) {
//     const [formData, setFormData] = useState({
//         title: '',
//         content: '',
//         tags: '',
//         isPinned: false,
//         reminderDate: '',
//     });

//     // Reset / Fill form
//     useEffect(() => {
//         if (initialData) {
//             // Kiểm tra ngày hợp lệ để tránh crash khi ép kiểu ISO
//             let formattedDate = '';
//             if (initialData.reminderDate) {
//                 const parsedDate = new Date(initialData.reminderDate);
//                 if (!isNaN(parsedDate.getTime())) {
//                     // Chuyển đổi từ UTC về giờ địa phương để hiển thị đúng trên input datetime-local
//                     const tzOffset = parsedDate.getTimezoneOffset() * 60000; // Tính độ lệch múi giờ tính bằng ms
//                     const localISOTime = new Date(parsedDate.getTime() - tzOffset).toISOString().slice(0, 16);
//                     formattedDate = localISOTime;
//                 }
//             }

//             setFormData({
//                 title: initialData.title || '',
//                 content: initialData.content || '',
//                 tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
//                 isPinned: !!initialData.isPinned,
//                 reminderDate: formattedDate,
//             });
//         } else {
//             setFormData({
//                 title: '',
//                 content: '',
//                 tags: '',
//                 isPinned: false,
//                 reminderDate: '',
//             });
//         }
//     }, [initialData, isOpen]);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.content.trim()) {
//             alert('Vui lòng nhập nội dung ghi chú!');
//             return;
//         }

//         const tagsArray = formData.tags
//             ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
//             : [];

//         // Xử lý chuẩn hóa múi giờ trước khi gửi lên API
//         let finalReminderDate = null;
//         if (formData.reminderDate) {
//             // Chuyển đổi chuỗi local time từ input thành đối tượng Date chuẩn (gửi lên DB sẽ tự về UTC)
//             finalReminderDate = new Date(formData.reminderDate).toISOString();
//         }

//         const noteData = {
//             title: formData.title.trim(),
//             content: formData.content.trim(),
//             tags: tagsArray,
//             isPinned: formData.isPinned,
//             reminderDate: finalReminderDate, // Gửi chuẩn ISO hoàn chỉnh lên server
//         };

//         try {
//             if (initialData) {
//                 const noteId = initialData._id || initialData.id;
//                 if (!noteId) throw new Error('Không tìm thấy ID ghi chú');
//                 await onSubmit(noteId, noteData);
//             } else {
//                 await onSubmit(noteData);
//             }

//             onClose();
//         } catch (error) {
//             console.error('❌ Lỗi lưu note:', error);
//             alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu ghi chú!');
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className={cx('modal-overlay')}>
//             <div className={cx('modal-content')}>
//                 <div className={cx('modal-header')}>
//                     <h3>{title || (initialData ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới')}</h3>
//                     <button className={cx('close-btn')} onClick={onClose} type="button" disabled={isSubmitting}>
//                         ✕
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit}>
//                     <div className={cx('form-group')}>
//                         <label htmlFor="title">Tiêu đề ghi chú</label>
//                         <input
//                             type="text"
//                             id="title"
//                             name="title"
//                             value={formData.title}
//                             onChange={handleChange}
//                             placeholder="Ví dụ: Phỏng vấn công ty ABC"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div className={cx('form-group')}>
//                         <label htmlFor="content">Nội dung <span className={cx('required')}>*</span></label>
//                         <textarea
//                             id="content"
//                             name="content"
//                             value={formData.content}
//                             onChange={handleChange}
//                             placeholder="Nhập nội dung ghi chú..."
//                             rows={8}
//                             required
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     <div className={cx('form-group')}>
//                         <label htmlFor="tags">Tags (cách nhau bởi dấu phẩy)</label>
//                         <input
//                             type="text"
//                             id="tags"
//                             name="tags"
//                             value={formData.tags}
//                             onChange={handleChange}
//                             placeholder="react, javascript, interview"
//                             disabled={isSubmitting}
//                         />
//                     </div>

//                     {/* ==================== PHẦN ĐẶT LỊCH NHẮC NHỞ ==================== */}
//                     <div className={cx('form-group')}>
//                         <label htmlFor="reminderDate">
//                             ⏰ Đặt lịch nhắc nhở (tùy chọn)
//                         </label>
//                         <input
//                             type="datetime-local"
//                             id="reminderDate"
//                             name="reminderDate"
//                             value={formData.reminderDate}
//                             onChange={handleChange}
//                             disabled={isSubmitting}
//                         />
//                         <small className={cx('hint')}>Hệ thống sẽ thông báo khi đến giờ</small>
//                     </div>

//                     <div className={cx('modal-footer')}>
//                         <div className={cx('checkbox-group')}>
//                             <label className={cx('checkbox-label')}>
//                                 <input
//                                     type="checkbox"
//                                     name="isPinned"
//                                     checked={formData.isPinned}
//                                     onChange={handleChange}
//                                     disabled={isSubmitting}
//                                 />
//                                 Ghim ghi chú này lên đầu
//                             </label>
//                         </div>

//                         <div className={cx('btn-footer')}>
//                             <button
//                                 type="button"
//                                 className={cx('btn', 'btn-cancel')}
//                                 onClick={onClose}
//                                 disabled={isSubmitting}
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 type="submit"
//                                 className={cx('btn', 'btn-primary')}
//                                 disabled={isSubmitting || !formData.content.trim()}
//                             >
//                                 {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Lưu ghi chú'}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default NoteForm;

// =================================================
// src/features/notes/components/NoteForm.js
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './NoteForm.module.scss';

const cx = classNames.bind(styles);

// Hàm helper đổi Date object thành chuỗi 'YYYY-MM-DDTHH:mm' theo giờ địa phương
const formatToLocalDateTimeString = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';

    const pad = (num) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function NoteForm({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false, title = '' }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        isPinned: false,
        reminderDate: '',
    });

    // Reset / Fill form
    useEffect(() => {
        if (!isOpen) return; // Chỉ chạy khi modal đang mở

        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags || '',
                isPinned: !!initialData.isPinned,
                reminderDate: formatToLocalDateTimeString(initialData.reminderDate),
            });
        } else {
            setFormData({
                title: '',
                content: '',
                tags: '',
                isPinned: false,
                reminderDate: '',
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleClearReminder = () => {
        setFormData((prev) => ({ ...prev, reminderDate: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.content.trim()) {
            alert('Vui lòng nhập nội dung ghi chú!');
            return;
        }

        const tagsArray = formData.tags
            ? formData.tags
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean)
            : [];

        // Chuyển local time từ input thành UTC ISO String
        let finalReminderDate = null;
        if (formData.reminderDate) {
            const parsedDate = new Date(formData.reminderDate);
            if (!isNaN(parsedDate.getTime())) {
                finalReminderDate = parsedDate.toISOString();
            }
        }

        const noteData = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            tags: tagsArray,
            isPinned: formData.isPinned,
            reminderDate: finalReminderDate,
        };

        try {
            if (initialData) {
                const noteId = initialData._id || initialData.id;
                if (!noteId) throw new Error('Không tìm thấy ID ghi chú');
                await onSubmit(noteId, noteData);
            } else {
                await onSubmit(noteData);
            }

            onClose();
        } catch (error) {
            console.error('❌ Lỗi lưu note:', error);
            alert(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu ghi chú!');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={cx('modal-overlay')}>
            <div className={cx('modal-content')}>
                <div className={cx('modal-header')}>
                    <h3>{title || (initialData ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú mới')}</h3>
                    <button className={cx('close-btn')} onClick={onClose} type="button" disabled={isSubmitting}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="title">Tiêu đề ghi chú</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ví dụ: Phỏng vấn công ty ABC"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="content">
                            Nội dung <span className={cx('required')}>*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Nhập nội dung ghi chú..."
                            rows={8}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="tags">Tags (cách nhau bởi dấu phẩy)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="react, javascript, interview"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* PHẦN ĐẶT LỊCH NHẮC NHỞ */}
                    <div className={cx('form-group')}>
                        <label htmlFor="reminderDate">⏰ Đặt lịch nhắc nhở (tùy chọn)</label>
                        <div className={cx('reminder-input-wrapper')}>
                            <input
                                type="datetime-local"
                                id="reminderDate"
                                name="reminderDate"
                                value={formData.reminderDate}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            {/* {formData.reminderDate && (
                                <button
                                    type="button"
                                    className={cx('clear-reminder-btn')}
                                    onClick={handleClearReminder}
                                    disabled={isSubmitting}
                                    title="Xóa lịch nhắc"
                                >
                                    ✕ Xóa lịch
                                </button>
                            )} */}
                        </div>
                        <small className={cx('hint')}>Hệ thống sẽ thông báo khi đến giờ</small>
                    </div>

                    <div className={cx('modal-footer')}>
                        <div className={cx('checkbox-group')}>
                            <label className={cx('checkbox-label')}>
                                <input
                                    type="checkbox"
                                    name="isPinned"
                                    checked={formData.isPinned}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                Ghim ghi chú này lên đầu
                            </label>
                        </div>

                        <div className={cx('btn-footer')}>
                            <button
                                type="button"
                                className={cx('btn', 'btn-cancel')}
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className={cx('btn', 'btn-primary')}
                                disabled={isSubmitting || !formData.content.trim()}
                            >
                                {isSubmitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Lưu ghi chú'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NoteForm;
