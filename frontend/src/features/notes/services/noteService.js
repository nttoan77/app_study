// src/features/notes/services/noteService.js
// import httpRequest from '../../../utils/httpRequest';

// const NOTE_API = '/api/notes';

// export const noteService = {

//     /**
//      * Lấy danh sách ghi chú
//      * GET /api/notes
//      */
//     async getNotes(applicationId = null, params = {}) {
//         try {
//             let url = NOTE_API;
//             const queryParams = { ...params };

//             if (applicationId) {
//                 queryParams.applicationId = applicationId;
//             }

//             const response = await httpRequest.get(url, { params: queryParams });

//             // Linh hoạt với nhiều cấu trúc response
//             return response.data?.data || response.data || [];
//         } catch (error) {
//             console.error('❌ Lỗi lấy danh sách notes:', error.response?.data || error);
//             throw error;
//         }
//     },

//     /**
//      * Lấy chi tiết một ghi chú (nếu cần sau này)
//      */
//     async getNoteById(noteId) {
//         try {
//             const response = await httpRequest.get(`${NOTE_API}/${noteId}`);
//             return response.data?.data || response.data;
//         } catch (error) {
//             console.error('❌ Lỗi lấy note theo ID:', error);
//             throw error;
//         }
//     },

//     /**
//      * Tạo ghi chú mới
//      * POST /api/notes
//      */
//     async createNote(noteData) {
//         try {
//             const response = await httpRequest.post(NOTE_API, noteData);
//             return response.data?.data || response.data;
//         } catch (error) {
//             console.error('❌ Lỗi tạo note:', error.response?.data || error);
//             throw error;
//         }
//     },

//     /**
//      * Tạo ghi chú mới
//      * POST /api/getReminders
//      */
//     async getReminders() {
//         try {
//             const response = await httpRequest.get('/api/notes/reminders');
//             return response.data?.data || [];
//         } catch (error) {
//             console.error('❌ Lỗi lấy reminders:', error);
//             throw error;
//         }
//     },

//     /**
//      * Cập nhật ghi chú
//      * PUT /api/notes/:id
//      */
//     async updateNote(noteId, noteData) {
//         try {
//             const response = await httpRequest.put(`${NOTE_API}/${noteId}`, noteData);
//             return response.data?.data || response.data;
//         } catch (error) {
//             console.error('❌ Lỗi cập nhật note:', error.response?.data || error);
//             throw error;
//         }
//     },

//     /**
//      * Xóa ghi chú
//      * DELETE /api/notes/:id
//      */
//     async deleteNote(noteId) {
//         try {
//             const response = await httpRequest.delete(`${NOTE_API}/${noteId}`);
//             return response.data?.data || response.data || { success: true, id: noteId };
//         } catch (error) {
//             console.error('❌ Lỗi xóa note:', error.response?.data || error);
//             throw error;
//         }
//     },

//     /**
//      * Toggle ghim ghi chú - SỬ DỤNG ROUTE RIÊNG
//      * PATCH /api/notes/:id/toggle-pin
//      */
//     async togglePin(noteId) {
//         try {
//             const response = await httpRequest.patch(`${NOTE_API}/${noteId}/toggle-pin`);
//             return response.data?.data || response.data;
//         } catch (error) {
//             console.error('❌ Lỗi toggle pin note:', error.response?.data || error);
//             throw error;
//         }
//     },

//     // === Các hàm tiện ích bổ sung ===

//     /**
//      * Cập nhật một phần ghi chú (nếu backend hỗ trợ PATCH sau này)
//      */
//     async patchNote(noteId, noteData) {
//         try {
//             const response = await httpRequest.patch(`${NOTE_API}/${noteId}`, noteData);
//             return response.data?.data || response.data;
//         } catch (error) {
//             console.error('❌ Lỗi patch note:', error);
//             throw error;
//         }
//     }
// };

// ==========================================================

// src/features/notes/services/noteService.js
import httpRequest from '../../../utils/httpRequest';

const NOTE_API = '/api/notes';

/**
 * Hàm loại bỏ các trường hệ thống của MongoDB khỏi payload trước khi gửi lên Backend
 */
const sanitizePayload = (data) => {
    if (!data || typeof data !== 'object') return data;
    const cleanData = { ...data };
    delete cleanData._id;
    delete cleanData.id;
    delete cleanData.__v;
    delete cleanData.createdAt;
    delete cleanData.updatedAt;
    return cleanData;
};

export const noteService = {
    /**
     * Lấy danh sách ghi chú (hỗ trợ lọc theo hồ sơ ứng tuyển hoặc các query phụ)
     * GET /api/notes
     */
    async getNotes(applicationId = null, params = {}) {
        try {
            const queryParams = { ...params };

            if (applicationId) {
                queryParams.applicationId = applicationId;
            }

            const response = await httpRequest.get(NOTE_API, { params: queryParams });

            // Linh hoạt với nhiều cấu trúc trả về từ Server
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách ghi chú:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Lấy chi tiết một ghi chú theo ID
     * GET /api/notes/:noteId
     */
    async getNoteById(noteId) {
        if (!noteId) {
            throw new Error('Yêu cầu noteId hợp lệ để lấy thông tin chi tiết!');
        }
        try {
            const response = await httpRequest.get(`${NOTE_API}/${noteId}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error(`❌ Lỗi lấy ghi chú theo ID (${noteId}):`, error.response?.data || error);
            throw error;
        }
    },

    /**
     * Tạo ghi chú mới
     * POST /api/notes
     */
    async createNote(noteData) {
        try {
            const cleanData = sanitizePayload(noteData);
            const response = await httpRequest.post(NOTE_API, cleanData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error('❌ Lỗi tạo ghi chú mới:', error.response?.data || error);
            throw error;
        }
    },

    /**
     * Lấy danh sách tất cả các nhắc nhở/lịch hẹn từ ghi chú
     * GET /api/notes/reminders
     */
    // async getReminders() {
    //     try {
    //         const response = await httpRequest.get(`${NOTE_API}/reminders`);
    //         return response.data?.data || response.data || [];
    //     } catch (error) {
    //         console.error('❌ Lỗi lấy danh sách nhắc nhở:', error.response?.data || error);
    //         throw error;
    //     }
    // },

    // Đoạn code lỗi hiện tại của bạn:
    /**
     * Lấy danh sách tất cả các nhắc nhở/lịch hẹn từ ghi chú
     * GET /api/notes/reminders
     */
    async getReminders(params = '') {
        try {
            // Cộng thêm params (ví dụ: ?t=1772...) vào cuối URL để phá cache trình duyệt
            const response = await httpRequest.get(`${NOTE_API}/reminders${params}`);
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error('❌ Lỗi lấy danh sách nhắc nhở:', error.response?.data || error);
            throw error;
        }
    },
    /**
     * Cập nhật toàn bộ/một phần ghi chú
     * PUT /api/notes/:noteId
     */
    async updateNote(noteId, noteData) {
        if (!noteId) {
            throw new Error('Yêu cầu noteId hợp lệ để cập nhật!');
        }
        try {
            const cleanData = sanitizePayload(noteData);
            const response = await httpRequest.put(`${NOTE_API}/${noteId}`, cleanData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error(`❌ Lỗi cập nhật ghi chú (${noteId}):`, error.response?.data || error);
            throw error;
        }
    },

    /**
     * Xóa ghi chú
     * DELETE /api/notes/:noteId
     */
    async deleteNote(noteId) {
        if (!noteId) {
            throw new Error('Yêu cầu noteId hợp lệ để xóa!');
        }
        try {
            const response = await httpRequest.delete(`${NOTE_API}/${noteId}`);
            return response.data?.data || response.data || { success: true, id: noteId };
        } catch (error) {
            console.error(`❌ Lỗi xóa ghi chú (${noteId}):`, error.response?.data || error);
            throw error;
        }
    },

    /**
     * Đảo trạng thái ghim (Pin/Unpin) ghi chú qua route chuyên dụng
     * PATCH /api/notes/:noteId/toggle-pin
     */
    async togglePin(noteId) {
        if (!noteId) {
            throw new Error('Yêu cầu noteId hợp lệ để đổi trạng thái ghim!');
        }
        try {
            const response = await httpRequest.patch(`${NOTE_API}/${noteId}/toggle-pin`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error(`❌ Lỗi ghim/bỏ ghim ghi chú (${noteId}):`, error.response?.data || error);
            throw error;
        }
    },

    /**
     * Cập nhật một phần thuộc tính ghi chú (Sử dụng PATCH chuẩn RESTful)
     * PATCH /api/notes/:noteId
     */
    async patchNote(noteId, partialData) {
        if (!noteId) {
            throw new Error('Yêu cầu noteId hợp lệ để cập nhật thông tin!');
        }
        try {
            const cleanData = sanitizePayload(partialData);
            const response = await httpRequest.patch(`${NOTE_API}/${noteId}`, cleanData);
            return response.data?.data || response.data;
        } catch (error) {
            console.error(`❌ Lỗi cập nhật một phần ghi chú (${noteId}):`, error.response?.data || error);
            throw error;
        }
    },
};
