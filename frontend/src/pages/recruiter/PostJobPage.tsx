import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { useCreateJob } from "@/hooks/useJobs";
import { extractErrorMessage } from "@/api/client";

export default function PostJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createJob = useCreateJob();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const job = await createJob.mutateAsync({
        title,
        description,
        requirements: requirements || undefined,
        location: location || undefined,
        salary: salary ? Number(salary) : undefined,
      });
      navigate(`/recruiter/jobs/${job.id}/applicants`);
    } catch (err) {
      setError(extractErrorMessage(err, "Could not create this job posting."));
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Recruiter portal"
        title="Post a new job"
        description="Published roles are immediately visible to every candidate on the platform."
      />

      <Card>
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorAlert message={error} />

            <div>
              <Label htmlFor="title">Job title</Label>
              <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Frontend Engineer" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote, Colombo, ..." />
              </div>
              <div>
                <Label htmlFor="salary">Salary (annual, USD)</Label>
                <Input
                  id="salary"
                  type="number"
                  min={0}
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="60000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will this person work on day to day?"
                className="min-h-[140px]"
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (optional)</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Skills, experience, qualifications..."
              />
            </div>

            <Button type="submit" size="lg" loading={createJob.isPending}>
              Publish job posting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
