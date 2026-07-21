import { apiClient } from "@/api/client";
import type {
  CalculateMatchScoreRequest,
  CalculateMatchScoreResponse,
  ExtractSkillsRequest,
  ExtractSkillsResponse,
  GenerateJobRecommendationRequest,
  GenerateJobRecommendationResponse,
  ParseResumeRequest,
  ParseResumeResponse,
} from "@/types/api";

export const aiApi = {
  parseResume: (payload: ParseResumeRequest) =>
    apiClient.post<ParseResumeResponse>("/ai/parse-resume", payload).then((r) => r.data),

  matchScore: (payload: CalculateMatchScoreRequest) =>
    apiClient.post<CalculateMatchScoreResponse>("/ai/match-score", payload).then((r) => r.data),

  extractSkills: (payload: ExtractSkillsRequest) =>
    apiClient.post<ExtractSkillsResponse>("/ai/extract-skills", payload).then((r) => r.data),

  recommendJobs: (payload: GenerateJobRecommendationRequest) =>
    apiClient.post<GenerateJobRecommendationResponse>("/ai/recommend-jobs", payload).then((r) => r.data),
};
