// To get upcoming batches

// GET /batches/upcoming

// Request :
// IN Query
// {
// skip: number;
// limit: number;
// }
// Response:
// {
// courseId: string;
// batchId: string;
// startDate : Date;
// courseName : string;
// fees : number;
// durationInDays: number;
// remainingSeats: number;
// totalSeats: number;
// startTime: Date;
// classMode: string;
// }
