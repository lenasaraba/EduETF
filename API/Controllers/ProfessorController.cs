using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProfessorController : BaseAPIController
    {

        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly RoleManager<Role> _roleManager;
        private readonly UserManager<User> _userManager;

        public ProfessorController(StoreContext context, IMapper mapper, RoleManager<Role> roleManager, UserManager<User> userManager)
        {
            _context = context;
            _mapper = mapper;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public class AddRequest
        {
            public int CourseId { get; set; }
            public int ProfessorId { get; set; }

        }

         public class RemoveRequestP
        {
            public int CourseId { get; set; }

        }

        [HttpGet("GetAllProfessors")]
        public async Task<ActionResult<List<UserDto>>> GetAllProfessors([FromQuery] ProfessorsParams professorsParams)
        {
            int roleId = 1;
            var role = await _roleManager.FindByIdAsync(roleId.ToString());
            if (role == null)
            {
                return NotFound("Role not found");
            }

            // Kreiranje upita za sve profesore sa specifičnom ulogom
            var query = _context.Users
                .Where(u => _context.UserRoles
                    .Where(ur => ur.RoleId == role.Id)
                    .Any(ur => ur.UserId == u.Id))
                .Include(u => u.ProfessorCourses) // Veza sa kursevima profesora
                    .ThenInclude(pc => pc.Course)
                    .ThenInclude(c => c.StudyProgram) // Veza sa programima
                .Include(u => u.ProfessorCourses)
                    .ThenInclude(pc => pc.Course)
                    .ThenInclude(c => c.Year) // Veza sa godinama
                .AsQueryable();

            // Filtriranje prema imenu i prezimenu
            if (!string.IsNullOrEmpty(professorsParams.SearchTerm))
            {
                query = query.Where(p =>
                    p.FirstName.Contains(professorsParams.SearchTerm) ||
                    p.LastName.Contains(professorsParams.SearchTerm));
            }

            // Filtriranje prema godinama
            if (!string.IsNullOrEmpty(professorsParams.Year))
            {
                if (professorsParams.Year != "Sve")
                    query = query.Where(p =>
                        p.ProfessorCourses.Any(pc => pc.Course.Year.Name == professorsParams.Year));
            }

            // Filtriranje prema programima
            if (!string.IsNullOrEmpty(professorsParams.Program))
            {
                if (professorsParams.Program != "Sve")
                    query = query.Where(p =>
                        p.ProfessorCourses.Any(pc => pc.Course.StudyProgram.Name == professorsParams.Program));
            }



            // Izvršavanje upita
            var professors = await query.ToListAsync();

            // Mapiranje rezultata na DTO
            return professors.Select(p => _mapper.Map<UserDto>(p)).ToList();
        }

        [HttpGet("GetUserById/{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(m => m.Id == id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<UserDto>(user));


        }

        [HttpGet("getProfessorYearsPrograms/{id}")]
        public async Task<ActionResult> GetProfessorYearsPrograms(int id)
        {
            var years = await _context.ProfessorCourses
                .Where(pc => pc.UserId == id) // Filtriranje po ID-u profesora
                .Select(pc => pc.Course!.Year) // Dohvatanje godina iz povezanog kursa
                .Distinct()
                .ToListAsync();


            var programs = await _context.ProfessorCourses
                .Where(pc => pc.UserId == id) // Filtriranje po ID-u profesora
                .Select(pc => pc.Course!.StudyProgram) // Dohvatanje programa iz povezanog kursa
                .Distinct()
                .ToListAsync();



            return Ok(new { years, programs });

        }
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var years = await _context.Courses.Select(c => c.Year!.Name).Distinct().ToListAsync();
            var programs = await _context.Courses.Select(c => c.StudyProgram!.Name).Distinct().ToListAsync();

            years.Insert(0, "Sve");
            programs.Insert(0, "Sve");


            return Ok(new { years, programs });
        }


        [Authorize(Roles = "Profesor")]
        [HttpPost("addProfessorToCourse")]
        public async Task<IActionResult> AddProfessorToCourse([FromBody] AddRequest request)
        {
            int courseId = request.CourseId;
            int professorId = request.ProfessorId;

            var course = await _context.Courses.Include(c => c.Year).Include(c => c.StudyProgram).FirstOrDefaultAsync(c => c.Id == courseId);

            var professor = await _userManager.FindByIdAsync(professorId.ToString());


            if (professor == null)
                return NotFound("Profesor nije pronađen");

            if (course == null)
                return NotFound("Kurs nije pronađen");

            // Provera da li je student već upisan na kurs
            var existingEnrollment = await _context.ProfessorCourses
                .FirstOrDefaultAsync(pc => pc.UserId == professor.Id && pc.CourseId == courseId);

            if (existingEnrollment != null)
                return BadRequest("Profesor je već dodat na kurs.");

            // Kreiranje novog zapisa
            var enrollment = new ProfessorCourse
            {
                UserId = professor.Id,
                CourseId = courseId,
                EnrollDate = DateTime.UtcNow // Ako želiš da čuvaš datum upisa

            };

            _context.ProfessorCourses.Add(enrollment);
            await _context.SaveChangesAsync();

            var professorDto = new UserDto
            {
                Email = professor.Email,
                Username = professor.UserName,
                FirstName = professor.FirstName,
                LastName = professor.LastName,
                Id = professor.Id,
            };
            var courseDto = _mapper.Map<CourseDto>(course);

            return Ok(new
            {
                Message = "Uspješan upis na kurs",
                professor = professorDto,
                course = courseDto,
                enrollDate = enrollment.EnrollDate,
                pcId = enrollment.Id
            });
        }

        [Authorize(Roles = "Profesor")]
        [HttpPost("removeProfessorFromCourse")]
        public async Task<IActionResult> RemoveProfessorFromCourse([FromBody] RemoveRequestP request)
        {
            int courseId = request.CourseId;

            // Provera identiteta profesora
            var professor = await _userManager.FindByNameAsync(User.Identity.Name);
            // int professorId=professor.Id;
            if (professor == null)
                return NotFound("Profesor nije pronađen");

            // Provera da li kurs postoji
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);
            if (course == null)
                return NotFound("Kurs nije pronađen");

            // Provera da li je profesor upisan na kurs
            var enrollment = await _context.ProfessorCourses
                .FirstOrDefaultAsync(pc => pc.UserId == professor.Id && pc.CourseId == courseId);

            if (enrollment == null)
                return BadRequest("Profesor nije upisan na kurs.");

            enrollment.WithdrawDate=DateTime.UtcNow;

            // Brisanje zapisa o upisu profesora na kurs
            // _context.ProfessorCourses.Remove(enrollment);
            await _context.SaveChangesAsync();

            return Ok(new
            {   Method="RemoveProfessorFromCourse",
                Message = "Uspješno ste ispisani sa kursa.",
                professorId = professor.Id,
                courseId = course.Id,
                withdrawDate=enrollment.WithdrawDate
            });
        }

    }
}