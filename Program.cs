using DemoApp.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? throw new InvalidOperationException("Connection string missing.");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Read allowed frontend origin from config (App Settings in Azure)
var frontendUrl = builder.Configuration["FRONTEND_URL"] 
                  ?? "https://demoappfrontend.azurewebsites.net";

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApp", policy =>
    {
        policy.WithOrigins(frontendUrl, "https://demoappfrontend.azurewebsites.net", "http://localhost:5173", "http://localhost:3000", "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable Swagger (always on for demo)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DemoApp v1");
    c.RoutePrefix = "swagger";
});

// Apply database migrations on startup with retry logic
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var db = services.GetRequiredService<AppDbContext>();
    var retries = 12;

    while (retries > 0)
    {
        try
        {
            db.Database.Migrate();
            logger.LogInformation("✅ Database migrated successfully.");
            break;
        }
        catch (Exception ex)
        {
            retries--;
            logger.LogWarning(ex, "⚠️ Database not ready yet. Retries left: {retries}", retries);
            if (retries <= 0) throw;
            Thread.Sleep(5000);
        }
    }
}

// HTTPS redirection (enabled in all environments per your setup)
app.UseHttpsRedirection();

// ✅ CORS must be before authorization and endpoints
app.UseCors("AllowFrontendApp");

app.UseAuthorization();
app.MapControllers();

app.Run();