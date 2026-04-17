import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { authMiddleware, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// GET /api/ad-slots - List available ad slots (public for marketplace)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { publisherId, type, available } = req.query;

    const adSlots = await prisma.adSlot.findMany({
      where: {
        ...(publisherId && { publisherId: getParam(publisherId) }),
        ...(type && {
          type: type as string as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST',
        }),
        ...(available === 'true' && { isAvailable: true }),
      },
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
    });

    res.json(adSlots);
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
});

// GET /api/ad-slots/:id - Get single ad slot with details (public for marketplace)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Don't match routes like "/:id/book" or "/:id/unbook"
    if (id === 'book' || id === 'unbook') {
      res.status(400).json({ error: 'Invalid ad slot ID' });
      return;
    }

    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: {
        publisher: true,
        placements: {
          include: {
            campaign: { select: { id: true, name: true, status: true } },
          },
        },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
});

// POST /api/ad-slots - Create new ad slot (authenticated publishers only)
router.post('/', authMiddleware as never, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.publisherId) {
      res.status(403).json({ error: 'Only publishers can create ad slots' });
      return;
    }

    const { name, description, type, position, width, height, basePrice, cpmFloor } = req.body;

    if (!name || !type || !basePrice) {
      res.status(400).json({
        error: 'Name, type, and basePrice are required',
      });
      return;
    }

    const validTypes = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
      return;
    }

    if (Number(basePrice) <= 0) {
      res.status(400).json({ error: 'basePrice must be a positive number' });
      return;
    }

    const adSlot = await prisma.adSlot.create({
      data: {
        name,
        description,
        type,
        position,
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
        basePrice,
        cpmFloor,
        publisherId: req.user.publisherId,
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(adSlot);
  } catch (error) {
    console.error('Error creating ad slot:', error);
    res.status(500).json({ error: 'Failed to create ad slot' });
  }
});

// PUT /api/ad-slots/:id - Update ad slot with ownership check
router.put('/:id', authMiddleware as never, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Check ownership
    const existing = await prisma.adSlot.findFirst({
      where: { id, publisher: { userId: req.user!.id } },
    });

    if (!existing) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    const { name, description, type, position, width, height, basePrice, cpmFloor, isAvailable } =
      req.body;

    if (type) {
      const validTypes = ['DISPLAY', 'VIDEO', 'NATIVE', 'NEWSLETTER', 'PODCAST'];
      if (!validTypes.includes(type)) {
        res.status(400).json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
        return;
      }
    }

    if (basePrice !== undefined && Number(basePrice) <= 0) {
      res.status(400).json({ error: 'basePrice must be a positive number' });
      return;
    }

    const adSlot = await prisma.adSlot.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(position !== undefined && { position }),
        ...(width !== undefined && { width: Number(width) }),
        ...(height !== undefined && { height: Number(height) }),
        ...(basePrice !== undefined && { basePrice }),
        ...(cpmFloor !== undefined && { cpmFloor }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json(adSlot);
  } catch (error) {
    console.error('Error updating ad slot:', error);
    res.status(500).json({ error: 'Failed to update ad slot' });
  }
});

// DELETE /api/ad-slots/:id - Delete ad slot with ownership check
router.delete('/:id', authMiddleware as never, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Check ownership
    const existing = await prisma.adSlot.findFirst({
      where: { id, publisher: { userId: req.user!.id } },
    });

    if (!existing) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    await prisma.adSlot.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ad slot:', error);
    res.status(500).json({ error: 'Failed to delete ad slot' });
  }
});

// POST /api/ad-slots/:id/book - Book an ad slot (simplified booking flow)
router.post('/:id/book', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { sponsorId, message } = req.body;

    if (!sponsorId) {
      res.status(400).json({ error: 'sponsorId is required' });
      return;
    }

    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (!adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is no longer available' });
      return;
    }

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: false },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    console.log(`Ad slot ${id} booked by sponsor ${sponsorId}. Message: ${message || 'None'}`);

    res.json({
      success: true,
      message: 'Ad slot booked successfully!',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error booking ad slot:', error);
    res.status(500).json({ error: 'Failed to book ad slot' });
  }
});

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (for testing)
router.post('/:id/unbook', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: true },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error unbooking ad slot:', error);
    res.status(500).json({ error: 'Failed to unbook ad slot' });
  }
});

export default router;
