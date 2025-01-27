import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';

// Configure the SMTP transport (Use your SMTP provider's settings)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // E.g. Gmail: smtp.gmail.com
  port: 587, // Default port for SMTP
  secure: false, // Use TLS (true for port 465, false for 587)
  auth: {
    user: 'developers.learnquest@gmail.com', // Your email address
    pass: 'M@u1@15@',     // Your email password or app password
  },
});

export async function POST({ request }) {
  try {
    const formData = await request.json();

    // Create the email content
    const mailOptions = {
      from: 'no-reply@yourdomain.com', // Sender email address
      to: 'developer@example.com',     // Developer's email address
      subject: 'New Quest Created',
      text: `
        A new quest has been submitted.

        Name: ${formData.name}
        Mode: ${formData.mode}
        Questions:
        ${formData.questions.map(
          (q) => `Q: ${q.question} | A: ${q.answers.join(', ')}`
        ).join('\n')}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return json({ success: true });
  } catch (error) {
    console.error(error);
    return json({ success: false, error: error.message });
  }
}
