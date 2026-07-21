// src/features/notes/types.js
import PropTypes from 'prop-types';

// Định nghĩa khuôn mẫu cho một ghi chú (Note)
export const NotePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,                  // Phải là string và bắt buộc có
  applicationId: PropTypes.string,                   // Có thể có hoặc không
  cvId: PropTypes.string,                            // Có thể có hoặc không
  title: PropTypes.string.isRequired,                // Tiêu đề bắt buộc
  content: PropTypes.string.isRequired,              // Nội dung bắt buộc
  tags: PropTypes.arrayOf(PropTypes.string).isRequired, // Mảng chứa các chuỗi string
  isPinned: PropTypes.bool.isRequired,               // Phải là kiểu boolean
  createdAt: PropTypes.string.isRequired,            // Thời gian tạo
  updatedAt: PropTypes.string.isRequired,            // Thời gian cập nhật
});