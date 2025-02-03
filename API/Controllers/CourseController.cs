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

        [Authorize]
        [HttpGet("getAllCourses")]
        public async Task<IActionResult> GetCourses([FromQuery] CourseParams coursesParams)
        {
            var query = _context.Courses
            .Include(y => y.Year)
            .Include(s => s.StudyProgram)
            .Include(c => c.ProfessorsCourse!).ThenInclude(pu => pu.User)
            .Include(c => c.UsersCourse)
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
            return Ok(new{coursesDto, pagedCourses.MetaData});  // Samo mapirani podaci


        }



        // [HttpGet("getMyCourses/{email}")]
        // public async Task<ActionResult<List<CourseDto>>> GetMyCourses(string email)
        // {
        //     //moze se raditi i bez prosljedjivanja parametra ali eto mozda zatreba
        //     // var user=await _userManager.FindByNameAsync(User.Identity.Name);

        //     // var courses = await _context.Courses
        //     // .Where(c => c.UsersCourse!.Any(pc => pc.UserId == user!.Id))
        //     // .Include(y => y.Year).Include(s => s.StudyProgram).ToListAsync();

        //     var user = await _userManager.FindByEmailAsync(email);

        //     var courses = await _context.Courses
        //     .Where(c => c.UsersCourse!.Any(pc => pc.UserId == user!.Id))
        //     .Include(y => y.Year).Include(s => s.StudyProgram).Include(t => t.Themes).ToListAsync();
        //     return courses.Select(c => _mapper.Map<CourseDto>(c)).ToList();

        // }

        [HttpGet("getProfessorsCourses/{id}")]
        public async Task<ActionResult<List<CourseDto>>> getProfessorsCourses(int id)
        {
            var courses = await _context.Courses
            .Where(c => c.ProfessorsCourse!.Any(pc => pc.UserId == id))
            .Include(y => y.Year).Include(s => s.StudyProgram).Include(pc=>pc.ProfessorsCourse).ThenInclude(u=>u.User).Include(uc=>uc.UsersCourse).ThenInclude(u=>u.User).ToListAsync();

            return courses.Select(c => _mapper.Map<CourseDto>(c)).ToList();
        }

        [HttpGet("getCourseById/{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(int id)
        {
            var course = await _context.Courses
        .Include(y => y.Year)
        .Include(s => s.StudyProgram)
        .Include(t => t.Themes)
        .Include(pc=>pc.ProfessorsCourse).ThenInclude(u=>u.User)
        .Include(uc=>uc.UsersCourse).ThenInclude(u=>u.User)
        .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
            {
                return NotFound();
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

    }
}