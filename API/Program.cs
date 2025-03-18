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
using Microsoft.AspNetCore.Authentication.Cookies;

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
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowLocalhost",
//         policy => policy.WithOrigins("http://localhost:5173")
//             .AllowAnyMethod()
//             .AllowAnyHeader());
// });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy => policy
            .WithOrigins("http://localhost:5173")  // Frontend domena
            .AllowAnyMethod()                      // Dozvoljava sve HTTP metode
            .AllowAnyHeader()                      // Dozvoljava sve zaglavlja
            .AllowCredentials());                  // Dozvoljava autentifikaciju
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
    // Default scheme that handles everything if no other scheme is specified.
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // Default scheme for challenges.
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie() // Add cookie middleware to handle sessions.
.AddOpenIdConnect(options => // OpenID Connect middleware
{
    //  options.Authority = $"{builder.Configuration["AzureAd:Instance"]}{builder.Configuration["AzureAd:TenantId"]}/v2.0";  // Pravilno formirajte Authority URL
    options.Authority="https://login.microsoftonline.com/05a9f20c-f437-4a35-8448-3827e15dd882/v2.0";
    options.ClientId = builder.Configuration["AzureAd:ClientId"];
    options.ClientSecret = builder.Configuration["AzureAd:ClientSecret"];
    options.ResponseType = "code id_token";
    options.CallbackPath = new PathString(builder.Configuration["AzureAd:CallbackPath"]);
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("email");

    options.SaveTokens = true;
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => // JWT bearer middleware
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
    };
});


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
app.UseCors("AllowLocalhost");
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
app.MapGet("/signout-oidc", async context =>
{
    var redirectUri = "http://localhost:5173"; // URL na koji se korisnik vraća nakon odjave
    await context.SignOutAsync(OpenIdConnectDefaults.AuthenticationScheme, new AuthenticationProperties
    {
        RedirectUri = redirectUri
    });
});


app.UseStaticFiles();
app.MapControllers();

app.Run();
