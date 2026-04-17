import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';

const router: IRouter = Router();

// NOTE: Authentication is handled by Better Auth on the frontend
// This route is kept for any backend-specific auth utilities

// POST /api/auth/login - Placeholder (Better Auth handles login via frontend)
router.post('/login', async (_req: Request, res: Response) => {
  res.status(400).json({
    error: 'Use the frontend login at /login instead',
    hint: 'Better Auth handles authentication via the Next.js frontend',
  });
});

// GET /api/auth/me - Get current user (for API clients)
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Extract session token from cookie header
    const cookieHeader = req.headers.cookie || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [key, ...rest] = c.trim().split('=');
        return [key, rest.join('=')];
      })
    );

    const sessionToken =
      cookies['better-auth.session_token'] || cookies['better-auth-session-token'];

    if (!sessionToken) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const token = sessionToken.split('.')[0];

    // Look up session in database
    const session = await prisma.$queryRaw<
      Array<{ id: string; userId: string; expiresAt: Date; token: string }>
    >`SELECT id, "userId", "expiresAt", token FROM "session" WHERE token = ${token} AND "expiresAt" > NOW() LIMIT 1`;

    if (!session || session.length === 0) {
      res.status(401).json({ error: 'Invalid or expired session' });
      return;
    }

    const userId = session[0].userId;

    // Look up user
    const users = await prisma.$queryRaw<Array<{ id: string; email: string; name: string }>>`
      SELECT id, email, name FROM "user" WHERE id = ${userId} LIMIT 1
    `;

    if (!users || users.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = users[0];

    // Determine role
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId },
      select: { id: true, name: true },
    });

    const publisher = await prisma.publisher.findUnique({
      where: { userId },
      select: { id: true, name: true },
    });

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: sponsor ? 'sponsor' : publisher ? 'publisher' : null,
      ...(sponsor && { sponsorId: sponsor.id, sponsorName: sponsor.name }),
      ...(publisher && { publisherId: publisher.id, publisherName: publisher.name }),
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// GET /api/auth/role/:userId - Get user role based on Sponsor/Publisher records
router.get('/role/:userId', async (req: Request, res: Response) => {
  try {
    const userId = getParam(req.params.userId);

    // Check if user is a sponsor
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId },
      select: { id: true, name: true },
    });

    if (sponsor) {
      res.json({ role: 'sponsor', sponsorId: sponsor.id, name: sponsor.name });
      return;
    }

    // Check if user is a publisher
    const publisher = await prisma.publisher.findUnique({
      where: { userId },
      select: { id: true, name: true },
    });

    if (publisher) {
      res.json({ role: 'publisher', publisherId: publisher.id, name: publisher.name });
      return;
    }

    // User has no role assigned
    res.json({ role: null });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Failed to fetch user role' });
  }
});

export default router;
