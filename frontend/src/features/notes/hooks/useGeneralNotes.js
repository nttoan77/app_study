// // src/features/notes/hooks/useGeneralNotes.js
// import { useState, useEffect, useCallback } from 'react';
// import { noteService } from '../services/noteService';

// const useGeneralNotes = () => {
//     const [notes, setNotes] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái submit (add/update)

//     // ==================== FETCH NOTES ====================
//     const fetchNotes = useCallback(async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const data = await noteService.getNotes(); // General notes (không truyền applicationId)

//             setNotes(Array.isArray(data) ? data : []);
//         } catch (err) {
//             console.error('❌ Lỗi tải ghi chú chung:', err);
//             setError(err.response?.data?.message || 'Không thể tải danh sách ghi chú');
//             setNotes([]);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // ==================== ADD NOTE ====================
//     const addNote = useCallback(async (noteData) => {
//         try {
//             setIsSubmitting(true);
//             const newNote = await noteService.createNote(noteData);

//             // Optimistic update + thêm vào đầu danh sách
//             setNotes((prev) => [newNote, ...prev]);
//             return newNote;
//         } catch (err) {
//             console.error('❌ Lỗi thêm ghi chú:', err);
//             setError(err.response?.data?.message || 'Không thể tạo ghi chú');
//             throw err;
//         } finally {
//             setIsSubmitting(false);
//         }
//     }, []);

//     // ==================== UPDATE NOTE ====================
//     const updateNote = useCallback(async (noteId, updatedData) => {
//         try {
//             setIsSubmitting(true);
//             const updated = await noteService.updateNote(noteId, updatedData);

//             setNotes((prev) =>
//                 prev.map((note) => (note._id === noteId || note.id === noteId ? { ...note, ...updated } : note)),
//             );
//             return updated;
//         } catch (err) {
//             console.error('❌ Lỗi cập nhật ghi chú:', err);
//             setError(err.response?.data?.message || 'Không thể cập nhật ghi chú');
//             throw err;
//         } finally {
//             setIsSubmitting(false);
//         }
//     }, []);

//     // ==================== DELETE NOTE ====================
//     const deleteNote = useCallback(async (noteId) => {
//         try {
//             await noteService.deleteNote(noteId);

//             // Optimistic delete
//             setNotes((prev) => prev.filter((note) => note._id !== noteId && note.id !== noteId));
//         } catch (err) {
//             console.error('❌ Lỗi xóa ghi chú:', err);
//             setError(err.response?.data?.message || 'Không thể xóa ghi chú');
//             throw err;
//         }
//     }, []);

//     // ==================== TOGGLE PIN (SỬ DỤNG ROUTE RIÊNG) ====================
//     const togglePin = useCallback(async (noteId) => {
//         try {
//             setIsSubmitting(true);

//             // Gọi API toggle-pin riêng
//             const updatedNote = await noteService.togglePin(noteId);

//             // Cập nhật state
//             setNotes((prev) =>
//                 prev.map((note) => (note._id === noteId || note.id === noteId ? { ...note, ...updatedNote } : note)),
//             );

//             return updatedNote;
//         } catch (err) {
//             console.error('❌ Lỗi toggle pin:', err);
//             setError(err.response?.data?.message || 'Không thể thay đổi trạng thái ghim');
//             throw err;
//         } finally {
//             setIsSubmitting(false);
//         }
//     }, []);

//     // ==================== REFRESH ====================
//     const refresh = fetchNotes;

//     // Load dữ liệu khi mount
//     useEffect(() => {
//         fetchNotes();
//     }, [fetchNotes]);

//     return {
//         notes,
//         loading,
//         error,
//         isSubmitting, // Dùng để disable button khi đang submit
//         fetchNotes,
//         refresh,
//         addNote,
//         updateNote,
//         deleteNote,
//         togglePin,

//         // Helper functions
//         getNoteById: (id) => notes.find((note) => note._id === id || note.id === id),
//     };
// };

// export default useGeneralNotes;


// =====================================================================

// src/features/notes/hooks/useGeneralNotes.js
import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';

const useGeneralNotes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái xử lý (add/update/pin)

    // ==================== TẢI GHI CHÚ ====================
    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await noteService.getNotes(); // Ghi chú chung

            setNotes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Lỗi tải ghi chú chung:', err);
            setError(err.response?.data?.message || 'Không thể tải danh sách ghi chú');
            setNotes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================== THÊM GHI CHÚ ====================
    const addNote = useCallback(async (noteData) => {
        try {
            setIsSubmitting(true);
            setError(null); // Clear lỗi cũ trước khi thực hiện hành động mới
            
            const newNote = await noteService.createNote(noteData);

            // Cập nhật State trực quan, đẩy ghi chú mới lên đầu
            setNotes((prev) => [newNote, ...prev]);
            return newNote;
        } catch (err) {
            console.error('❌ Lỗi thêm ghi chú:', err);
            setError(err.response?.data?.message || 'Không thể tạo ghi chú');
            throw err; // Ném ra ngoài để Form xử lý hiển thị alert
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // ==================== CẬP NHẬT GHI CHÚ ====================
    const updateNote = useCallback(async (noteId, updatedData) => {
        if (!noteId) return;
        try {
            setIsSubmitting(true);
            setError(null);

            const updated = await noteService.updateNote(noteId, updatedData);

            setNotes((prev) =>
                prev.map((note) => {
                    const id = note._id || note.id;
                    return String(id) === String(noteId) ? { ...note, ...updated } : note;
                })
            );
            return updated;
        } catch (err) {
            console.error('❌ Lỗi cập nhật ghi chú:', err);
            setError(err.response?.data?.message || 'Không thể cập nhật ghi chú');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // ==================== XÓA GHI CHÚ (CÓ ROLLBACK AN TOÀN) ====================
    const deleteNote = useCallback(async (noteId) => {
        if (!noteId) return;

        // Lưu lại bản sao lưu phòng trường hợp API bị lỗi để khôi phục (Rollback)
        let originalNotes;
        setNotes((prev) => {
            originalNotes = prev;
            return prev.filter((note) => {
                const id = note._id || note.id;
                return String(id) !== String(noteId);
            });
        });

        try {
            setError(null);
            await noteService.deleteNote(noteId);
        } catch (err) {
            console.error('❌ Lỗi xóa ghi chú:', err);
            setError(err.response?.data?.message || 'Không thể xóa ghi chú');
            
            // Khôi phục lại dữ liệu ban đầu trên UI nếu server từ chối xóa
            if (originalNotes) {
                setNotes(originalNotes);
            }
            throw err;
        }
    }, []);

    // ==================== TOGGLE PIN (SỬ DỤNG ROUTE CHUYÊN DỤNG) ====================
    const togglePin = useCallback(async (noteId) => {
        if (!noteId) return;
        try {
            setIsSubmitting(true);
            setError(null);

            const updatedNote = await noteService.togglePin(noteId);

            setNotes((prev) =>
                prev.map((note) => {
                    const id = note._id || note.id;
                    return String(id) === String(noteId) ? { ...note, ...updatedNote } : note;
                })
            );

            return updatedNote;
        } catch (err) {
            console.error('❌ Lỗi toggle pin:', err);
            setError(err.response?.data?.message || 'Không thể thay đổi trạng thái ghim');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // Tìm kiếm một ghi chú cụ thể bằng ID một cách tối ưu
    const getNoteById = useCallback((id) => {
        if (!id) return null;
        return notes.find((note) => {
            const noteId = note._id || note.id;
            return String(noteId) === String(id);
        });
    }, [notes]);

    // Load dữ liệu lần đầu khi Component gắn kết (Mount)
    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return {
        notes,
        loading,
        error,
        isSubmitting,
        fetchNotes,
        refresh: fetchNotes,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
        getNoteById,
    };
};

export default useGeneralNotes;