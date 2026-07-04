import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendReminderEmail = async (toEmail, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: '📚 Daily Reminder: Time to study on CareerPilot AI!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #3b82f6;">Hello ${name}! 👋</h2>
        <p>This is your daily reminder to continue your placement preparation.</p>
        <p>Consistency is the key to success! Log in to CareerPilot AI to:</p>
        <ul>
          <li>Take a Mock Interview</li>
          <li>Practice MCQ Tests</li>
          <li>Follow your AI Study Plan</li>
        </ul>
        <p>Click <a href="http://localhost:5173" style="color: #3b82f6; text-decoration: none; font-weight: bold;">here</a> to go to your dashboard.</p>
        <br/>
        <p>Best Regards,</p>
        <p><strong>CareerPilot AI Team</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
  }
};

const generateStudyPlanHTML = (planData, name, topic) => {
  if (!planData || !planData.weeks) {
    return `<p>Your study plan is attached to your dashboard.</p>`;
  }

  let html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f97316; padding: 30px 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Hello ${name}! 👋</h2>
        <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 28px;">${planData.topic} Study Plan</h1>
        <p style="color: #fff1f2; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Duration: ${planData.duration}</p>
      </div>
      
      <div style="background-color: #ffffff; padding: 30px 20px;">
        <p style="font-size: 16px; margin-top: 0;">Here is your structured curriculum to master <strong>${topic}</strong>. Stick to the plan and you'll do great!</p>
  `;

  planData.weeks.forEach(week => {
    html += `
        <div style="margin-top: 25px; padding: 20px; border-left: 4px solid #f97316; background-color: #fff7ed; border-radius: 6px;">
          <h3 style="color: #ea580c; margin: 0 0 10px 0; font-size: 18px;">Week ${week.weekNumber}: ${week.title}</h3>
          <p style="margin: 0 0 15px 0; font-size: 14px; color: #4b5563;">${week.description}</p>
          <ul style="padding-left: 20px; margin: 0; color: #374151;">
    `;
    
    if (week.topics && Array.isArray(week.topics)) {
      week.topics.forEach(t => {
        if (t.w3schoolsLink && t.w3schoolsLink.trim() !== "") {
          html += `<li style="margin-bottom: 8px; font-weight: 500;">${t.name} - <a href="${t.w3schoolsLink}" target="_blank" style="color: #2563eb; text-decoration: none;">View Resource</a></li>`;
        } else {
          html += `<li style="margin-bottom: 8px; font-weight: 500;">${t.name}</li>`;
        }
      });
    }
    
    html += `
          </ul>
        </div>
    `;
  });

  html += `
        <div style="margin-top: 35px; text-align: center;">
          <a href="http://localhost:5173/studyplan" style="display: inline-block; background-color: #f97316; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0 20px 0;" />
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">Best Regards,</p>
          <p style="margin: 5px 0 0 0;"><strong>CareerPilot AI Team</strong></p>
        </div>
      </div>
    </div>
  `;
  return html;
};

export const sendStudyPlanEmail = async (toEmail, name, planData, topic) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `🚀 Your AI Study Plan for ${topic} is Ready!`,
    html: generateStudyPlanHTML(planData, name, topic)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Study plan email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send study plan email to ${toEmail}:`, error);
  }
};
