import { createTransport } from "nodemailer";
import env from "../env";

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port:  587,
    auth: {
        user: env.SMTP_MAIL,
        pass: env.SMTP_PASSWORD
    },
});

export async function sendVerificationEmail(name: string, toEmail: string, verificationCode: string){
    await transporter.sendMail({
        from: "noreply@todolist.com",
        to: toEmail,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <p>Hello ${name}, please confirm your email by clicking on the following link</p>
        <div><a href=http://localhost:3000/accountVerification/${verificationCode}>Click here</a></div>`
    });
}

export async function sendPasswordResetCode(toEmail: string, verificationCode: string){
    await transporter.sendMail({
        from: "noreply@todolist.com",
        to: toEmail,
        subject: "Reset your password",
        html: `<p>A password reset request as been sent for this account. 
        Use this verification code to reset your password.
        It will expire in 10 minutes.
        </p><strong>${verificationCode}</strong>
        If you didn't request a password reset, ingore this email.`
    });
}