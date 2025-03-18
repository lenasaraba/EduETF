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
    public class FirebaseController : BaseAPIController
    {
        private readonly StoreContext _context;


        public FirebaseController(StoreContext context)
        {
            _context = context;
        }

        [HttpPost("addToken")]
        public async Task<IActionResult> AddFirebaseTokenToOwner([FromBody] AddFirebaseTokenDto newToken)
        {
            var user = await _context.Users
                .Include(u => u.FcmTokens)
                .FirstOrDefaultAsync(u => u.Id == newToken.UserId);

            if (user is null)
            {
                return NotFound("Nije pronađen korisnik.");
            }

            var existingToken = await _context.FcmTokens
                .FirstOrDefaultAsync(t => t.Token == newToken.Token && t.UserId == newToken.UserId);

            if (existingToken != null)
            {
                return Ok("Token već postoji.");
            }

            var firebaseToken = new FcmToken
            {
                Token = newToken.Token,
                UserId = newToken.UserId,
                User = user,
            };

            _context.FcmTokens.Add(firebaseToken);
            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
            {
                return BadRequest("Greška prilikom dodavanja Firebase tokena za korisnika.");
            }

            return Ok(newToken.Token);
        }
    }
}