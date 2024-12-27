export interface AddOrEditCandidate  {
    candidateId?: string | null; // Optional Guid for candidate ID
    name: string; // Required string
    email: string; // Required string
    mobile?: string; // Optional string
    ctc?: number; // Optional positive decimal
    expectedCtc?: number; // Optional positive decimal
    interviewDate?: Date; // Optional Date
    interviewFeedback?: string; // Optional string
    statusId: number; // Required integer
    cityId: number; // Required integer
    cvFile?: File;
    createdAt?: Date; // Optional Date
  }

  export interface Candidate  {
    candidateId?: string | null; // Optional Guid for candidate ID
    name: string; // Required string
    email: string; // Required string
    mobile?: string; // Optional string
    ctc?: number; // Optional positive decimal
    expectedCtc?: number; // Optional positive decimal
    interviewDate?: Date; // Optional Date
    interviewFeedback?: string; // Optional string
    statusId: number; // Required integer
    cityId: number; // Required integer
    cityName: string;
    statusName : string;
    createdAt?: Date; // Optional Date
  }