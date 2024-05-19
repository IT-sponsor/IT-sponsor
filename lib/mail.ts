import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email: string, userId: string, hash: string, timestamp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.BASE_URL}/reset-password?userId=${userId}&timestamp=${timestamp}&hash=${hash}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Slaptažodžio atstatymas',
    html: `<p>Norint iš naujo nustatyti slaptažodį, spustelėkite <a href="${resetUrl}">nustatyti.</a> Jei to nenorite, nekreipkite dėmesio į šį el. laišką.</p>`,
  });
};