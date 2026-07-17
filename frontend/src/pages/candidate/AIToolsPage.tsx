import { useState } from "react";
import { Sparkles, FileSearch, Target, ListChecks, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { useParseResume, useExtractSkills, useMatchScore, useRecommendJobs } from "@/hooks/useAI";
import { extractErrorMessage } from "@/api/client";

function ToolShell({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-gradient-soft flex items-center justify-center">
              <Icon className="h-4 w-4 text-indigo-accent" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription className="ml-10 -mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function AIToolsPage() {
  // Resume parsing
  const [resumeText, setResumeText] = useState("");
  const parseResume = useParseResume();

  // Skill extraction
  const [skillText, setSkillText] = useState("");
  const extractSkills = useExtractSkills();

  // Match score
  const [profile, setProfile] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const matchScore = useMatchScore();

  // Job recommendation
  const [skills, setSkills] = useState("");
  const recommendJobs = useRecommendJobs();

  return (
    <div>
      <PageHeader
        eyebrow="Candidate portal"
        title="AI tools"
        description="Powered by the Claude API on the backend — parse your resume, extract skills, score yourself against a role, and get job recommendations."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <ToolShell icon={FileSearch} title="Parse resume" description="Paste raw resume text to get a structured summary.">
          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="mb-3"
          />
          <ErrorAlert message={parseResume.isError ? extractErrorMessage(parseResume.error) : null} className="mb-3" />
          <Button
            loading={parseResume.isPending}
            disabled={!resumeText.trim()}
            onClick={() => parseResume.mutate({ resumeText })}
          >
            Parse resume
          </Button>
          {parseResume.data && (
            <div className="mt-4 rounded-xl border border-base-border bg-base-elevated/60 p-4 text-sm text-ink-muted whitespace-pre-line">
              {parseResume.data.parsedResult}
            </div>
          )}
        </ToolShell>

        <ToolShell icon={ListChecks} title="Extract skills" description="Pull a clean skills list out of any block of text.">
          <Textarea
            value={skillText}
            onChange={(e) => setSkillText(e.target.value)}
            placeholder="Paste your bio, resume, or a job description..."
            className="mb-3"
          />
          <ErrorAlert
            message={extractSkills.isError ? extractErrorMessage(extractSkills.error) : null}
            className="mb-3"
          />
          <Button
            loading={extractSkills.isPending}
            disabled={!skillText.trim()}
            onClick={() => extractSkills.mutate({ text: skillText })}
          >
            Extract skills
          </Button>
          {extractSkills.data && (
            <div className="mt-4 flex flex-wrap gap-2">
              {extractSkills.data.skills.map((skill) => (
                <Badge key={skill} tone="cyan">
                  {skill}
                </Badge>
              ))}
              {extractSkills.data.skills.length === 0 && (
                <p className="text-sm text-ink-muted">No skills detected.</p>
              )}
            </div>
          )}
        </ToolShell>

        <ToolShell icon={Target} title="Match score" description="See how well your profile matches a job description.">
          <div className="space-y-3 mb-3">
            <Textarea
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              placeholder="Your candidate profile / summary..."
            />
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Target job description..."
            />
          </div>
          <ErrorAlert message={matchScore.isError ? extractErrorMessage(matchScore.error) : null} className="mb-3" />
          <Button
            loading={matchScore.isPending}
            disabled={!profile.trim() || !jobDescription.trim()}
            onClick={() => matchScore.mutate({ candidateProfile: profile, jobDescription })}
          >
            Calculate match score
          </Button>
          {matchScore.data !== undefined && matchScore.isSuccess && (
            <div className="mt-4 flex items-center gap-3">
              <div className="text-3xl font-display font-bold text-gradient">{matchScore.data.matchScore}%</div>
              <p className="text-sm text-ink-muted">estimated match</p>
            </div>
          )}
        </ToolShell>

        <ToolShell icon={Wand2} title="Job recommendations" description="Get AI suggestions based on your skill set.">
          <Textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, TypeScript, .NET, SQL Server..."
            className="mb-3"
          />
          <ErrorAlert
            message={recommendJobs.isError ? extractErrorMessage(recommendJobs.error) : null}
            className="mb-3"
          />
          <Button
            loading={recommendJobs.isPending}
            disabled={!skills.trim()}
            onClick={() => recommendJobs.mutate({ candidateSkills: skills })}
          >
            Recommend jobs
          </Button>
          {recommendJobs.data && (
            <div className="mt-4 rounded-xl border border-base-border bg-base-elevated/60 p-4 text-sm text-ink-muted whitespace-pre-line">
              {recommendJobs.data.recommendation}
            </div>
          )}
        </ToolShell>
      </div>
    </div>
  );
}
