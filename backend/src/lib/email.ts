import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Don't know why if I export resend.emails.send, it doesn't work.
// So I exported the resend object instead.
export default resend;
