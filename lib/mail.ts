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

export const sendFaultNotifEmail = async (email: string[], projectId: number, faultId: number, projectName: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const faultUrl = `${process.env.BASE_URL}/project/${projectId}/fault/${faultId}`;
  const emails = email.join(', ');
console.log(emails);
console.log(faultUrl);
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emails,
    subject: `Pranešimas apie klaidą projekte`,
    html: `<p>Savanoris sukūrė naują pranešimą apie klaidą projekte "${projectName}". Jį galite peržiūrėti <a href="${faultUrl}">čia</a>.</p>`,
  });
};