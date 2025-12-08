using DemoDockerApp.Models;
using DemoDockerApp.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------
// SQL Server (Identity + relational data)
// ---------------------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\mssqllocaldb;Database=DockerDemoDb;Trusted_Connection=True;MultipleActiveResultSets=true";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireUppercase = false;
    options.SignIn.RequireConfirmedAccount = false; // for dev
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders()
.AddDefaultUI();

// Cookie settings for API auth
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.LoginPath = "/Identity/Account/Login";
    options.AccessDeniedPath = "/Identity/Account/AccessDenied";
});

// ---------------------------
// MongoDB (Products, Profile metadata)
// ---------------------------
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
var mongoSettings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
var mongoClient = new MongoClient(mongoSettings.ConnectionString);
var mongoDatabase = mongoClient.GetDatabase(mongoSettings.DatabaseName);

builder.Services.AddSingleton(mongoClient);
builder.Services.AddSingleton(mongoDatabase);

// ---------------------------
// CORS
// ---------------------------
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ---------------------------
// Controllers + Razor Pages
// ---------------------------
builder.Services.AddControllers();
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// ---------------------------
// Build App
// ---------------------------
var app = builder.Build();

// ---------------------------
// DB Migrate & Seed SQL Server
// ---------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var db = services.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.Migrate();
        await SeedData.SeedRolesAndAdminAsync(services);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Migration/seeding failed: {ex.Message}");
    }
}

// ---------------------------
// Middleware
// ---------------------------
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// app.UseHttpsRedirection(); // optional
app.UseStaticFiles();
app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

// ---------------------------
// Endpoints
// ---------------------------
app.MapControllers();
app.MapRazorPages();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
