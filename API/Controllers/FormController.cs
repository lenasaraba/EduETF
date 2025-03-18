using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class FormController : BaseAPIController
    {
        private readonly StoreContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IMapper _mapper;
        private readonly FirebaseService _firebaseService;

        public FormController(StoreContext context, IMapper mapper, UserManager<User> userManager, RoleManager<Role> roleManager, FirebaseService firebaseService)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
            _roleManager = roleManager;
            _firebaseService = firebaseService;
        }

        [HttpGet("getAllForms")]
        public async Task<ActionResult<List<GetFormDto>>> GetAllForms()
        {
            var userEmail = User.FindFirst("preferred_username")?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);

            var query = _context.Form
            .Where(u => u.User.Email == user.Email)
            .Include(u => u.User)
            .Include(c => c.Course)
            .Include(m => m.Message).ThenInclude(t => t.Theme)
            .Include(o => o.Options).ThenInclude(o => o.UsersOption)
            .AsQueryable();

            var forms = await query.ToListAsync();

            return forms.Select(f => _mapper.Map<GetFormDto>(f)).ToList();
        }

        [HttpGet("getCourseForms/{id}")]
        public async Task<ActionResult<List<GetFormDto>>> GetCourseForms(int id)
        {

            var query = _context.Form
            .Where(u => u.CourseId == id)
            .Include(u => u.User)
            .Include(c => c.Course)
            .Include(m => m.Message).ThenInclude(t => t.Theme)
            .Include(o => o.Options).ThenInclude(o => o.UsersOption).ThenInclude(u => u.User)
            .AsQueryable();

            var forms = await query.ToListAsync();

            return forms.Select(f => _mapper.Map<GetFormDto>(f)).ToList();
        }

        [HttpPost("createForm")]
        public async Task<ActionResult<GetFormDto>> CreateForm(CreateFormDto createFormDto)
        {
            var userEmail = User.FindFirst("preferred_username")?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user == null) return NotFound("Korisnik nije pronađen");

            if (createFormDto.CourseId > 0)
            {
                var course = await _context.Courses.FindAsync(createFormDto.CourseId);
                if (course == null) return NotFound("Course not found.");
            }

            if (createFormDto.MessageId > 0)
            {
                var message = await _context.Messages.FindAsync(createFormDto.MessageId);
                if (message == null) return NotFound("Message not found.");
            }

            var form = new Form
            {
                Topic = createFormDto.Topic,
                CreationDate = DateTime.UtcNow,
                EndDate = createFormDto.EndDate,
                MultipleAnswer = createFormDto.MultipleAnswer,
                UserId = user.Id,
                CourseId = createFormDto.CourseId > 0 ? createFormDto.CourseId : null,  
                MessageId = createFormDto.MessageId > 0 ? createFormDto.MessageId : null  
            };

            _context.Form.Add(form);
            await _context.SaveChangesAsync();  

            if (createFormDto.Options != null && createFormDto.Options.Count > 0)
            {
                foreach (var optionDto in createFormDto.Options)
                {
                    var option = new Option
                    {
                        Text = optionDto.Text,
                        FormId = form.Id,
                    };

                    _context.Option.Add(option);
                }

                await _context.SaveChangesAsync();  
            }

            var formDto = _mapper.Map<GetFormDto>(form);
            return CreatedAtAction(nameof(GetAllForms), new { id = form.Id }, formDto);
        }
        public class AssignFormRequest
        {
            public int CourseId { get; set; }
        }
        [HttpPut("assignToCourse/{formId}")]
        public async Task<ActionResult<GetFormDto>> AssignFormToCourse(int formId, [FromBody] AssignFormRequest request)
        {
            var form = await _context.Form.Include(f => f.Options).FirstOrDefaultAsync(f => f.Id == formId);
            if (form == null) return NotFound("Anketa nije pronađena");

            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null) return NotFound("Kurs nije pronađen");

            form.CourseId = request.CourseId;
            await _context.SaveChangesAsync();

            return _mapper.Map<GetFormDto>(form);
        }

        public class VoteRequest
        {
            public List<int> OptionIds { get; set; }
        }
        [HttpPut("vote")]
        public async Task<ActionResult<GetFormDto>> Vote([FromBody] VoteRequest request)
        {
            var userEmail = User.FindFirst("preferred_username")?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user == null) return NotFound("Korisnik nije pronađen");
            var userDto = _mapper.Map<UserDto>(user);
            var formId = 0;
            foreach (var id in request.OptionIds)
            {
                var option = await _context.Option.Include(o => o.UsersOption).FirstOrDefaultAsync(o => o.Id == id);
                formId = option!.FormId;

                var userOption = new UserOption
                {
                    UserId = user.Id,
                    OptionId = id,
                    AnswerDate = DateTime.UtcNow
                };
                _context.UserOption.Add(userOption);
                await _context.SaveChangesAsync();

            }

            var form = await _context.Form.Include(u => u.User).Include(f => f.Options).ThenInclude(o => o.UsersOption).ThenInclude(u => u.User).FirstOrDefaultAsync(f => f.Id == formId);
            if (form == null) return NotFound("Anketa nije pronađena");

            var formCreator = await _context.Users.Include(f => f.FcmTokens).FirstOrDefaultAsync(u => u.Id == form.User.Id);

            var tokens = formCreator.FcmTokens.Select(t => t.Token).ToList();

            if (user.Id != formCreator.Id)
                await _firebaseService.SendNotificationAsync(tokens, "Poruka", "Imate novo glasanje na anketi " + form.Topic);

            return _mapper.Map<GetFormDto>(form);

        }
        [HttpGet("getOptionById/{id}")]
        public async Task<ActionResult<GetOptionDto>> GetOption(int id)
        {
            var option = await _context.Option.Include(o => o.UsersOption).ThenInclude(u => u.User)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (option == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<GetOptionDto>(option));
        }

        public class AssignMessageFormRequest
        {
            public int MessageId { get; set; }
        }
        [HttpPut("assignToMessage/{formId}")]
        public async Task<ActionResult<GetFormDto>> AssignFormToMessage(int formId, [FromBody] AssignMessageFormRequest request)
        {
            var form = await _context.Form.Include(f => f.Options).FirstOrDefaultAsync(f => f.Id == formId);
            if (form == null) return NotFound("Anketa nije pronađena");

            var message = await _context.Messages.FindAsync(request.MessageId);
            if (message == null) return NotFound("Poruka nije pronađena");

            form.MessageId = request.MessageId;
            await _context.SaveChangesAsync();

            return _mapper.Map<GetFormDto>(form);
        }

        [HttpGet("getMessageForms/{themeId}")]
        public async Task<ActionResult<List<GetFormDto>>> GetMessageForms(int themeId)
        {
            var query = _context.Form
                .Include(u => u.User)
                .Include(m => m.Message).ThenInclude(t => t.Theme)
                .Include(o => o.Options).ThenInclude(o => o.UsersOption).ThenInclude(u => u.User)
                .Where(u => u.Message.Theme.Id == themeId)  // Filtriranje preko themeId
                .AsQueryable();

            var forms = await query.ToListAsync();

            return forms.Select(f => _mapper.Map<GetFormDto>(f)).ToList();
        }

        [Authorize]
        [HttpDelete("DeleteForm/{id}")]
        public async Task<IActionResult> DeleteForm(int id)
        {
            var form = await _context.Form.FirstOrDefaultAsync(m => m.Id == id);

            if (form == null)
            {
                return NotFound(new { Message = "Anketa nije pronađena." });
            }
            _context.Form.Remove(form);
            await _context.SaveChangesAsync();

            var response = new
            {
                Method = "DeleteForm",
                Status = "Success",
                Message = "Anketa obrisana.",
                Id = id
            };

            return Ok(response); 
        }

    }
}