import { Router, type Request, type Response, type IRouter } from 'express';
import { randomUUID } from 'crypto';

const router: IRouter = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/quotes/request - Request a quote for an ad slot
router.post('/request', (req: Request, res: Response) => {
  const { email, companyName, message, adSlotId, phone, budget, timeline } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ error: 'A valid email address is required' });
    return;
  }

  if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
    res.status(400).json({ error: 'Company name is required' });
    return;
  }

  if (!adSlotId || typeof adSlotId !== 'string') {
    res.status(400).json({ error: 'Ad slot ID is required' });
    return;
  }

  const quoteId = randomUUID();

  console.log(`Quote request ${quoteId}:`, {
    email: email.trim(),
    companyName: companyName.trim(),
    adSlotId,
    phone: phone || null,
    budget: budget || null,
    timeline: timeline || null,
    message: message || null,
  });

  res.status(201).json({
    success: true,
    quoteId,
    message: "Your quote request has been submitted. We'll be in touch within 24 hours.",
  });
});

export default router;
