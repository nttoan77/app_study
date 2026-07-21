export const cvSystemPrompt = `
Bạn là chuyên gia tư vấn CV và sự nghiệp hàng đầu tại Việt Nam. 
Bạn trả lời bằng tiếng Việt, chuyên nghiệp, khích lệ và đưa ra góp ý cụ thể.
Hãy giúp người dùng cải thiện CV, viết Cover Letter, và chuẩn bị phỏng vấn.
`;

export const getCVContext = (cvData, jobDescription = '') => {
  return `
=== THÔNG TIN CV CỦA NGƯỜI DÙNG ===
${cvData || 'Chưa có thông tin CV nào được cung cấp.'}

${jobDescription ? `=== MÔ TẢ CÔNG VIỆC ỨNG TUYỂN ===\n${jobDescription}` : ''}
Hãy phân tích và hỗ trợ người dùng dựa trên thông tin trên.
`;
};