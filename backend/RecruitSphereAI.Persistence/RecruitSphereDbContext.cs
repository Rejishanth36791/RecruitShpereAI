using Microsoft.EntityFrameworkCore;
using RecruitSphereAI.Core.Common.Enums;
using RecruitSphereAI.Core.Common.ValueObjects;
using RecruitSphereAI.Core.Entities;
using RecruitSphereAI.Persistence.Entities;

namespace RecruitSphereAI.Persistence;

public class RecruitSphereDbContext : DbContext
{
    public RecruitSphereDbContext(DbContextOptions<RecruitSphereDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Candidate> Candidates => Set<Candidate>();
    public DbSet<Recruiter> Recruiters => Set<Recruiter>();
    public DbSet<HiringManager> HiringManagers => Set<HiringManager>();
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<Application> Applications => Set<Application>();
    public DbSet<Interview> Interviews => Set<Interview>();
    public DbSet<Feedback> Feedbacks => Set<Feedback>();
    public DbSet<SkillAssessment> SkillAssessments => Set<SkillAssessment>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<User>(entity =>
    {
        entity.HasKey(e => e.Id);
    
    
    entity.Property(e => e.Email)
        .HasConversion(
            email => email.Value,           
            value => new EmailAddress(value)) 
        .HasMaxLength(256)
        .IsRequired();

    entity.HasIndex(e => e.Email).IsUnique();
        entity.Property(e => e.PasswordHash).IsRequired();
        entity.Property(e => e.FullName).IsRequired().HasMaxLength(200);
        entity.Property(e => e.Role).HasConversion<string>();
        entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

        entity.HasOne(e => e.Candidate)
            .WithOne(c => c.User)
            .HasForeignKey<Candidate>(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(e => e.Recruiter)
            .WithOne(r => r.User)
            .HasForeignKey<Recruiter>(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.HasOne(e => e.HiringManager)
            .WithOne(h => h.User)
            .HasForeignKey<HiringManager>(h => h.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    });

    modelBuilder.Entity<Recruiter>(entity =>
    {
        entity.HasKey(e => e.Id);
    entity.Property(e => e.PositionTitle).HasMaxLength(200);
    entity.HasIndex(e => e.UserId).IsUnique();

    entity.HasOne(r => r.Organization)
        .WithMany()
        .HasForeignKey(r => r.OrganizationId)
        .OnDelete(DeleteBehavior.Restrict);     // <--- Important

    entity.HasMany(e => e.JobPostings)
        .WithOne(j => j.Recruiter)
        .HasForeignKey(j => j.RecruiterId)
        .OnDelete(DeleteBehavior.Restrict);
    });

    modelBuilder.Entity<HiringManager>(entity =>
    {
        entity.HasKey(e => e.Id);
    entity.Property(e => e.PositionTitle).HasMaxLength(200);
    entity.HasIndex(e => e.UserId).IsUnique();

    entity.HasOne(h => h.Organization)
        .WithMany()
        .HasForeignKey(h => h.OrganizationId)
        .OnDelete(DeleteBehavior.Restrict);     // <--- Important

    entity.HasOne(h => h.Department)
        .WithMany(d => d.HiringManagers)
        .HasForeignKey(h => h.DepartmentId)
        .OnDelete(DeleteBehavior.SetNull);

    entity.HasOne(h => h.User)
        .WithOne()
        .HasForeignKey<HiringManager>(h => h.UserId)
        .OnDelete(DeleteBehavior.Cascade);
    });

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Website).HasMaxLength(2048);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.HasIndex(e => new { e.OrganizationId, e.Name }).IsUnique();

            entity.HasMany(e => e.HiringManagers)
                .WithOne(h => h.Department)
                .HasForeignKey(h => h.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasMany(e => e.JobPostings)
                .WithOne(j => j.Department)
                .HasForeignKey(j => j.DepartmentId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<JobPosting>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(4000);
            entity.Property(e => e.Requirements).HasColumnType("nvarchar(max)");
            entity.Property(e => e.Location).HasMaxLength(200);
            entity.Property(e => e.Salary).HasPrecision(12, 2);
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.HasIndex(e => e.RecruiterId);
            entity.HasIndex(e => e.OrganizationId);
            entity.HasIndex(e => e.Status);

            entity.HasMany(e => e.Applications)
                .WithOne(a => a.JobPosting)
                .HasForeignKey(a => a.JobPostingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.SkillAssessments)
                .WithOne(s => s.JobPosting)
                .HasForeignKey(s => s.JobPostingId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.AppliedDate).HasDefaultValueSql("GETUTCDATE()");
            entity.HasIndex(e => new { e.JobPostingId, e.CandidateId }).IsUnique();

            entity.HasMany(e => e.Interviews)
                .WithOne(i => i.Application)
                .HasForeignKey(i => i.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Feedbacks)
                .WithOne(f => f.Application)
                .HasForeignKey(f => f.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Documents)
                .WithOne(d => d.Application)
                .HasForeignKey(d => d.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Interview>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.MeetingLink).HasMaxLength(2048);
            entity.HasIndex(e => e.ApplicationId).IsUnique();
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.Id);
    entity.Property(e => e.Comments).IsRequired().HasMaxLength(4000);
    entity.Property(e => e.Rating).HasDefaultValue(0);

    entity.HasOne(f => f.Application)
        .WithMany(a => a.Feedbacks)
        .HasForeignKey(f => f.ApplicationId)
        .OnDelete(DeleteBehavior.Cascade);

    entity.HasOne(f => f.Candidate)
        .WithMany(c => c.Feedbacks)
        .HasForeignKey(f => f.CandidateId)
        .OnDelete(DeleteBehavior.Restrict);   // This breaks the cycle

    entity.HasOne(f => f.User)
        .WithMany()
        .HasForeignKey(f => f.UserId)
        .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SkillAssessment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Notes).HasMaxLength(2000);
            entity.HasIndex(e => e.CandidateId);
            entity.HasIndex(e => e.JobPostingId);
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FileUrl).IsRequired().HasMaxLength(2048);
            entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.CandidateId);
            entity.HasIndex(e => e.ApplicationId);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.RelatedEntityType).HasMaxLength(100);
            entity.HasIndex(e => new { e.UserId, e.IsRead });
            entity.HasIndex(e => e.CreatedAt);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            entity.Property(e => e.EntityName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Details).HasMaxLength(4000);
            entity.HasIndex(e => e.Timestamp);
        });

        modelBuilder.Entity<RefreshTokenEntity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.Token).IsRequired();
            entity.Property(e => e.ExpiryDate).IsRequired();
            entity.Property(e => e.IsRevoked).IsRequired().HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).IsRequired().HasDefaultValueSql("GETUTCDATE()");
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => new { e.UserId, e.IsRevoked });
        });
    }
}
