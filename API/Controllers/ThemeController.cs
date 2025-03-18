using System.Text.RegularExpressions;
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
    public class ThemeController : BaseAPIController
    {
        private readonly StoreContext _context;
        private readonly UserManager<User> _userManager;
        private readonly FirebaseService _firebaseService;

        private readonly IMapper _mapper;
        public ThemeController(StoreContext context, IMapper mapper, UserManager<User> userManager, FirebaseService firebaseService)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
            _firebaseService = firebaseService;
        }

        [HttpGet("GetAllThemes")]
        public async Task<ActionResult<List<GetThemeDto>>> GetAllThemes([FromQuery] ThemeParams themeParams)
        {

            var query = _context.Themes
            .Include(u => u.User)
            .Include(c => c.Course)
                .ThenInclude(y => y.Year)
            .Include(c => c.Course)
                .ThenInclude(s => s.StudyProgram)
            .Include(m => m.Messages)
                .ThenInclude(u => u.User)
            .Include(c => c.Course)
                .ThenInclude(p => p.ProfessorsCourse)
                    .ThenInclude(u => u.User)
            .Include(c => c.Course)
                .ThenInclude(uc => uc.UsersCourse) 
                    .ThenInclude(u => u.User)
            .AsQueryable();


            if (themeParams.Type == "my")
            {
            var userEmail = User.FindFirst("preferred_username")?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);
                query = _context.Themes.Where(c => c.User.Email == user!.Email)
            .Include(u => u.User)
            .Include(c => c.Course).ThenInclude(y => y.Year)
            .Include(c => c.Course).ThenInclude(s => s.StudyProgram)
            .Include(m => m.Messages).ThenInclude(u => u.User)
            .Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse).ThenInclude(u => u.User).Include(c => c.Course)
            .ThenInclude(uc => uc.UsersCourse) 
             .ThenInclude(u => u.User) 
            .AsQueryable();
            }
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

            if (themeParams.Category == "Slobodna tema")
            {
                query = query.Where(t =>
                    t.Course == null);
            }
            else if ((themeParams.Category != "all" && themeParams.Category != "Sve") && !string.IsNullOrEmpty(themeParams.Category))
            {
                query = query.Where(t => t.Course!.Name == themeParams.Category);
            }

            var themes = await query.ToListAsync();
            var themesDto = themes.Select(c => _mapper.Map<GetThemeDto>(c)).ToList();
            foreach (var theme in themesDto)
            {
                if (theme.User != null)
                {
                    var roles = await _userManager.GetRolesAsync(_mapper.Map<Theme>(theme).User);
                    var role = roles.FirstOrDefault();
                    theme.User.Role = role;
                }
            }
            return themesDto;
        }

        [HttpGet("GetTheme/{id}")]
        public async Task<ActionResult<GetThemeDto>> GetTheme(int id)
        {
            var theme = await _context.Themes.Include(u => u.User).Include(c => c.Course).ThenInclude(y => y.Year).Include(c => c.Course).ThenInclude(s => s.StudyProgram).Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse).ThenInclude(u => u.User).Include(c => c.Course).ThenInclude(u => u.UsersCourse).ThenInclude(uu => uu.User).FirstOrDefaultAsync(t => t.Id == id);

            var userEmail = User.FindFirst("preferred_username")?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();
         
            if (theme == null)
            {
                return NotFound();
            }

            if (theme.Course != null)
            {
                if (role == "Student")
                {
                    bool isStudentEnrolled = theme.Course.UsersCourse.Any(uc => uc.User.Id == user.Id && uc.WithdrawDate == null);

                    if (!isStudentEnrolled)
                    {
                        return Unauthorized(new { title = "Nemate pristup ovoj temi. (student)", status = 401 });
                    }
                }

                if (role == "Profesor")
                {
                    bool isProfessorOfCourse = theme.Course.ProfessorsCourse.Any(pc => pc.User.Id == user.Id && pc.WithdrawDate == null);

                    if (!isProfessorOfCourse)
                    {
                        return Unauthorized(new { title = "Nemate pristup ovoj temi. (prof)", status = 401 });
                    }
                }
            }

            return Ok(_mapper.Map<GetThemeDto>(theme));

        }


        [HttpGet("GetThemeByMessageId/{id}")]
        public async Task<ActionResult<GetThemeDto>> GetThemeByMessageId(int id)
        {
            var message=await _context.Messages.Where(m=>m.Id==id).FirstOrDefaultAsync();
            var themeId=message.ThemeId;
            var theme = await _context.Themes.Include(u => u.User).Include(c => c.Course).ThenInclude(y => y.Year).Include(c => c.Course).ThenInclude(s => s.StudyProgram).Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse).ThenInclude(u => u.User).Include(c => c.Course).ThenInclude(u => u.UsersCourse).ThenInclude(uu => uu.User).FirstOrDefaultAsync(t => t.Id == themeId);
            if (theme == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<GetThemeDto>(theme));

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
            var userEmail = User.FindFirst("preferred_username")?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);
            var theme = _mapper.Map<Theme>(newTheme);
            theme.UserId = user.Id;

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

            _context.Themes.Add(theme);
            await _context.SaveChangesAsync();
            var themeDto = _mapper.Map<GetThemeDto>(theme);

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
            var theme = await _context.Themes.Include(u => u.User).Include(c => c.Course).ThenInclude(y => y.Year).Include(c => c.Course).ThenInclude(s => s.StudyProgram).Include(m => m.Messages).ThenInclude(u => u.User).Include(c => c.Course).ThenInclude(p => p.ProfessorsCourse).ThenInclude(u => u.User).Include(c => c.Course).ThenInclude(p => p.UsersCourse).ThenInclude(u => u.User).FirstOrDefaultAsync(t => t.Id == themeData.Id);

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
        public async Task<ActionResult<GetMessageDto>> CreateMessage(CreateMessageDto newMessage)
        {
            var userEmail = User.FindFirst("preferred_username")?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);
            var creator = await _context.Users.Include(t => t.FcmTokens).FirstOrDefaultAsync(t => t.Id == user.Id);
            var message = _mapper.Map<Message>(newMessage);
            message.UserId = creator.Id;
            message.User = creator;

            var theme = await _context.Themes.Include(u => u.User).ThenInclude(f => f.FcmTokens).FirstOrDefaultAsync(t => t.Id == newMessage.ThemeId);
            if (theme != null)
            {
                message.Theme = theme;
                message.ThemeId = newMessage.ThemeId;
            }
            if (newMessage.Materials != null)
            {
                message.Materials = newMessage.Materials
                    .Select(m => new MessageMaterial
                    {
                        Title = m.Title,
                        FilePath = m.FilePath,
                        Url = m.Url,
                        MaterialTypeId = m.MaterialTypeId,
                        CreationDate = m.CreationDate,
                        MaterialType = _context.MaterialTypes.FirstOrDefault(mt => mt.Id == m.MaterialTypeId) 
                    }).ToList();
            }
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var themeCreator = theme.User;


            var tokens = creator.FcmTokens.Select(t => t.Token).ToList();
            var creatorTokens = themeCreator.FcmTokens.Select(t => t.Token).ToList();



            if (themeCreator.Id != creator.Id)
                await _firebaseService.SendNotificationAsync(creatorTokens, "Poruka", "Imate novu poruku na temi " + theme.Title);

            var mentionedUsernames = FindMentionedUsernames(newMessage.Content);
            foreach (var username in mentionedUsernames)
            {
                var mentionedUser = await _context.Users.Include(u => u.FcmTokens).FirstOrDefaultAsync(u => u.UserName == username);
                if (mentionedUser != null && mentionedUser.Id != creator.Id)
                {
                    var mentionedUserTokens = mentionedUser.FcmTokens.Select(t => t.Token).ToList();
                    await _firebaseService.SendNotificationAsync(mentionedUserTokens, "Obavještenje", $"Korisnik {creator.UserName} vas je pomenuo u poruci na temi {theme.Title}");
                }
            }

            var response = new
            {
                Method = "AddMessage",
                Status = "Success",
                Data = _mapper.Map<GetMessageDto>(message)
            };

            return CreatedAtAction(nameof(GetMessageById), new { id = message.Id }, response);
        }

        private List<string> FindMentionedUsernames(string content)
        {
            var mentionedUsernames = new List<string>();
var regex = new Regex(@"@([\w]+\.[\w]+\.\d+)");
            var matches = regex.Matches(content);
            foreach (Match match in matches)
            {
                mentionedUsernames.Add(match.Groups[1].Value);
            }
            return mentionedUsernames;
        }


        [HttpPost("uploadFile")]
        public async Task<IActionResult> UploadMessageFile(IFormFile file)
        {
            var themeId = int.Parse(Request.Form["themeId"]);
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsFolder); 

            var fileExtension = Path.GetExtension(file.FileName);

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmssfff");
            var uniqueFileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{themeId}_{timestamp}{fileExtension}";

            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { filePath = $"uploads/{uniqueFileName}" });
        }



        [HttpGet("GetMessageById/{id}")]
        public async Task<ActionResult<GetMessageDto>> GetMessageById(int id)
        {
            var message = await _context.Messages.Include(u => u.User).Include(t => t.Theme).Include(m => m.Materials).ThenInclude(mt => mt.MaterialType).FirstOrDefaultAsync(m => m.Id == id);
            if (message == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<GetMessageDto>(message));


        }

        [HttpGet("GetAllMessages/{id}")]
        public async Task<ActionResult<List<GetMessageDto>>> GetAllMessages(int id)
        {
            var messages = await _context.Messages.Where(m => m.ThemeId == id).Include(u => u.User).Include(t => t.Theme).Include(m => m.Materials).ThenInclude(mt => mt.MaterialType).ToListAsync();

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

            return Ok(response); 
        }

        [Authorize]
        [HttpDelete("DeleteMessage/{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var message = await _context.Messages.Include(m => m.Forms).Include(m => m.Materials).FirstOrDefaultAsync(m => m.Id == id);

            if (message == null)
            {
                return NotFound(new { Message = "Poruka nije pronađena." });
            }
            if (message.Forms != null && message.Forms.Count != 0)
            {
                foreach (var form in message.Forms)
                {
                    _context.Form.Remove(form);
                }
                await _context.SaveChangesAsync();

            }

            if (message.Materials?.Count > 0)
            {
                foreach (var material in message.Materials)
                {
                    if (!string.IsNullOrEmpty(material.FilePath))
                    {
                        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", material.FilePath);
                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                    }
                }
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            var response = new
            {
                Method = "DeleteMessage",
                Status = "Success",
                Message = "Poruka obrisana.",
                Id = id
            };

            return Ok(response); 
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<GetMessageDto>>> SearchMessages([FromQuery] int themeId, [FromQuery] string? query = "")
        {
            if (string.IsNullOrEmpty(query))
            {
                return Ok(new List<GetMessageDto>()); 
            }

            var results = await _context.Messages
                .Where(m => m.ThemeId == themeId &&
                    (m.Content.ToLower().Contains(query.ToLower()) ||
                    (m.Materials != null && m.Materials.Any(mat => mat.Title.ToLower().Contains(query.ToLower())))
                    || (m.Forms != null && m.Forms.Any(f => f.Topic.ToLower().Contains(query.ToLower())))
                    ))
                .ToListAsync();



            return Ok(results.Select(c => _mapper.Map<GetMessageDto>(c)).ToList());
        }
    }
}