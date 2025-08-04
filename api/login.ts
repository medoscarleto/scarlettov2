
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { password } = req.body;
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    // This is a server configuration error, so it should not be shown to the user.
    console.error("CRITICAL: APP_PASSWORD environment variable is not set.");
    return res.status(500).json({ success: false, message: 'Server configuration error. Please contact the administrator.' });
  }

  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ success: false, message: 'Password cannot be empty.' });
  }

  if (password === appPassword) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'The password you entered is incorrect.' });
  }
}
