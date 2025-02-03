using API.Data;
using API.DTOs;
using API.Entities;
using API.RequestHelpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ThemeController : BaseAPIController
    {
        private readonly StoreContext _context;
        private readonly UserManager<User> _userManager;

        private readonly IMapper _mapper;
        public ThemeController(StoreContext context, IMapper mapper, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("GetAllThemes")]
        public async Task<ActionResult<List<GetThemeDto>>> GetAllThemes([FromQuery] ThemeParams themeParams)
        {

            var query = _context.Themes.Include(u => u.User)
            .Include(c => c.Course).ThenInclude(y => y.Year)
            .Include(c => c.Course).ThenInclude(s => s.StudyProgram)
            .Include(m => m.Messages).ThenInclude(u => u.User)
            .Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse)
            .ThenInclude(u => u.User).AsQueryable();
            //var themes = await _context.Themes.Include(u => u.User).Include(c => c.Course).ThenInclude(y => y.Year).Include(c => c.Course).ThenInclude(s => s.StudyProgram).Include(m=>m.Messages).ThenInclude(u=>u.User).Include(c => c.Course).ThenInclude(p=>p.ProfessorsCourse).ThenInclude(u=>u.User).ToListAsync();

            if (themeParams.Type == "my")
            {
                var user = await _userManager.FindByNameAsync(User.Identity.Name);
                query = _context.Themes.Where(c => c.User.Email == user!.Email)
           .Include(u => u.User)
            .Include(c => c.Course).ThenInclude(y => y.Year)
            .Include(c => c.Course).ThenInclude(s => s.StudyProgram)
            .Include(m => m.Messages).ThenInclude(u => u.User)
            .Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse)
            .ThenInclude(u => u.User).AsQueryable();
            }
            // Filtriranje prema searchTerm
            if (!string.IsNullOrEmpty(themeParams.SearchTerm))
            {
                query = query.Where(t =>
                    t.Title.Contains(themeParams.SearchTerm) ||
                    t.Description!.Contains(themeParams.SearchTerm));
            }
            if (themeParams.ThemeStatus != "Sve")
            {
                if (themeParams.ThemeStatus == "Aktivno")
                {
                    query = query.Where(t => t.Active == true);
                }
                else if (themeParams.ThemeStatus == "Zatvoreno")
                {
                    query = query.Where(t => t.Active == false);
                }
            }


            // Filtriranje prema kategoriji
            if (themeParams.Category == "Slobodna tema")
            {
                query = query.Where(t =>
                    t.Course == null);
            }
            else if ((themeParams.Category != "all" && themeParams.Category != "Sve") && !string.IsNullOrEmpty(themeParams.Category))
            {
                query = query.Where(t => t.Course!.Name == themeParams.Category); // Teme sa specifičnim kursom
            }

            var themes = await query.ToListAsync();
            return themes.Select(c => _mapper.Map<GetThemeDto>(c)).ToList();
        }

        [HttpGet("GetTheme")]
        public async Task<ActionResult<GetThemeDto>> GetTheme(int id)
        {
            var theme = await _context.Themes.Include(u => u.User).Include(c => c.Course).ThenInclude(y => y.Year).Include(c => c.Course).ThenInclude(s => s.StudyProgram).Include(m => m.Messages).ThenInclude(u => u.User).Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse).ThenInclude(u => u.User).FirstOrDefaultAsync(t => t.Id == id);

            return _mapper.Map<GetThemeDto>(theme);
        }
        [HttpGet("getProfessorThemes/{id}")]
        public async Task<ActionResult<List<GetThemeDto>>> GetProfessorThemes(int id)
        {

            var themes = await _context.Themes.Where(c => c.User.Id == id)
           .Include(u => u.User)
            .Include(c => c.Course).ThenInclude(y => y.Year)
            .Include(c => c.Course).ThenInclude(s => s.StudyProgram)
            .Include(m => m.Messages).ThenInclude(u => u.User)
            .Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse)
            .ThenInclude(u => u.User).ToListAsync();

            return themes.Select(c => _mapper.Map<GetThemeDto>(c)).ToList();
        }
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var categories = await _context.Themes
                    .Select(t => t.Course == null ? "Slobodna tema" : t.Course.Name)
                    .Distinct()
                    .ToListAsync();

            // Dodavanje "SVE" na početak liste
            categories.Insert(0, "Sve");
            var activeStatus = await _context.Themes
                        .Select(t => t.Active ? "Aktivno" : "Zatvoreno")
                        .Distinct()
                        .ToListAsync();

            activeStatus.Insert(0, "Sve");


            return Ok(new { categories, activeStatus });
        }

        [Authorize]
        [HttpPost("CreateTheme")]
        public async Task<ActionResult<GetThemeDto>> CreateTheme(CreateThemeDto newTheme)
        {
            var user = await _userManager.FindByNameAsync(User!.Identity!.Name!);
            var theme = _mapper.Map<Theme>(newTheme);
            theme.UserId = user.Id;

            //POGLEDATI
            theme.User = user;
            if (newTheme.CourseId != 0)
            {
                var course = await _context.Courses.Include(y => y.Year)
                .Include(s => s.StudyProgram)
                .Include(c => c.ProfessorsCourse!).ThenInclude(pu => pu.User)
                .Include(c => c.UsersCourse)
                .Include(t => t.Themes).FirstOrDefaultAsync(c => c.Id == newTheme.CourseId);
                if (course != null)
                {
                    theme.Course = course;
                    theme.CourseId = newTheme.CourseId;
                }
            }
            else
                theme.CourseId = null;

            theme.Active = true;

            //nema poente jer themeDto nema kurs (ne dozvoljava jer i kurs ima teme pa se pravi ciklus)
            //nekako ucitati kurs ako postoji?
            // theme.Course=_context.Courses.FirstOrDefault<Course>(c=>c.Id==newTheme.CourseId);
            _context.Themes.Add(theme);
            await _context.SaveChangesAsync();
            // var themes = await _context.Themes.Include(u => u.User).Include(c => c.Course).ThenInclude(y => y.Year).Include(c => c.Course).ThenInclude(s => s.StudyProgram).Include(m=>m.Messages).ThenInclude(u=>u.User);
            var themeDto = _mapper.Map<GetThemeDto>(theme);
            // return CreatedAtAction(nameof(GetTheme), new { id = themeDto.Id }, themeDto);
            var response = new
            {
                Method = "CreateTheme",
                Status = "Success",
                Data = themeDto
            };

            return CreatedAtAction(nameof(GetTheme), new { id = themeDto.Id }, response);

        }

        [HttpPost("updateTheme")]
        public async Task<ActionResult<GetThemeDto>> UpdateTheme(UpdateThemeDto themeData)
        {
            var theme = await _context.Themes.Include(u => u.User).Include(c => c.Course).ThenInclude(y => y.Year).Include(c => c.Course).ThenInclude(s => s.StudyProgram).Include(m => m.Messages).ThenInclude(u => u.User).Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse).ThenInclude(u => u.User).FirstOrDefaultAsync(t => t.Id == themeData.Id);

            if (theme == null)
            {
                return NotFound("Theme not found.");
            }

            theme.Active = themeData.Active;

            await _context.SaveChangesAsync();

            return _mapper.Map<GetThemeDto>(theme);

        }

        [Authorize]
        [HttpPost("CreateMessage")]
        public async Task<ActionResult<List<GetMessageDto>>> CreateMessage(CreateMessageDto newMessage)
        {
            var creator = await _userManager.FindByNameAsync(User!.Identity!.Name!);
            var message = _mapper.Map<Message>(newMessage);
            message.UserId = creator.Id;
            message.User = creator;

            var theme = await _context.Themes.FirstOrDefaultAsync(t => t.Id == newMessage.ThemeId);
            if (theme != null)
            {
                message.Theme = theme;
                message.ThemeId = newMessage.ThemeId;
            }
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();


            var messages = await _context.Messages.Include(u => u.User).Include(t => t.Theme).ToListAsync();

            return messages.Select(c => _mapper.Map<GetMessageDto>(c)).ToList();
        }

        [HttpGet("GetAllMessages/{id}")]
        public async Task<ActionResult<List<GetMessageDto>>> GetAllMessages(int id)
        {
            var messages = await _context.Messages.Where(m => m.ThemeId == id).Include(u => u.User).Include(t => t.Theme).ToListAsync();

            return messages.Select(c => _mapper.Map<GetMessageDto>(c)).ToList();
        }

        [Authorize]
        [HttpDelete("DeleteTheme/{id}")]
        public async Task<IActionResult> DeleteTheme(int id)
        {
            var theme = await _context.Themes.FindAsync(id);

            if (theme == null)
            {
                return NotFound(new { Message = "Tema nije pronađena." });
            }

            _context.Themes.Remove(theme);
            await _context.SaveChangesAsync();

            var response = new
            {
                Method = "DeleteTheme",
                Status = "Success",
                Message = "Tema obrisana.",
                Id = id 
            };

            return Ok(response); // Vraćamo JSON sa ID-jem i porukom
        }

    }
}