import { User } from "@/database/user.model";

export type CreateAnswerParams = {
  content: string;
  author: string; // User ID
  question: string; // Question ID
  path: string;
}

export type GetAnswersParams = {
  questionId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export type GetAnswersByUserParams = {
  userId: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export type AnswerVoteParams = {
  answerId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export type DeleteAnswerParams = {
  answerId: string;
  path: string;
}

export type SearchParams = {
  query?: string | null;
  type?: string | null;
}

export type RecommendedParams = {
  userId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export type ViewQuestionParams = {
  questionId: string;
  userId?: string;
}

export type JobFilterParams = {
  query: string;
  page: string;
}

export type GetQuestionsParams = {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export type CreateQuestionParams = {
  title: string;
  content: string;
  tags: string[];
  author: string;
  path: string;
}

export type GetQuestionByIdParams = {
  questionId: string;
}

export type QuestionVoteParams = {
  questionId: string;
  userId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export type DeleteQuestionParams = {
  questionId: string;
  path: string;
}

export type EditQuestionParams = {
  questionId: string;
  title: string;
  content: string;
  tags: string[];
  path: string;
}

export type GetAllTagsParams = {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export type GetQuestionsByTagIdParams = {
  tagId: string;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}

export type GetTopInteractedTagsParams = {
  userId: string;
  limit?: number;
}

export type CreateUserParams = {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

export type GetUserByIdParams = {
  userId: string;
}

export type GetAllUsersParams = {
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string; // Add searchQuery parameter
}

export type UpdateUserParams = {
  clerkId: string;
  updateData: Partial<User>;
  path: string;
}

export type ToggleSaveQuestionParams = {
  userId: string;
  questionId: string;
  path: string;
}

export type GetSavedQuestionsParams = {
  clerkId: string;
  page?: number;
  pageSize?: number;
  filter?: string;
  searchQuery?: string;
}

export type GetUserStatsParams = {
  userId: string;
  page?: number;
  pageSize?: number;
}

export type DeleteUserParams = {
  clerkId: string;
}

export type UpdateReputationParams = {
  userId: string;
  action: "create_question" | "delete_question" | "create_answer" | "delete_answer" | "upvote_question" | "upvote_answer" | "downvote_question" | "downvote_answer" | "receive_upvote" | "receive_downvote";
  questionId?: string;
  answerId?: string;
}

export type GetBadgesParams = {
  userId: string;
}

export type GetJobsParams = {
  query: string;
  page: number;
  pageSize: number;
  country?: string;
}