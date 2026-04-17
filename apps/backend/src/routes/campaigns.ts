import { Router, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { authMiddleware, type AuthRequest } from '../auth.js';

const router: IRouter = Router();

// All campaign routes require authentication
router.use(authMiddleware as never);

// GET /api/campaigns - List campaigns scoped to authenticated sponsor
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    // Sponsors only see their own campaigns
    const campaigns = await prisma.campaign.findMany({
      where: {
        ...(status && {
          status: status as 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DRAFT',
        }),
        ...(req.user?.sponsorId && { sponsorId: req.user.sponsorId }),
      },
      include: {
        sponsor: { select: { id: true, name: true, logo: true } },
        _count: { select: { creatives: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// GET /api/campaigns/:id - Get single campaign with ownership check
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        sponsor: { userId: req.user!.id },
      },
      include: {
        sponsor: true,
        creatives: true,
        placements: {
          include: {
            adSlot: true,
            publisher: { select: { id: true, name: true, category: true } },
          },
        },
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// POST /api/campaigns - Create new campaign for authenticated sponsor
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.sponsorId) {
      res.status(403).json({ error: 'Only sponsors can create campaigns' });
      return;
    }

    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
    } = req.body;

    if (!name || !budget || !startDate || !endDate) {
      res.status(400).json({
        error: 'Name, budget, startDate, and endDate are required',
      });
      return;
    }

    if (Number(budget) <= 0) {
      res.status(400).json({ error: 'Budget must be a positive number' });
      return;
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        sponsorId: req.user.sponsorId,
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// PUT /api/campaigns/:id - Update campaign with ownership check
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Check ownership
    const existing = await prisma.campaign.findFirst({
      where: { id, sponsor: { userId: req.user!.id } },
    });

    if (!existing) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      status,
      targetCategories,
      targetRegions,
    } = req.body;

    if (budget !== undefined && Number(budget) <= 0) {
      res.status(400).json({ error: 'Budget must be a positive number' });
      return;
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(budget !== undefined && { budget }),
        ...(cpmRate !== undefined && { cpmRate }),
        ...(cpcRate !== undefined && { cpcRate }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(status !== undefined && { status }),
        ...(targetCategories !== undefined && { targetCategories }),
        ...(targetRegions !== undefined && { targetRegions }),
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// DELETE /api/campaigns/:id - Delete campaign with ownership check
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    // Check ownership
    const existing = await prisma.campaign.findFirst({
      where: { id, sponsor: { userId: req.user!.id } },
    });

    if (!existing) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    await prisma.campaign.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export default router;
