using EventMitra.NotificationService.DTOs;
using EventMitra.NotificationService.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EventMitra.NotificationService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly IOtpService _otpService;
    private readonly IAuditService _auditService;

    public NotificationController(
        IEmailService emailService,
        IOtpService otpService,
        IAuditService auditService)
    {
        _emailService = emailService;
        _otpService = otpService;
        _auditService = auditService;
    }

    // Send Email
    [HttpPost("send-email")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        await _emailService.SendEmailAsync(request);

        return Ok(new
        {
            message = "Email sent successfully."
        });
    }

    // Send OTP
    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
    {
        var result = await _otpService.SendOtpAsync(request);

        return Ok(new
        {
            message = result
        });
    }

    // Verify OTP
    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        var verified = await _otpService.VerifyOtpAsync(request);

        if (!verified)
        {
            return BadRequest(new
            {
                message = "Invalid or expired OTP."
            });
        }

        return Ok(new
        {
            message = "OTP verified successfully."
        });
    }

    // Audit Log
    [HttpPost("audit-log")]
    public async Task<IActionResult> AuditLog([FromBody] AuditLogRequest request)
    {
        await _auditService.LogAsync(request);

        return Ok(new
        {
            message = "Audit log saved successfully."
        });
    }
}