using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
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

        public FormController(StoreContext context, IMapper mapper, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
            _roleManager = roleManager;
        }

        [HttpGet("getAllForms")]
        public async Task<ActionResult<List<GetFormDto>>> GetAllForms()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var query = _context.Form
            .Where(u => u.User.Email == user.Email)
            .Include(u => u.User)
            .Include(c => c.Course)
            .Include(m => m.Message).ThenInclude(t => t.Theme)
            .Include(o => o.Options).ThenInclude(o=>o.UsersOption)


            .AsQueryable();


            var forms = await query.ToListAsync();

            return forms.Select(f => _mapper.Map<GetFormDto>(f)).ToList();
        }

        [HttpGet("getCourseForms/{id}")]
        public async Task<ActionResult<List<GetFormDto>>> GetCourseForms(int id)
        {

            var query = _context.Form
            .Where(u => u.CourseId==id)
            .Include(u => u.User)
            .Include(c => c.Course)
            .Include(m => m.Message).ThenInclude(t => t.Theme)
            .Include(o => o.Options).ThenInclude(o=>o.UsersOption).ThenInclude(u=>u.User)


            .AsQueryable();


            var forms = await query.ToListAsync();

            return forms.Select(f => _mapper.Map<GetFormDto>(f)).ToList();
        }

        [HttpPost("createForm")]
        public async Task<ActionResult<GetFormDto>> CreateForm(CreateFormDto createFormDto)
        {
            // Validacija
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null) return NotFound("Korisnik nije pronađen");

            // Proveravamo samo ako su polja CourseId i MessageId prosleđena
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

            // Kreiranje ankete
            var form = new Form
            {
                Topic = createFormDto.Topic,
                CreationDate = DateTime.UtcNow,
                EndDate = createFormDto.EndDate,
                MultipleAnswer = createFormDto.MultipleAnswer,
                UserId = user.Id,
                CourseId = createFormDto.CourseId > 0 ? createFormDto.CourseId : null,  // Opciono
                MessageId = createFormDto.MessageId > 0 ? createFormDto.MessageId : null  // Opciono
            };

            _context.Form.Add(form);
            await _context.SaveChangesAsync();  // Sačuvaj samo anketa

            // Kreiranje opcija
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

                await _context.SaveChangesAsync();  // Sačuvaj sve opcije odjednom
            }

            // Mapiranje i vraćanje rezultata
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
            var form = await _context.Form.Include(f=>f.Options).FirstOrDefaultAsync(f=>f.Id==formId);
            if (form == null) return NotFound("Anketa nije pronađena");
        
            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null) return NotFound("Kurs nije pronađen");
        
            form.CourseId = request.CourseId;
            await _context.SaveChangesAsync();
        
            return _mapper.Map<GetFormDto>(form);

        }

        public class VoteRequest
        {
            public List<int> OptionIds {get;set;}
        }
        [HttpPut("vote")]
        public async Task<ActionResult<GetFormDto>> Vote ([FromBody] VoteRequest request)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null) return NotFound("Korisnik nije pronađen");
            var userDto=_mapper.Map<UserDto>(user);
            var formId=0;
            foreach(var id in request.OptionIds)
            {
                var option=await _context.Option.Include(o=>o.UsersOption).FirstOrDefaultAsync(o=>o.Id==id);
                formId=option!.FormId;
                // var createUserOptionDto=new CreateUserOptionDto{
                //     User=userDto,
                //     OptionId=id,
                //     AnswerDate=DateTime.UtcNow
                // };
                 var userOption=new UserOption{
                    UserId=user.Id,
                    // User=user,
                    OptionId=id,
                    AnswerDate=DateTime.UtcNow
                };
                // var userOption=_mapper.Map<UserOption>(createUserOptionDto);
                _context.UserOption.Add(userOption);
                await _context.SaveChangesAsync();
            }

            var form = await _context.Form.Include(f=>f.Options).ThenInclude(o=>o.UsersOption).ThenInclude(u=>u.User).FirstOrDefaultAsync(f=>f.Id==formId);
            if (form == null) return NotFound("Anketa nije pronađena");
        
            // var course = await _context.Courses.FindAsync(request.CourseId);
            // if (course == null) return NotFound("Kurs nije pronađen");
        
            // form.CourseId = request.CourseId;
            // await _context.SaveChangesAsync();
        
            return _mapper.Map<GetFormDto>(form);

        }
        [HttpGet("getOptionById/{id}")]
        public async Task<ActionResult<GetOptionDto>> GetOption(int id)
        {
            

            // Učitavanje kursa sa svim potrebnim podacima
            var option = await _context.Option.Include(o=>o.UsersOption).ThenInclude(u=>u.User)
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
            var form = await _context.Form.Include(f=>f.Options).FirstOrDefaultAsync(f=>f.Id==formId);
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
            var form = await _context.Form.FirstOrDefaultAsync(m=>m.Id==id);

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

            return Ok(response); // Vraćamo JSON sa ID-jem i porukom
        }

    }
}