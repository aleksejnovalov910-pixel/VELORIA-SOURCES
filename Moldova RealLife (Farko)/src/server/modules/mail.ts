import nodemailer from "nodemailer";

export class Mail {
  private static transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // dacă folosești portul 465, setează true
    auth: {
      user: "93902b001@smtp-brevo.com", // SMTP login din Brevo
      pass: "VYSkKnZvIL7j6m4A", // Master password
    },
  });

  static sendMail(fromName: string, to: string, subject: string, text: string) {
    try {
      this.transporter.sendMail({
        from: `"${fromName}" <no-reply@stage-rp.ro>`, // Afișează numele + adresa verificată
        to,
        subject,
        text,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }
}
