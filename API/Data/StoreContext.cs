using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User, Role, int>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Course> Courses { get; set; } = null!;
        public DbSet<CourseMaterial> CourseMaterials { get; set; } = null!;

        public DbSet<Theme> Themes { get; set; } = null!;
        public DbSet<Message> Messages { get; set; } = null!;
        public DbSet<StudyProgram> StudyPrograms { get; set; } = null!;
        public DbSet<Year> Years { get; set; } = null!;
        public DbSet<MaterialType> MaterialTypes { get; set; } = null!;
        public DbSet<ProfessorCourse> ProfessorCourses { get; set; } = null!;
        public DbSet<UserCourse> UserCourses { get; set; } = null!;
        public DbSet<Form> Form { get; set; } = null!;
        public DbSet<Option> Option { get; set; } = null!;
        public DbSet<UserOption> UserOption { get; set; } = null!;





        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Role>()
                .HasData(
                    new Role { Id = 1, Name = "Profesor", NormalizedName = "PROFESOR" },
                    new Role { Id = 2, Name = "Student", NormalizedName = "STUDENT" }
                );
            builder.Entity<Year>()
                .HasData(
                    new Year { Id = 1, Name = "Prva godina", Description = "Prva godina" },
                    new Year { Id = 2, Name = "Druga godina", Description = "Druga godina" },
                    new Year { Id = 3, Name = "Treća godina", Description = "Treća godina" },
                    new Year { Id = 4, Name = "Četvrta godina", Description = "Četvrta godina" }
                );
            builder.Entity<StudyProgram>()
                .HasData(
                    new StudyProgram { Id = 1, Name = "Računarstvo i informatika", Description = "RiI" },
                    new StudyProgram { Id = 2, Name = "Automatika i elektronika", Description = "AiE" },
                    new StudyProgram { Id = 3, Name = "Elektroenergetika", Description = "EE" },
                    new StudyProgram { Id = 4, Name = "Zajedničke osnove", Description = "ZO" }
                );

            builder.Entity<MaterialType>()
                .HasData(
                    new MaterialType { Id = 1, Name = "Video", Description = "Video" },
                    new MaterialType { Id = 2, Name = "PDF", Description = "PDF" },
                    new MaterialType { Id = 3, Name = "Link", Description = "Link" },
                    new MaterialType { Id = 4, Name = "Dokument", Description = "Dokument" },
                    new MaterialType { Id = 5, Name = "Slika", Description = "Slika" }
                );



            builder.Entity<Message>()
                .HasOne(p => p.Theme)
                .WithMany(t => t.Messages)
                .HasForeignKey(p => p.ThemeId)
                .OnDelete(DeleteBehavior.Cascade);

            //PROVJERITI STA DA BUDE AKO SE OBRISE KORISNIK
            builder.Entity<Message>()
            .HasOne(m => m.User)
            .WithMany()
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Theme>()
            .HasOne(m => m.User)
            .WithMany()
            .HasForeignKey(m => m.UserId)
            .OnDelete(DeleteBehavior.SetNull);


            builder.Entity<Theme>()
            .HasOne(t => t.Course)
            .WithMany(c => c.Themes)
            .HasForeignKey(t => t.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CourseMaterial>()
            .HasOne(t => t.Course)
            .WithMany(c => c.Materials)
            .HasForeignKey(t => t.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

// builder.Entity<Theme>()
//     .HasOne(t => t.Course)
//     .WithMany(c => c.Themes) // Veza mora biti eksplicitno definisana u Course modelu
//     .HasForeignKey(t => t.CourseId)
//     .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}