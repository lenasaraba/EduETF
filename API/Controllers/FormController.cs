using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
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
            .Include(o => o.Options)


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
            .Include(o => o.Options)


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


    }
}