var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddHttpClient("AgentService", client => {
    client.BaseAddress = new Uri("http://localhost:3001/");
});

// Register ClickHouse analytics service
builder.Services.AddScoped<backend.Services.IMovieAnalyticsService, backend.Infrastructure.ClickHouse.ClickHouseAnalyticsService>();

var app = builder.Build();

app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
