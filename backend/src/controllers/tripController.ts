// src/controllers/tripController.ts
import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getTrips = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.userId },
      include: {
        stops: {
          select: { id: true }
        }
      },
      orderBy: { startDate: 'asc' }
    });
    return res.status(200).json({ success: true, data: trips });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getTripById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            city: true,
            activities: true
          },
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip itinerary not found.' });
    }

    // Auth verification: must be owner OR trip must be public
    if (trip.userId !== userId && !trip.isPublic) {
      return res.status(403).json({ success: false, message: 'Access denied: private itinerary.' });
    }

    return res.status(200).json({ success: true, data: trip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createTrip = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { name, startDate, endDate, description, coverPhoto, isPublic, budgetLimit } = req.body;

  if (!name || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Name, startDate, and endDate are required fields.' });
  }

  if (new Date(endDate) < new Date(startDate)) {
    return res.status(400).json({ success: false, message: 'End date cannot be before start date.' });
  }

  try {
    const trip = await prisma.trip.create({
      data: {
        userId: req.user.userId,
        name,
        startDate,
        endDate,
        description: description || '',
        coverPhoto: coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        isPublic: isPublic || false,
        budgetLimit: budgetLimit ? parseFloat(String(budgetLimit)) : 1500
      }
    });

    return res.status(201).json({ success: true, message: 'Trip plan created successfully.', data: trip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateTrip = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { id } = req.params;
  const { name, startDate, endDate, description, coverPhoto, isPublic, budgetLimit } = req.body;

  try {
    const trip = await prisma.trip.findUnique({ where: { id } });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    if (trip.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied: ownership required.' });
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date.' });
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: {
        name: name !== undefined ? name : trip.name,
        startDate: startDate !== undefined ? startDate : trip.startDate,
        endDate: endDate !== undefined ? endDate : trip.endDate,
        description: description !== undefined ? description : trip.description,
        coverPhoto: coverPhoto !== undefined ? coverPhoto : trip.coverPhoto,
        isPublic: isPublic !== undefined ? isPublic : trip.isPublic,
        budgetLimit: budgetLimit !== undefined ? parseFloat(String(budgetLimit)) : trip.budgetLimit
      }
    });

    return res.status(200).json({ success: true, message: 'Trip plan updated successfully.', data: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteTrip = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { id } = req.params;

  try {
    const trip = await prisma.trip.findUnique({ where: { id } });

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    if (trip.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied: ownership required.' });
    }

    await prisma.trip.delete({
      where: { id }
    });

    return res.status(200).json({ success: true, message: 'Trip plan deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const cloneTrip = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { id } = req.params;

  try {
    const original = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            activities: true
          }
        }
      }
    });

    if (!original) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    if (!original.isPublic && original.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Cannot clone private itineraries.' });
    }

    // Transaction to clone trip structure
    const cloned = await prisma.$transaction(async (tx) => {
      const tripCopy = await tx.trip.create({
        data: {
          userId: req.user!.userId,
          name: `Copy of ${original.name}`,
          startDate: original.startDate,
          endDate: original.endDate,
          description: original.description,
          coverPhoto: original.coverPhoto,
          isPublic: false,
          budgetLimit: original.budgetLimit
        }
      });

      for (const stop of original.stops) {
        const stopCopy = await tx.stop.create({
          data: {
            tripId: tripCopy.id,
            cityId: stop.cityId,
            arrivalDate: stop.arrivalDate,
            departureDate: stop.departureDate,
            accommodationCost: stop.accommodationCost,
            transportCost: stop.transportCost,
            orderIndex: stop.orderIndex
          }
        });

        for (const act of stop.activities) {
          await tx.stopActivity.create({
            data: {
              stopId: stopCopy.id,
              name: act.name,
              cost: act.cost,
              category: act.category,
              duration: act.duration,
              date: act.date,
              time: act.time
            }
          });
        }
      }

      return tripCopy;
    });

    return res.status(201).json({
      success: true,
      message: 'Itinerary cloned successfully',
      data: cloned
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const saveStops = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { tripId } = req.params;
  const { stops } = req.body; // Array of stop schedules with nested activities

  if (!Array.isArray(stops)) {
    return res.status(400).json({ success: false, message: 'Stops must be a valid array.' });
  }

  try {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    if (trip.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Access denied: ownership required.' });
    }

    // Execute bulk updates inside a single database transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Wipe out existing stops (cascades and deletes activities automatically!)
      await tx.stop.deleteMany({
        where: { tripId }
      });

      // 2. Loop and re-insert new stops along with nested scheduled activities
      const createdStops = [];
      for (const s of stops) {
        const createdStop = await tx.stop.create({
          data: {
            tripId,
            cityId: s.cityId,
            arrivalDate: s.arrivalDate,
            departureDate: s.departureDate,
            accommodationCost: parseFloat(String(s.accommodationCost || 0)),
            transportCost: parseFloat(String(s.transportCost || 0)),
            orderIndex: parseInt(String(s.orderIndex || 0))
          }
        });

        const createdActs = [];
        if (Array.isArray(s.activities)) {
          for (const a of s.activities) {
            const createdAct = await tx.stopActivity.create({
              data: {
                stopId: createdStop.id,
                name: a.name,
                cost: parseFloat(String(a.cost || 0)),
                category: a.category || 'Sightseeing',
                duration: parseFloat(String(a.duration || 1)),
                date: a.date,
                time: a.time || '10:00'
              }
            });
            createdActs.push(createdAct);
          }
        }

        createdStops.push({
          ...createdStop,
          activities: createdActs
        });
      }

      return createdStops;
    });

    return res.status(200).json({
      success: true,
      message: 'Itinerary stops updated successfully',
      data: result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
