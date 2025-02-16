using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.RequestHelpers;
using API.Services;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CourseController : BaseAPIController
    {
        private readonly StoreContext _context;
        private readonly UserManager<User> _userManager;

        private readonly IMapper _mapper;
        public CourseController(StoreContext context, IMapper mapper, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        public class EnrollRequest
        {
            public int CourseId { get; set; }
        }


        [HttpGet("getAllCoursesList")]
        public async Task<ActionResult<List<CourseDto>>> GetCoursesList()
        {
            var query = _context.Courses
            .Include(y => y.Year)
            .Include(s => s.StudyProgram)
            .Include(c => c.ProfessorsCourse!).ThenInclude(pu => pu.User)
            .Include(c => c.UsersCourse)
            .Include(t => t.Themes)

            .AsQueryable();


            var courses = await query.ToListAsync();

            return courses.Select(c => _mapper.Map<CourseDto>(c)).ToList();
        }

        [HttpGet("getAllCourses")]
        public async Task<IActionResult> GetCourses([FromQuery] CourseParams coursesParams)
        {
            var query = _context.Courses
            .Include(y => y.Year)
            .Include(s => s.StudyProgram)
            .Include(c => c.ProfessorsCourse!).ThenInclude(pu => pu.User)
            .Include(c => c.UsersCourse).ThenInclude(uc => uc.User)
            .Include(t => t.Themes)
            .AsQueryable();


            //trenutno prikazuje samo kurseve koje je neko napravio, a ne na koje je upisan
            if (coursesParams.Type == "my")
            {
                var user = await _userManager.FindByNameAsync(User.Identity.Name);

                query = _context.Courses.Where(c => c.ProfessorsCourse!.Any(pc => pc.UserId == user!.Id))
            .Include(y => y.Year)
            .Include(s => s.StudyProgram)
            .Include(c => c.ProfessorsCourse!).ThenInclude(pu => pu.User)
            .Include(c => c.UsersCourse).ThenInclude(uc => uc.User)
            .Include(t => t.Themes)
            .AsQueryable();
            }
            if (coursesParams.Type == "myLearning")
            {
                var user = await _userManager.FindByNameAsync(User.Identity.Name);

                query = _context.Courses.Where(c => c.UsersCourse!.Any(uc => uc.UserId == user!.Id))
            .Include(y => y.Year)
            .Include(s => s.StudyProgram)
            .Include(c => c.ProfessorsCourse!).ThenInclude(pu => pu.User)
            .Include(c => c.UsersCourse).ThenInclude(uc => uc.User)
            .Include(c => c.UsersCourse)
            .Include(t => t.Themes)
            .AsQueryable();
            }
            if (!string.IsNullOrEmpty(coursesParams.SearchTerm))
            {
                query = query.Where(c =>
                    c.Name.Contains(coursesParams.SearchTerm) ||
                    c.Description.Contains(coursesParams.SearchTerm));
            }
            if (coursesParams.Years != null && coursesParams.Years.Count > 0)
            {
                query = query.Where(c => coursesParams.Years.Contains(c.Year!.Name));
            }

            if (coursesParams.StudyPrograms != null && coursesParams.StudyPrograms.Count > 0)
            {
                query = query.Where(c => coursesParams.StudyPrograms.Contains(c.StudyProgram!.Name));
            }


            // Mapiranje na ProductDto
            var pagedCourses = await PagedList<Course>.ToPagedList(query, coursesParams.PageNumber, coursesParams.PageSize);
            var coursesDto = _mapper.Map<List<CourseDto>>(pagedCourses.Items);

            // Dodavanje paginacije u HTTP header
            Response.AddPaginationHeader(pagedCourses.MetaData);

            // Vraćanje mapiranih podataka bez dodatne paginacije
            return Ok(new { coursesDto, pagedCourses.MetaData });  // Samo mapirani podaci
        }

        [HttpGet("getProfessorsCourses/{id}")]
        public async Task<IActionResult> getProfessorsCourses(int id)
        {
            var courses = await _context.Courses
            .Where(c => c.ProfessorsCourse!.Any(pc => pc.UserId == id))
            .Include(y => y.Year).Include(s => s.StudyProgram).Include(pc => pc.ProfessorsCourse).ThenInclude(u => u.User).Include(uc => uc.UsersCourse).ThenInclude(u => u.User).ToListAsync();



            var coursesDto=courses.Select(c => _mapper.Map<CourseDto>(c)).ToList();
            return Ok(new {
                profId=id,
                courses=coursesDto,
            });
        }

        [HttpGet("getCourseById/{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(int id)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            // if (user == null)
            // {
            //     return Unauthorized();
            // }

            // Dobijanje role korisnika
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            // Učitavanje kursa sa svim potrebnim podacima
            var course = await _context.Courses
                .Include(y => y.Year)
                .Include(s => s.StudyProgram)
                .Include(t => t.Themes).ThenInclude(m => m.Messages)
                .Include(pc => pc.ProfessorsCourse).ThenInclude(u => u.User)
                .Include(uc => uc.UsersCourse).ThenInclude(u => u.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
            {
                return NotFound();
            }

            // Provera da li korisnik ima pravo pristupa kursu
            if (role == "Profesor")
            {
                if (course.ProfessorsCourse != null)
                {
                    bool isProfessorOfCourse = course.ProfessorsCourse.Any(pc => pc.User.Id == user.Id);
                    if (!isProfessorOfCourse)
                    {
                        return Unauthorized(new { title = "Nemate pristup ovom kursu.", status = 401 }); // Profesor nije predavač na ovom kursu
                    }
                }
            }
            else if (role == "Student")
            {
                if (course.UsersCourse != null)
                {

                    bool isStudentEnrolled = course.UsersCourse.Any(uc => uc.User.Id == user.Id);
                    if (!isStudentEnrolled)
                    {
                        return Unauthorized(new { title = "Niste upisani na ovaj kurs.", status = 401 }); // Student nije upisan na kurs
                    }
                }
                else return Unauthorized(); // Student nije upisan na kurs

            }

            return Ok(_mapper.Map<CourseDto>(course));
        }


        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var years = await _context.Courses.Select(c => c.Year!).Distinct().ToListAsync();
            var programs = await _context.Courses.Select(c => c.StudyProgram!).Distinct().ToListAsync();


            return Ok(new { years, programs });
        }

        [HttpGet("yearsPrograms")]
        public async Task<IActionResult> GetYearsPrograms()
        {
            var years = await _context.Years.ToListAsync();
            var programs = await _context.StudyPrograms.ToListAsync();


            return Ok(new { years, programs });
        }

        [Authorize]
        [HttpPost("CreateCourse")]
        public async Task<ActionResult<CourseDto>> CreateCourse(CreateCourseDto newCourse)
        {
            var user = await _userManager.FindByNameAsync(User!.Identity!.Name!);

            var course = _mapper.Map<Course>(newCourse);
            course.Year = await _context.Years
            .FirstOrDefaultAsync(y => y.Id == newCourse.YearId);
            course.YearId = newCourse.YearId;

            course.StudyProgram = await _context.StudyPrograms
            .FirstOrDefaultAsync(y => y.Id == newCourse.StudyProgramId);
            course.StudyProgramId = newCourse.StudyProgramId;

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            var professorCourse = new ProfessorCourse
            {
                UserId = user!.Id,
                CourseId = course.Id,
                EnrollDate = course.CourseCreationDate
            };

            // Dodavanje veze u bazu
            _context.ProfessorCourses.Add(professorCourse);
            await _context.SaveChangesAsync();
            var courseDto = _mapper.Map<CourseDto>(course);
            // return CreatedAtAction(nameof(GetCourse), new { id = courseDto.Id }, courseDto);
            var response = new
            {
                Method = "CreateCourse",
                Status = "Success",
                Data = courseDto
            };

            return CreatedAtAction(nameof(GetCourse), new { id = courseDto.Id }, response);

        }
        [Authorize]
        [HttpDelete("DeleteCourse/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound(new { Message = "Kurs nije pronađen." });
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            var response = new
            {
                Method = "DeleteCourse",
                Status = "Success",
                Message = "Kurs obrisan.",
                Id = id
            };

            return Ok(response); // Vraćamo JSON sa ID-jem i porukom
        }

        [Authorize]
        [HttpPost("AddMaterial")]
        public async Task<ActionResult<GetCourseMaterialDto>> AddMaterial(CreateCourseMaterialDto material)
        {
            var user = await _userManager.FindByNameAsync(User!.Identity!.Name!);
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == material.CourseId);

            if (course == null)
                return NotFound("Course not found");

            // var addedMaterials = new List<CourseMaterial>();


            var m = _mapper.Map<CourseMaterial>(material);
            m.MaterialType = await _context.MaterialTypes.FirstOrDefaultAsync(mt => mt.Id == m.MaterialTypeId);
            m.Course = course;
            m.CreationDate = DateTime.UtcNow;

            // Prvo dodaj materijal u bazu da dobije ID
            _context.CourseMaterials.Add(m);
            await _context.SaveChangesAsync(); // Potrebno da bi se generisao ID
                                               // var fileExtension = Path.GetExtension(material.Title);
                                               // var newFileName = $"{Path.GetFileNameWithoutExtension(material.Title)}_{m.CourseId}_{m.Week}{fileExtension}";
            m.FilePath = material.FilePath;


            await _context.SaveChangesAsync(); // Ažuriraj materijal sa putanjom fajla


            // addedMaterials.Add(m);


            if (course.WeekCount < material.Week)
                course.WeekCount = material.Week;

            await _context.SaveChangesAsync();

            var response = new
            {
                Method = "AddMaterial",
                Status = "Success",
                Data = _mapper.Map<GetCourseMaterialDto>(m)
            };

            return CreatedAtAction(nameof(GetCourseMaterial), new { id = m.Id }, response);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            var courseId = int.Parse(Request.Form["courseId"]);
            var weekNumber = int.Parse(Request.Form["weekNumber"]);
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsFolder); // Kreira folder ako ne postoji

            var fileExtension = Path.GetExtension(file.FileName);

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
            var uniqueFileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{courseId}_{weekNumber}_{timestamp}{fileExtension}";

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Vraćamo relativnu putanju fajla (bez root putanje)
            return Ok(new { filePath = $"uploads/{uniqueFileName}" });
        }

        [Authorize]
        [HttpDelete("DeleteMaterial/{id}")]
        public async Task<IActionResult> DeleteMaterial(int id)
        {
            var material = await _context.CourseMaterials.FindAsync(id);

            if (material == null)
                return NotFound("Material not found");

            // Brisanje fajla iz uploads foldera
            if (!string.IsNullOrEmpty(material.FilePath))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", material.FilePath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            // Brisanje materijala iz baze
            _context.CourseMaterials.Remove(material);
            await _context.SaveChangesAsync();

            var response = new
            {
                Method = "DeleteMaterial",
                Status = "Success",
                Message = "Materijal je obrisan.",
                Id = id
            };
            return Ok(response); // Vraćamo JSON sa ID-jem i porukom

        }


        [HttpGet("getCourseMaterialById/{id}")]
        public async Task<ActionResult<GetCourseMaterialDto>> GetCourseMaterial(int id)
        {
            var material = await _context.CourseMaterials.Include(m => m.MaterialType)
        .FirstOrDefaultAsync(c => c.Id == id);

            if (material == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<GetCourseMaterialDto>(material));
        }

        [HttpGet("getCourseMaterialsByCourseId/{courseId}")]
        public async Task<ActionResult<List<GetCourseMaterialDto>>> GetCourseMaterialsByCourseId(int courseId)
        {
            var materials = await _context.CourseMaterials.Where(c => c.CourseId == courseId).Include(m => m.MaterialType).ToListAsync();


            if (materials == null)
            {
                return NotFound();
            }

            return materials.Select(m => _mapper.Map<GetCourseMaterialDto>(m)).ToList();
        }


        [Authorize]
        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollStudent([FromBody] EnrollRequest request)
        {
            int courseId = request.CourseId;

            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId);

            var student = await _userManager.FindByNameAsync(User!.Identity!.Name!);


            if (student == null)
                return NotFound("Student nije pronađen");

            if (course == null)
                return NotFound("Kurs nije pronađen");

            // Provera da li je student već upisan na kurs
            var existingEnrollment = await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.UserId == student.Id && uc.CourseId == courseId);

            if (existingEnrollment != null)
                return BadRequest("Student je već upisan na kurs.");

            // Kreiranje novog zapisa
            var enrollment = new UserCourse
            {
                UserId = student.Id,
                CourseId = courseId,
                EnrollDate = DateTime.UtcNow // Ako želiš da čuvaš datum upisa

            };

            _context.UserCourses.Add(enrollment);
            await _context.SaveChangesAsync();

            var studentDto = new UserDto
            {
                Email = student.Email,
                Username = student.UserName,
                FirstName = student.FirstName,
                LastName = student.LastName,
                Id = student.Id,
            };
            var courseDto = _mapper.Map<CourseDto>(course);

            return Ok(new
            {
                Message = "Uspješan upis na kurs",
                student = studentDto,
                course = courseDto,
            });
        }

    }
}