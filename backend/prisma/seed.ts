// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CITIES = [
  {
    id: "c1",
    name: "Paris",
    country: "France",
    costIndex: 3,
    popularity: 5,
    region: "Europe",
    description: "The city of light, fashion, and culinary excellence.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c2",
    name: "Tokyo",
    country: "Japan",
    costIndex: 3,
    popularity: 5,
    region: "Asia",
    description: "A neon-lit metropolis blending ancient traditions with ultra-modern life.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c3",
    name: "Rome",
    country: "Italy",
    costIndex: 2,
    popularity: 4,
    region: "Europe",
    description: "A historic treasure chest of ruins, art, and world-class espresso.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c4",
    name: "Bali",
    country: "Indonesia",
    costIndex: 1,
    popularity: 4,
    region: "Asia",
    description: "Tropical beaches, lush volcanic hills, and serene spirituality.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c5",
    name: "New York",
    country: "USA",
    costIndex: 3,
    popularity: 5,
    region: "North America",
    description: "The capital of culture, commerce, and skyscrapers that scrape the stars.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c6",
    name: "Cairo",
    country: "Egypt",
    costIndex: 1,
    popularity: 3,
    region: "Africa",
    description: "Gateway to the Pyramids and ancient Pharaohs along the River Nile.",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c7",
    name: "Sydney",
    country: "Australia",
    costIndex: 2,
    popularity: 4,
    region: "Oceania",
    description: "Stunning harbor views, surfing culture, and iconic architectural designs.",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c8",
    name: "Cape Town",
    country: "South Africa",
    costIndex: 1,
    popularity: 4,
    region: "Africa",
    description: "A harbor city set against the backdrop of dramatic Table Mountain.",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&fit=crop&q=80"
  }
];

const ACTIVITIES = [
  // Paris (c1)
  { id: "a1", cityId: "c1", name: "Eiffel Tower Tour", cost: 45, category: "Sightseeing", duration: 2, description: "Skip-the-line tour of Paris's iconic structure.", image: "https://images.unsplash.com/photo-1522083165195-3427502977a1?w=400" },
  { id: "a2", cityId: "c1", name: "Louvre Museum Visit", cost: 22, category: "Sightseeing", duration: 3, description: "Behold the Mona Lisa and thousands of masterworks.", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400" },
  { id: "a3", cityId: "c1", name: "Seine River Cruise & Dinner", cost: 95, category: "Food & Drink", duration: 2.5, description: "A magical twilight cruise through Paris with a 3-course dinner.", image: "https://images.unsplash.com/photo-1509060464153-44667396260f?w=400" },
  { id: "a4", cityId: "c1", name: "Pastry & Macaron Masterclass", cost: 65, category: "Food & Drink", duration: 2, description: "Learn to bake authentic French pastries with a local chef.", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400" },

  // Tokyo (c2)
  { id: "a5", cityId: "c2", name: "Shibuya Crossing Walking Tour", cost: 15, category: "Sightseeing", duration: 1.5, description: "Guided walk around Shibuya, Harajuku, and Meiji Shrine.", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400" },
  { id: "a6", cityId: "c2", name: "Sushi Making Workshop", cost: 80, category: "Food & Drink", duration: 3, description: "Prepare and dine on authentic sushi under master guidance.", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },
  { id: "a7", cityId: "c2", name: "Robot Restaurant Cabaret Show", cost: 75, category: "Entertainment", duration: 2, description: "A high-energy neon performance of robots and drums.", image: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=400" },
  { id: "a8", cityId: "c2", name: "Mount Fuji Day Trip", cost: 120, category: "Adventure", duration: 8, description: "Full-day trip to Mt. Fuji, Lake Kawaguchi, and hot springs.", image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=400" },

  // Rome (c3)
  { id: "a9", cityId: "c3", name: "Colosseum & Forum Guided Tour", cost: 50, category: "Sightseeing", duration: 3, description: "Walk back into ancient history through gladiatorial arenas.", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400" },
  { id: "a10", cityId: "c3", name: "Pizza & Gelato Cooking Class", cost: 60, category: "Food & Drink", duration: 2.5, description: "Toss dough and create standard Italian gelatos.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" },
  { id: "a11", cityId: "c3", name: "Vatican Museums & Sistine Chapel", cost: 35, category: "Sightseeing", duration: 3, description: "Marvel at Michelangelo's ceiling frescoes and holy art.", image: "https://images.unsplash.com/photo-1542820229-081e0c12af0b?w=400" },

  // Bali (c4)
  { id: "a12", cityId: "c4", name: "Ubud Monkey Forest Walk", cost: 10, category: "Adventure", duration: 2, description: "Explore temple complexes populated by playful macaques.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400" },
  { id: "a13", cityId: "c4", name: "Scuba Diving in Nusa Penida", cost: 110, category: "Adventure", duration: 4, description: "Swim alongside majestic manta rays in crystal clear waters.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" }
];

async function main() {
  console.log("Seeding cities database...");
  for (const city of CITIES) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: {},
      create: city
    });
  }

  console.log("Seeding activities database...");
  for (const act of ACTIVITIES) {
    await prisma.activity.upsert({
      where: { id: act.id },
      update: {},
      create: act
    });
  }

  console.log("Relational seed complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
