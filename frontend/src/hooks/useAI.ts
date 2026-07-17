import { useMutation } from "@tanstack/react-query";
import { aiApi } from "@/api/ai";

export function useParseResume() {
  return useMutation({ mutationFn: aiApi.parseResume });
}

export function useMatchScore() {
  return useMutation({ mutationFn: aiApi.matchScore });
}

export function useExtractSkills() {
  return useMutation({ mutationFn: aiApi.extractSkills });
}

export function useRecommendJobs() {
  return useMutation({ mutationFn: aiApi.recommendJobs });
}
