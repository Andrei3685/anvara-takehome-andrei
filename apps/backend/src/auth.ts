import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from './db.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'SPONSOR' | 'PUBLISHER';
    sponsorId?: string;
    publisherId?: string;
  };
}

/**
 * Authentication middleware that validates Better Auth session cookies.
 * Extracts the session token from cookies, validates it against the database,
 * looks up the user's role (sponsor or publisher), and attaches user info to the request.
 */
export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
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

    // The token may be in format "token.signature" — use just the token part
    const token = sessionToken.split('.')[0];

    // Look up session in database (Better Auth stores sessions in a "session" table)
    const session = await prisma.$queryRaw<
      Array<{ id: string; userId: string; expiresAt: Date; token: string }>
    >`SELECT id, "userId", "expiresAt", token FROM "session" WHERE token = ${token} AND "expiresAt" > NOW() LIMIT 1`;

    if (!session || session.length === 0) {
      res.status(401).json({ error: 'Invalid or expired session' });
      return;
    }

    const userId = session[0].userId;

    // Look up user from Better Auth "user" table
    const users = await prisma.$queryRaw<Array<{ id: string; email: string; name: string }>>`
      SELECT id, email, name FROM "user" WHERE id = ${userId} LIMIT 1
    `;

    if (!users || users.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = users[0];

    // Determine role by checking sponsor/publisher tables
    const sponsor = await prisma.sponsor.findUnique({
      where: { userId },
      select: { id: true },
    });

    const publisher = await prisma.publisher.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!sponsor && !publisher) {
      res.status(401).json({ error: 'User has no assigned role' });
      return;
    }

    req.user = {
      id: userId,
      email: user.email,
      role: sponsor ? 'SPONSOR' : 'PUBLISHER',
      sponsorId: sponsor?.id,
      publisherId: publisher?.id,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

export function roleMiddleware(allowedRoles: Array<'SPONSOR' | 'PUBLISHER'>) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
