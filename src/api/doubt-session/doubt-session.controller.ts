// 📌 Doubt Session API

// POST /api/doubts
// Student posts a new doubt

// Request:
// studentId: 12345
// courseId: CSE101
// question: Can you explain Pythagoras' theorem?
// attachments: Array of string (optional)

// Response:
// status: success
// message: Doubt submitted successfully
// doubtId: abc123

// POST /api/doubts/{doubtId}/answer
// Teacher submits an answer

// Request:
// teacherId: t6789
// response: Sure! It's a² + b² = c² in a right-angled triangle
// attachments: [] (optional)

// Response:
// status: success
// message: Answer submitted successfully
