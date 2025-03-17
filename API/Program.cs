global using AutoMapper;
using System.Text;
using API.Data;
using API.Entities;
using API.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Bearer + your token",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy => policy.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddCors();
builder.Services.AddIdentityCore<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>();

// Authentication - JWT + OpenID Connect
// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
// });

// // Dodaj Microsoft Identity Web App autentifikaciju
// builder.Services.AddAuthentication().AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));

// // Dodaj JWT autentifikaciju
// builder.Services.AddAuthentication()
//     .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opt =>
//     {
//         opt.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = false,
//             ValidateAudience = false,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,
//             IssuerSigningKey = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"])
//             )
//         };
//     });

// Authentication - Consolidate configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"])
        )
    };
})
.AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));


builder.Services.AddAuthorization();

// Custom services
builder.Services.AddScoped<TokenService>();

// Firebase initialization
if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions()
    {
        Credential = GoogleCredential.FromFile("./Firebase/eduetf-95ea5-080189fe0d38.json"),
    });
}
builder.Services.AddSingleton<FirebaseService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:5173");
});

app.UseAuthentication();
app.UseAuthorization();


// Routes for login and profile
app.MapGet("/login", async (HttpContext context) =>
{
    await context.ChallengeAsync(OpenIdConnectDefaults.AuthenticationScheme, new AuthenticationProperties
    {
        RedirectUri = "/profile" // Redirect after successful login
    });
});

app.MapGet("/profile", (HttpContext context) =>
{
    if (context.User.Identity?.IsAuthenticated == true)
    {
        var user = new
        {
            Name = context.User.Identity.Name,
            Email = context.User.Claims.FirstOrDefault(c => c.Type == "email")?.Value
        };
        return Results.Json(user); // Return user profile info
    }
    return Results.Unauthorized(); // If not authenticated
});

app.UseStaticFiles();
app.MapControllers();

app.Run();
