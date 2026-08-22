// src/controllers/userController.ts
import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { name, email, language, photo } = req.body;

  try {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (language) updateData.language = language;
    if (photo) updateData.photo = photo;
    if (email) {
      // Check email uniqueness if email is changed
      const current = await prisma.user.findUnique({ where: { id: req.user.userId } });
      if (current && current.email !== email.toLowerCase()) {
        const duplicate = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (duplicate) {
          return res.status(409).json({ success: false, message: 'Email address is already in use.' });
        }
        updateData.email = email.toLowerCase();
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        photo: updatedUser.photo,
        language: updatedUser.language,
        role: updatedUser.role
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    await prisma.user.delete({
      where: { id: req.user.userId }
    });
    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getSavedDestinations = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const saved = await prisma.userSavedCity.findMany({
      where: { userId: req.user.userId },
      include: { city: true }
    });

    const cities = saved.map(s => s.city);

    return res.status(200).json({
      success: true,
      data: cities
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const saveDestination = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { cityId } = req.params;

  try {
    const city = await prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    await prisma.userSavedCity.upsert({
      where: {
        userId_cityId: {
          userId: req.user.userId,
          cityId: cityId
        }
      },
      update: {},
      create: {
        userId: req.user.userId,
        cityId: cityId
      }
    });

    return res.status(200).json({
      success: true,
      message: 'City saved to destinations list.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const unsaveDestination = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { cityId } = req.params;

  try {
    await prisma.userSavedCity.delete({
      where: {
        userId_cityId: {
          userId: req.user.userId,
          cityId: cityId
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'City removed from destinations list.'
    });
  } catch (err) {
    // If it didn't exist, we still treat it as a success/noop
    return res.status(200).json({
      success: true,
      message: 'City removed from destinations list.'
    });
  }
};
