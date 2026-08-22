// src/controllers/exploreController.ts
import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCities = async (req: Request, res: Response) => {
  const { search, region } = req.query;

  try {
    const whereClause: any = {};

    if (region && region !== 'All') {
      whereClause.region = String(region);
    }

    if (search) {
      const q = String(search).toLowerCase();
      whereClause.OR = [
        { name: { contains: q } },
        { country: { contains: q } }
      ];
    }

    // Since SQLite is case-insensitive for 'contains' by default or depends on setup,
    // this query will work cleanly.
    const cities = await prisma.city.findMany({
      where: whereClause
    });

    return res.status(200).json({
      success: true,
      data: cities
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getCityActivities = async (req: Request, res: Response) => {
  const { cityId } = req.params;
  const { search, category, maxCost } = req.query;

  try {
    const whereClause: any = { cityId };

    if (category && category !== 'All') {
      whereClause.category = String(category);
    }

    if (maxCost) {
      whereClause.cost = { lte: parseFloat(String(maxCost)) };
    }

    if (search) {
      const q = String(search);
      whereClause.OR = [
        { name: { contains: q } },
        { description: { contains: q } }
      ];
    }

    const activities = await prisma.activity.findMany({
      where: whereClause
    });

    return res.status(200).json({
      success: true,
      data: activities
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
