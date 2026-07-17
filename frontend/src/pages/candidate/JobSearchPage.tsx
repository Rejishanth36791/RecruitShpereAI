import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, MapPin, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { JobCard } from "@/components/jobs/JobCard";
import { useJobSearch } from "@/hooks/useJobs";

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [appliedParams, setAppliedParams] = useState({});
  const { data: jobs, isLoading, isFetching } = useJobSearch(appliedParams);
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setAppliedParams({ searchTerm: searchTerm || undefined, location: location || undefined, status: "Published" });
  }

  return (
    <div>
      <PageHeader
        eyebrow="Candidate portal"
        title="Find your next role"
        description="Search open positions and let RecruitSphere's AI match your profile to the right jobs."
      />

      <form onSubmit={handleSearch} className="glass-panel p-4 flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Job title, keyword, or company"
            className="pl-10"
          />
        </div>
        <div className="relative sm:w-56">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="pl-10"
          />
        </div>
        <Button type="submit" loading={isFetching} className="sm:w-auto">
          Search
        </Button>
      </form>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              action={
                <Button variant="secondary" className="w-full" onClick={() => navigate(`/candidate/jobs/${job.id}`)}>
                  View details
                </Button>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description="Try a different search term or clear your filters to see all open roles."
        />
      )}
    </div>
  );
}
