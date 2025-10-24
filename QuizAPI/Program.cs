using QuizAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<QuizDbContext>(options =>
options.UseSqlServer
 (builder.Configuration.GetConnectionString("Lidhja")//Lidhja e jeme me database
 ?? throw new InvalidOperationException("Connection string 'REDACTED_PROJECT_NAMEContext' not found.")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:5173")//Lidhje me React
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});



var app = builder.Build();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider=new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath,"Images")),
    RequestPath= "/Images"
});
    
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowReactApp");

app.Run();
