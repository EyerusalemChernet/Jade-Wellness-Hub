import { sendEmail, jobApplicationTemplate } from "../utils/emailService.js";

export const createJobApplication = async (req, res, next) => {
  try {
    const { name, email, phone, position, experience, coverLetter } = req.body;
    const resumeFile = req.file;

    if (!name || !email || !phone || !position) {
      return res.status(400).json({ 
        message: "Name, email, phone, and position are required" 
      });
    }

    const applicationData = {
      name,
      email,
      phone,
      position,
      experience: experience || "Not specified",
      coverLetter: coverLetter || "No cover letter provided",
      resumeUrl: resumeFile ? `/uploads/${resumeFile.filename}` : null,
      appliedAt: new Date()
    };

    // Send confirmation email to applicant
    try {
      await sendEmail(
        email,
        "Job Application Received - JadeWellness",
        jobApplicationTemplate(name, position)
      );
    } catch (emailError) {
      console.log("Email sending failed, but application was recorded:", emailError.message);
    }

    // Send notification email to HR (you can add HR email to env)
    try {
      await sendEmail(
        process.env.HR_EMAIL || "hr@jadewellness.com",
        `New Job Application - ${position}`,
        jobApplicationNotificationTemplate(applicationData)
      );
    } catch (emailError) {
      console.log("HR notification email failed:", emailError.message);
    }

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: Date.now() // In a real app, you'd save to database and return the ID
    });
  } catch (error) {
    console.error("Job application error:", error);
    next(error);
  }
};



