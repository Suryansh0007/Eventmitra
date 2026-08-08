using EventMitra.NotificationService.Data;
using EventMitra.NotificationService.DTOs;
using EventMitra.NotificationService.Interfaces;
using EventMitra.NotificationService.Models;
using Microsoft.EntityFrameworkCore;

namespace EventMitra.NotificationService.Services;

public class OtpService : IOtpService
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;

    public OtpService(AppDbContext context,
                      IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<string> SendOtpAsync(SendOtpRequest request)
    {
        // Generate 6 digit OTP
        var otpCode = new Random().Next(100000, 999999).ToString();

        // Delete previous OTP for same email
        var oldOtp = await _context.Otps
            .FirstOrDefaultAsync(x => x.Email == request.Email);

        if (oldOtp != null)
        {
            _context.Otps.Remove(oldOtp);
        }

        var otp = new Otp
        {
            Email = request.Email,
            Code = otpCode,
            ExpiryTime = DateTime.UtcNow.AddMinutes(5),
            Verified = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.Otps.Add(otp);
        await _context.SaveChangesAsync();

        var emailRequest = new EmailRequest
        {
            ToEmail = request.Email,
            Subject = "EventMitra OTP Verification",

            Body = $@"
            <h2>EventMitra OTP Verification</h2>

            <p>Your OTP is:</p>

            <h1 style='color:blue'>{otpCode}</h1>

            <p>This OTP is valid for 5 minutes.</p>

            <br/>

            <p>Please do not share this OTP with anyone.</p>
            "
        };

        await _emailService.SendEmailAsync(emailRequest);

        return "OTP sent successfully.";
    }

    public async Task<bool> VerifyOtpAsync(VerifyOtpRequest request)
    {
        var otp = await _context.Otps.FirstOrDefaultAsync(x =>
            x.Email == request.Email &&
            x.Code == request.Otp);

        if (otp == null)
            return false;

        if (otp.ExpiryTime < DateTime.UtcNow)
            return false;

        otp.Verified = true;

        await _context.SaveChangesAsync();

        return true;
    }
}