import { Router, type Request, type Response, type IRouter } from 'express';

const router: IRouter = Router();

// Simple email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory set to prevent duplicate subscriptions (demo purposes)
const subscribers = new Set<string>();

// POST /api/newsletter/subscribe - Subscribe to newsletter
router.post('/subscribe', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    res.status(400).json({ error: 'Please enter a valid email address' });
    return;
  }

  if (subscribers.has(trimmedEmail)) {
    res.json({ success: true, message: "You're already subscribed!" });
    return;
  }

  subscribers.add(trimmedEmail);

  res.json({
    success: true,
    message: "Thanks for subscribing! We'll keep you updated.",
  });
});

export default router;
