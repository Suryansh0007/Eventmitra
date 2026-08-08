using EventMitra.NotificationService.Models;
using Microsoft.EntityFrameworkCore;
using static System.Net.WebRequestMethods;

namespace EventMitra.NotificationService.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Otp> Otps => Set<Otp>();

    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
}