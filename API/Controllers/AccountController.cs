using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseAPIController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
        }

            
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value ?? User.FindFirst("email")?.Value;
            var accessToken = await HttpContext.GetTokenAsync("access_token");


            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Nema email claim-a, korisnik nije prijavljen.");
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            var roleId = await _context.UserRoles
            .Where(ur => ur.UserId == user.Id)
            .Select(ur => ur.RoleId)
            .FirstOrDefaultAsync();

            var role = await _context.Roles.FindAsync(roleId);        

            return new UserDto
            {
                Email = user.Email,
                Username = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id,
                Role = role.Name, 
                Token = accessToken 
            };
        }

        [HttpPost("updateUser")]
        public async Task<ActionResult<UserDto>> UpdateUser([FromBody] UpdateUserDto userData)
        {
            if (userData.FirstName == null || userData.LastName == null)
            {
                return BadRequest("Invalid data.");
            }

            var userEmail = User.FindFirst("preferred_username")?.Value;
            var user = await _userManager.FindByEmailAsync(userEmail);
            user!.FirstName = userData.FirstName;
            user.LastName = userData.LastName;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest("Greška prilikom ažuriranja korisničkih podataka.");
            }

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Username = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id,

            };
        }

        [HttpDelete("deleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to delete user", errors = result.Errors });
            }

            return Ok(new { message = "User deleted successfully" });
        }

    
        [HttpGet("login")]
        public IActionResult Login()
        {

            return Challenge(new AuthenticationProperties {RedirectUri = "http://localhost:5000/api/account/registerUser"},     OpenIdConnectDefaults.AuthenticationScheme);
        }
  

        [Authorize]
        [HttpGet("registerUser")]
        public async Task<IActionResult> RegisterUser()
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var userEmail = User.FindFirst("preferred_username")?.Value;
            var accessToken = await HttpContext.GetTokenAsync("access_token");

            if (userEmail == null)
            {
                return BadRequest(new { title = "Email korisnika nije pronađen." });
            }
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(accessToken);

            var familyName = jwtToken.Claims.FirstOrDefault(c => c.Type == "family_name")?.Value;
            var givenName = jwtToken.Claims.FirstOrDefault(c => c.Type == "given_name")?.Value;

            bool isStudent = userEmail.EndsWith("@student.etf.ues.rs.ba");

            var existingUser = await _userManager.FindByEmailAsync(userEmail);
            
            if (existingUser != null)
            {
             
                var redirectUrl = $"http://localhost:5173/";
                return Redirect(redirectUrl);
            }

            var user = new User
            {
                UserName = userEmail.Split('@')[0],
                Email = userEmail,
                FirstName=givenName,
                LastName=familyName
            };

            var result = await _userManager.CreateAsync(user, "DefaultPassword123!");

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _userManager.AddToRoleAsync(user, !isStudent ? "Student" : "Profesor");

            
            var redirectNewUserUrl = "http://localhost:5173/";
            return Redirect(redirectNewUserUrl);
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme);

            foreach (var cookie in Request.Cookies.Keys)
            {
                Response.Cookies.Delete(cookie);
            }

            var redirectUri = "http://localhost:5173"; 
            var openIdLogoutUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/logout";
            var logoutUrl = $"{openIdLogoutUrl}?post_logout_redirect_uri={Uri.EscapeDataString(redirectUri)}";
            
            return Redirect(logoutUrl);
        }

    }
}