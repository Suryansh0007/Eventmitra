using EventMitra.NotificationService.Data;
using EventMitra.NotificationService.DTOs;
using EventMitra.NotificationService.Interfaces;
using EventMitra.NotificationService.Models;

namespace EventMitra.NotificationService.Services;

public class AuditService : IAuditService
{
    private readonly AppDbContext _context;

    public AuditService(AppDbContext context)
    {
        _context = context;
    }

    public async Task LogAsync(AuditLogRequest request)
    {
        var log = new AuditLog
        {
            Action = request.Action,
            Username = request.Username,
            Details = request.Details,
            CreatedAt = DateTime.UtcNow
        };

        _context.AuditLogs.Add(log);

        await _context.SaveChangesAsync();
    }
}