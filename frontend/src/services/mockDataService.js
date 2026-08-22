// mockDataService.js
// Client-side mock database service for GlobeTrotter

const DEFAULT_CITIES = [
  // --- Indian Destinations (20) ---
  {
    id: "c_mumbai",
    name: "Mumbai",
    country: "India",
    costIndex: 3,
    popularity: 5,
    region: "India",
    description: "India's financial capital, Bollywood heartland, and home to colonial heritage monuments.",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_delhi",
    name: "Delhi",
    country: "India",
    costIndex: 3,
    popularity: 5,
    region: "India",
    description: "The historical capital of India, filled with ancient forts, bustling markets, and political centers.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_goa",
    name: "Goa",
    country: "India",
    costIndex: 2,
    popularity: 5,
    region: "India",
    description: "Famous for its pristine sandy beaches, Portuguese architecture, active nightlife, and spice plantations.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_jaipur",
    name: "Jaipur",
    country: "India",
    costIndex: 2,
    popularity: 4,
    region: "India",
    description: "The Pink City of Rajasthan, renowned for its majestic forts, ornate palaces, and rich handicraft heritage.",
    image: "https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_udaipur",
    name: "Udaipur",
    country: "India",
    costIndex: 2,
    popularity: 4,
    region: "India",
    description: "The City of Lakes and romantic palaces, surrounded by the beautiful Aravalli Hills.",
    image: "https://images.unsplash.com/photo-1595815771614-124436272251?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_manali",
    name: "Manali",
    country: "India",
    costIndex: 2,
    popularity: 4,
    region: "India",
    description: "A popular mountain resort town in Himachal Pradesh, providing adventure activities and snow landscapes.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_shimla",
    name: "Shimla",
    country: "India",
    costIndex: 2,
    popularity: 4,
    region: "India",
    description: "The former colonial summer capital, famous for its historic toy train and green mountain valleys.",
    image: "https://images.unsplash.com/photo-1562691590-7d72216503f5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_kashmir",
    name: "Kashmir / Srinagar",
    country: "India",
    costIndex: 2,
    popularity: 5,
    region: "India",
    description: "Heaven on Earth, famous for its houseboats, beautiful Mughal gardens, and alpine landscapes.",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_leh",
    name: "Leh-Ladakh",
    country: "India",
    costIndex: 3,
    popularity: 5,
    region: "India",
    description: "A high-altitude region offering desert valleys, Buddhist monasteries, and spectacular deep-blue lakes.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_agra",
    name: "Agra",
    country: "India",
    costIndex: 1,
    popularity: 5,
    region: "India",
    description: "Home of the Taj Mahal, one of the Seven Wonders of the World, along with Agra Fort and Fatehpur Sikri.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_varanasi",
    name: "Varanasi",
    country: "India",
    costIndex: 1,
    popularity: 4,
    region: "India",
    description: "One of the oldest continuously inhabited cities in the world, sacred for Ganga rituals and spiritual vibes.",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_rishikesh",
    name: "Rishikesh",
    country: "India",
    costIndex: 1,
    popularity: 4,
    region: "India",
    description: "The Yoga Capital of the World, offering white-water rafting, meditation centers, and ganga ghats.",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_hyderabad",
    name: "Hyderabad",
    country: "India",
    costIndex: 2,
    popularity: 4,
    region: "India",
    description: "The historic city of Nizams, famous for its grand Charminar monument and authentic Hyderabadi Biryani.",
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_bengaluru",
    name: "Bengaluru",
    country: "India",
    costIndex: 3,
    popularity: 4,
    region: "India",
    description: "The IT hub of India, characterized by its garden parks, dynamic tech culture, and pleasant weather.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_kolkata",
    name: "Kolkata",
    country: "India",
    costIndex: 2,
    popularity: 4,
    region: "India",
    description: "The intellectual capital of India, filled with grand colonial buildings, tramways, and rich sweets.",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_chennai",
    name: "Chennai",
    country: "India",
    costIndex: 2,
    popularity: 4,
    region: "India",
    description: "Gateway to the South, famous for its historic temples, filter coffee, and the vast Marina Beach.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_kerala",
    name: "Kerala / Kochi",
    country: "India",
    costIndex: 2,
    popularity: 5,
    region: "India",
    description: "Famous for spice trade heritage, Chinese fishing nets, lush coconut trees, and serene backwater canals.",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_amritsar",
    name: "Amritsar",
    country: "India",
    costIndex: 1,
    popularity: 4,
    region: "India",
    description: "Home of the Golden Temple, the spiritual center of Sikhism, and famous Punjabi street foods.",
    image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_jaisalmer",
    name: "Jaisalmer",
    country: "India",
    costIndex: 2,
    popularity: 4,
    region: "India",
    description: "The Golden City of Thar Desert, defined by its yellow sandstone fort and camel caravans.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_andaman",
    name: "Andaman & Nicobar",
    country: "India",
    costIndex: 3,
    popularity: 5,
    region: "India",
    description: "Tropical islands with turquoise seas, rich marine biodiversity, scuba diving, and historical colonial sites.",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=600&auto=format&fit=crop&q=80"
  },

  // --- Foreign Destinations (10) ---
  {
    id: "c_paris",
    name: "Paris",
    country: "France",
    costIndex: 3,
    popularity: 5,
    region: "Europe",
    description: "The city of light, fashion, and culinary excellence.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_tokyo",
    name: "Tokyo",
    country: "Japan",
    costIndex: 3,
    popularity: 5,
    region: "Asia",
    description: "A neon-lit metropolis blending ancient traditions with ultra-modern life.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_rome",
    name: "Rome",
    country: "Italy",
    costIndex: 2,
    popularity: 5,
    region: "Europe",
    description: "A historic treasure chest of ruins, art, and world-class espresso.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_bali",
    name: "Bali",
    country: "Indonesia",
    costIndex: 1,
    popularity: 4,
    region: "Asia",
    description: "Tropical beaches, lush volcanic hills, and serene spirituality.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_newyork",
    name: "New York",
    country: "USA",
    costIndex: 3,
    popularity: 5,
    region: "North America",
    description: "The capital of culture, commerce, and skyscrapers that scrape the stars.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_london",
    name: "London",
    country: "United Kingdom",
    costIndex: 3,
    popularity: 5,
    region: "Europe",
    description: "Royal palaces, historical museums, and world-renowned theaters along the Thames.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_dubai",
    name: "Dubai",
    country: "UAE",
    costIndex: 3,
    popularity: 5,
    region: "Middle East",
    description: "Futuristic skyscrapers, artificial resort islands, and traditional gold souks.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_singapore",
    name: "Singapore",
    country: "Singapore",
    costIndex: 3,
    popularity: 5,
    region: "Asia",
    description: "A botanical paradise and financial hub with futuristic parks and street food culture.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_bangkok",
    name: "Bangkok",
    country: "Thailand",
    costIndex: 1,
    popularity: 5,
    region: "Asia",
    description: "A city of shrines, floating markets, and rich, spicy street food experiences.",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_switzerland",
    name: "Switzerland",
    country: "Switzerland",
    costIndex: 3,
    popularity: 5,
    region: "Europe",
    description: "Scenic train tours, snowcapped alpine ranges, and pristine mountain lakes.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=80"
  }
];

const DEFAULT_ACTIVITIES = [
  // --- Activities in Agra (c_agra) ---
  { id: "a_t1", cityId: "c_agra", name: "Taj Mahal Sunrise Tour", cost: 1200, category: "Sightseeing", duration: 3, description: "Behold the ivory-white monument in the morning gold.", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400" },
  { id: "a_t2", cityId: "c_agra", name: "Agra Fort Exploration", cost: 600, category: "Sightseeing", duration: 2, description: "Discover the walled red sandstone city of Mughal Emperors.", image: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=400" },
  
  // --- Activities in Goa (c_goa) ---
  { id: "a_g1", cityId: "c_goa", name: "Scuba Diving at Grande Island", cost: 3500, category: "Adventure", duration: 4, description: "Discover marine life and corals with PADI trainers.", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400" },
  { id: "a_g2", cityId: "c_goa", name: "Mandovi River Cruise & Dinner", cost: 1500, category: "Food & Drink", duration: 2.5, description: "Enjoy live music, folk dances, and local buffet dishes.", image: "https://images.unsplash.com/photo-1509060464153-44667396260f?w=400" },

  // --- Activities in Jaipur (c_jaipur) ---
  { id: "a_j1", cityId: "c_jaipur", name: "Amber Fort Elephant Ride & Tour", cost: 1800, category: "Sightseeing", duration: 3.5, description: "Ascend the hill fort and marvel at the Sheesh Mahal glass panels.", image: "https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=400" },
  { id: "a_j2", cityId: "c_jaipur", name: "Chokhi Dhani Cultural Experience", cost: 1200, category: "Food & Drink", duration: 4, description: "Traditional Rajasthani dance, games, and an elaborate dinner.", image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400" },

  // --- Activities in Kashmir (c_kashmir) ---
  { id: "a_k1", cityId: "c_kashmir", name: "Dal Lake Shikara Boat Ride", cost: 800, category: "Sightseeing", duration: 2, description: "Row through floating markets and witness the snow mountains.", image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=400" },

  // --- Activities in Paris (c_paris) ---
  { id: "a1", cityId: "c_paris", name: "Eiffel Tower Tour", cost: 4000, category: "Sightseeing", duration: 2, description: "Skip-the-line tour of Paris's iconic structure.", image: "https://images.unsplash.com/photo-1522083165195-3427502977a1?w=400" },
  { id: "a2", cityId: "c_paris", name: "Louvre Museum Visit", cost: 2000, category: "Sightseeing", duration: 3, description: "Behold the Mona Lisa and thousands of masterworks.", image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400" },

  // --- Activities in Tokyo (c_tokyo) ---
  { id: "a5", cityId: "c_tokyo", name: "Shibuya Crossing Walking Tour", cost: 1200, category: "Sightseeing", duration: 1.5, description: "Guided walk around Shibuya, Harajuku, and Meiji Shrine.", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400" },
  { id: "a6", cityId: "c_tokyo", name: "Sushi Making Workshop", cost: 7000, category: "Food & Drink", duration: 3, description: "Prepare and dine on authentic sushi under master guidance.", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" }
];

const DEFAULT_TRIPS = [
  {
    id: "t_active1",
    name: "Golden Triangle Highlights",
    startDate: "2026-08-20",
    endDate: "2026-08-26",
    description: "An elegant exploration of Delhi, Agra and Jaipur palaces.",
    coverPhoto: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
    isPublic: true,
    budgetLimit: 25000,
    stops: [
      {
        id: "s_dt1",
        cityId: "c_delhi",
        arrivalDate: "2026-08-20",
        departureDate: "2026-08-22",
        orderIndex: 0,
        activities: [],
        accommodationCost: 2000,
        transportCost: 1500
      },
      {
        id: "s_dt2",
        cityId: "c_agra",
        arrivalDate: "2026-08-22",
        departureDate: "2026-08-24",
        orderIndex: 1,
        activities: [
          { id: "sa_t1", name: "Taj Mahal Sunrise Tour", cost: 1200, category: "Sightseeing", time: "06:00", date: "2026-08-23", duration: 3 }
        ],
        accommodationCost: 1800,
        transportCost: 800
      }
    ]
  },
  {
    id: "t_prev1",
    name: "Heritage Forts of Jaipur",
    startDate: "2026-04-10",
    endDate: "2026-04-15",
    description: "A completed historical escapade into Rajasthani heritage.",
    coverPhoto: "https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=800",
    isPublic: false,
    budgetLimit: 15000,
    stops: [
      {
        id: "s_jp1",
        cityId: "c_jaipur",
        arrivalDate: "2026-04-10",
        departureDate: "2026-04-15",
        orderIndex: 0,
        activities: [
          { id: "sa_j1", name: "Amber Fort Elephant Ride & Tour", cost: 1800, category: "Sightseeing", time: "09:00", date: "2026-04-11", duration: 3.5 }
        ],
        accommodationCost: 1500,
        transportCost: 1200
      }
    ]
  }
];

// Preplanned Template Packages (Exactly 3 are returned for the initial profile view)
const DEFAULT_PREPLANNED = [
  {
    id: "p_1",
    name: "Classic Rajasthan Getaway",
    description: "Explore the royal forts of Jaipur and romantic lakes of Udaipur in 7 days.",
    coverPhoto: "https://images.unsplash.com/photo-1477587458883-471a5ed94245?w=800",
    durationDays: 7,
    budget: 35000,
    stopsCount: 2,
    isPublic: true,
    stops: [
      { cityId: "c_jaipur", arrivalOffset: 0, departureOffset: 3, activities: [{ name: "Amber Fort Tour", cost: 1500 }] },
      { cityId: "c_udaipur", arrivalOffset: 3, departureOffset: 7, activities: [{ name: "Lake Pichola Boat Ride", cost: 800 }] }
    ]
  },
  {
    id: "p_2",
    name: "Kashmir Paradise Package",
    description: "Heavenly retreat on a Srinagar houseboat, with beautiful snow rides in Gulmarg.",
    coverPhoto: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800",
    durationDays: 5,
    budget: 28000,
    stopsCount: 1,
    isPublic: true,
    stops: [
      { cityId: "c_kashmir", arrivalOffset: 0, departureOffset: 5, activities: [{ name: "Shikara Ride", cost: 800 }] }
    ]
  },
  {
    id: "p_3",
    name: "Romantic Paris & Swiss Alps",
    description: "A luxury tour connecting the lights of Paris with the breathtaking Swiss glacier rails.",
    coverPhoto: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
    durationDays: 8,
    budget: 180000,
    stopsCount: 2,
    isPublic: true,
    stops: [
      { cityId: "c_paris", arrivalOffset: 0, departureOffset: 4, activities: [{ name: "Eiffel Tower Skip-Line", cost: 4000 }] },
      { cityId: "c_switzerland", arrivalOffset: 4, departureOffset: 8, activities: [{ name: "Jungfrau Train Trip", cost: 15000 }] }
    ]
  },
  {
    id: "p_4",
    name: "Goa Sunny Beaches Tour",
    description: "Relaxing holiday package detailing beach activities, cruises, and historical churches.",
    coverPhoto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    durationDays: 4,
    budget: 18000,
    stopsCount: 1,
    isPublic: true,
    stops: [
      { cityId: "c_goa", arrivalOffset: 0, departureOffset: 4, activities: [{ name: "Mandovi Cruise", cost: 1200 }] }
    ]
  },
  {
    id: "p_5",
    name: "Futuristic Tokyo & Kyoto Trek",
    description: "Journey from neon skyscrapers to traditional Zen shrines and sushi workshops.",
    coverPhoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    durationDays: 10,
    budget: 220000,
    stopsCount: 2,
    isPublic: true,
    stops: [
      { cityId: "c_tokyo", arrivalOffset: 0, departureOffset: 5, activities: [{ name: "Sushi Workshop", cost: 7000 }] }
    ]
  }
];

// Initialize localStorage
const initDB = () => {
  const currentCities = JSON.parse(localStorage.getItem("gt_cities") || "[]");
  if (currentCities.length < 25) {
    localStorage.setItem("gt_cities", JSON.stringify(DEFAULT_CITIES));
    localStorage.setItem("gt_activities", JSON.stringify(DEFAULT_ACTIVITIES));
    localStorage.setItem("gt_trips", JSON.stringify(DEFAULT_TRIPS));
    localStorage.setItem("gt_preplanned", JSON.stringify(DEFAULT_PREPLANNED));
  }
  
  if (!localStorage.getItem("gt_user")) {
    localStorage.setItem("gt_user", JSON.stringify({
      name: "Alex Globetrotter",
      email: "alex@globetrotter.com",
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      language: "en",
      savedDestinations: ["c_agra", "c_goa", "c_paris"]
    }));
  }
  if (!localStorage.getItem("gt_auth")) {
    localStorage.setItem("gt_auth", JSON.stringify({ loggedIn: true, email: "alex@globetrotter.com" }));
  }
};

initDB();

const load = (key) => JSON.parse(localStorage.getItem(key));
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDataService = {
  // --- AUTH SERVICE ---
  async login(email, password) {
    await delay(500);
    if (!email || !password) throw new Error("Email and password are required.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    
    const user = load("gt_user") || { email: "alex@globetrotter.com", name: "Alex" };
    if (email.toLowerCase() === user.email.toLowerCase()) {
      save("gt_auth", { loggedIn: true, email: user.email });
      return user;
    } else {
      const newUser = {
        name: email.split("@")[0],
        email: email,
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        language: "en",
        savedDestinations: []
      };
      save("gt_user", newUser);
      save("gt_auth", { loggedIn: true, email: newUser.email });
      return newUser;
    }
  },

  async signup(name, email, password, additionalInfo = {}) {
    await delay(500);
    if (!name || !email || !password) throw new Error("All required fields must be filled.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    
    const user = {
      name,
      email,
      photo: additionalInfo.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      language: additionalInfo.language || "en",
      savedDestinations: [],
      ...additionalInfo
    };
    
    save("gt_user", user);
    save("gt_auth", { loggedIn: true, email: user.email });
    return user;
  },

  async logout() {
    await delay(100);
    save("gt_auth", { loggedIn: false, email: "" });
    return true;
  },

  async getCurrentUser() {
    await delay(50);
    const auth = load("gt_auth");
    if (auth && auth.loggedIn) {
      return load("gt_user");
    }
    return null;
  },

  async updateProfile(profileData) {
    await delay(400);
    const user = load("gt_user");
    const updated = { ...user, ...profileData };
    save("gt_user", updated);
    return updated;
  },

  async deleteAccount() {
    await delay(500);
    localStorage.removeItem("gt_user");
    localStorage.removeItem("gt_trips");
    save("gt_auth", { loggedIn: false, email: "" });
    return true;
  },

  // --- TRIPS SERVICE ---
  async getTrips() {
    await delay(300);
    return load("gt_trips") || [];
  },

  async getTripById(id) {
    await delay(200);
    const trips = load("gt_trips") || [];
    return trips.find(t => t.id === id) || null;
  },

  async saveTrip(trip) {
    await delay(400);
    const trips = load("gt_trips") || [];
    if (trip.id) {
      const idx = trips.findIndex(t => t.id === trip.id);
      if (idx !== -1) {
        trips[idx] = { ...trips[idx], ...trip };
      } else {
        throw new Error("Trip not found");
      }
    } else {
      trip.id = "t_" + Date.now();
      trip.stops = trip.stops || [];
      trip.coverPhoto = trip.coverPhoto || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";
      trip.isPublic = trip.isPublic || false;
      trip.budgetLimit = trip.budgetLimit || 50000;
      trips.push(trip);
    }
    save("gt_trips", trips);
    return trip;
  },

  async deleteTrip(id) {
    await delay(300);
    const trips = load("gt_trips") || [];
    const filtered = trips.filter(t => t.id !== id);
    save("gt_trips", filtered);
    return true;
  },

  async cloneTrip(tripId) {
    await delay(400);
    const original = await this.getTripById(tripId);
    if (!original) throw new Error("Itinerary not found");
    const clone = {
      ...original,
      id: "t_" + Date.now(),
      name: `Copy of ${original.name}`,
      isPublic: false
    };
    clone.stops = clone.stops.map((stop, idx) => ({
      ...stop,
      id: `s_${Date.now()}_${idx}`,
      activities: stop.activities.map((act, actIdx) => ({
        ...act,
        id: `sa_${Date.now()}_${idx}_${actIdx}`
      }))
    }));

    const trips = load("gt_trips") || [];
    trips.push(clone);
    save("gt_trips", trips);
    return clone;
  },

  // --- CITIES & SEARCH ---
  async getCities() {
    await delay(100);
    return load("gt_cities") || DEFAULT_CITIES;
  },

  async getCityById(id) {
    await delay(50);
    const cities = load("gt_cities") || DEFAULT_CITIES;
    return cities.find(c => c.id === id) || null;
  },

  async searchCities(query, regionFilter) {
    await delay(200);
    let cities = load("gt_cities") || DEFAULT_CITIES;
    if (query) {
      const q = query.toLowerCase();
      cities = cities.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
    }
    if (regionFilter && regionFilter !== "All") {
      cities = cities.filter(c => c.region === regionFilter);
    }
    return cities;
  },

  // --- ACTIVITIES & SEARCH ---
  async getActivities() {
    await delay(100);
    return load("gt_activities") || DEFAULT_ACTIVITIES;
  },

  async getActivitiesByCityId(cityId) {
    await delay(100);
    const activities = load("gt_activities") || DEFAULT_ACTIVITIES;
    return activities.filter(a => a.cityId === cityId);
  },

  async searchActivities(cityId, query, categoryFilter, maxCost) {
    await delay(200);
    let activities = load("gt_activities") || DEFAULT_ACTIVITIES;
    if (cityId) {
      activities = activities.filter(a => a.cityId === cityId);
    }
    if (query) {
      const q = query.toLowerCase();
      activities = activities.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    if (categoryFilter && categoryFilter !== "All") {
      activities = activities.filter(a => a.category === categoryFilter);
    }
    if (maxCost) {
      activities = activities.filter(a => a.cost <= maxCost);
    }
    return activities;
  },

  // --- STOPS BUILDER ---
  async saveStops(tripId, stops) {
    await delay(400);
    const trips = load("gt_trips") || [];
    const idx = trips.findIndex(t => t.id === tripId);
    if (idx === -1) throw new Error("Trip not found");
    trips[idx].stops = stops;
    save("gt_trips", trips);
    return trips[idx];
  },

  // --- PREPLANNED & COMPLETED TRIPS LISTS ---
  async getPreplannedTrips() {
    await delay(100);
    return load("gt_preplanned") || DEFAULT_PREPLANNED;
  },

  async getPreplannedTripById(id) {
    const list = await this.getPreplannedTrips();
    return list.find(t => t.id === id) || null;
  },

  async clonePreplannedTrip(id) {
    const template = await this.getPreplannedTripById(id);
    if (!template) throw new Error("Template not found");
    
    // Create new active trip based on template
    const user = await this.getCurrentUser();
    const today = new Date().toISOString().split("T")[0];
    const end = new Date();
    end.setDate(end.getDate() + template.durationDays);
    const endStr = end.toISOString().split("T")[0];

    const activeStops = template.stops.map((stop, idx) => {
      const arr = new Date();
      arr.setDate(arr.getDate() + stop.arrivalOffset);
      const dep = new Date();
      dep.setDate(dep.getDate() + stop.departureOffset);
      return {
        id: `s_clone_${Date.now()}_${idx}`,
        cityId: stop.cityId,
        arrivalDate: arr.toISOString().split("T")[0],
        departureDate: dep.toISOString().split("T")[0],
        accommodationCost: 1500,
        transportCost: 2000,
        orderIndex: idx,
        activities: stop.activities.map((a, aIdx) => ({
          id: `sa_clone_${Date.now()}_${idx}_${aIdx}`,
          name: a.name,
          cost: a.cost,
          category: "Sightseeing",
          duration: 3,
          date: arr.toISOString().split("T")[0],
          time: "10:00"
        }))
      };
    });

    const newTrip = {
      name: `My ${template.name}`,
      startDate: today,
      endDate: endStr,
      description: template.description,
      coverPhoto: template.coverPhoto,
      budgetLimit: template.budget,
      isPublic: false,
      stops: activeStops
    };

    return await this.saveTrip(newTrip);
  },

  async getPreviousTrips() {
    // Return trips where the endDate is prior to today
    const trips = await this.getTrips();
    const today = new Date();
    return trips.filter(t => new Date(t.endDate) < today);
  },

  // --- BUDGET BREAKDOWN SERVICE ---
  async getBudgetBreakdown(tripId) {
    await delay(200);
    const trip = await this.getTripById(tripId);
    if (!trip) throw new Error("Trip not found");

    let accommodationTotal = 0;
    let transportTotal = 0;
    let activitiesTotal = 0;
    let mealsTotal = 0;

    const dailyExpenses = {};
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      dailyExpenses[dateStr] = 0;
    }

    trip.stops.forEach(stop => {
      const stopStart = new Date(stop.arrivalDate);
      const stopEnd = new Date(stop.departureDate);
      const diffTime = Math.abs(stopEnd - stopStart);
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      const stopAccommodation = (stop.accommodationCost || 1000) * nights;
      accommodationTotal += stopAccommodation;

      const stopTransport = (stop.transportCost || 1000);
      transportTotal += stopTransport;

      const stopMeals = 500 * nights; 
      mealsTotal += stopMeals;

      for (let i = 0; i < nights; i++) {
        const nextDay = new Date(stopStart);
        nextDay.setDate(stopStart.getDate() + i);
        const nextDayStr = nextDay.toISOString().split("T")[0];
        if (dailyExpenses[nextDayStr] !== undefined) {
          dailyExpenses[nextDayStr] += (stop.accommodationCost || 1000) + 500;
        }
      }

      const arrivalStr = stop.arrivalDate;
      if (dailyExpenses[arrivalStr] !== undefined) {
        dailyExpenses[arrivalStr] += stopTransport;
      }

      stop.activities.forEach(act => {
        activitiesTotal += act.cost;
        if (act.date && dailyExpenses[act.date] !== undefined) {
          dailyExpenses[act.date] += act.cost;
        }
      });
    });

    const totalCost = accommodationTotal + transportTotal + activitiesTotal + mealsTotal;
    const diffTimeTotal = Math.abs(end - start);
    const totalDays = Math.max(1, Math.ceil(diffTimeTotal / (1000 * 60 * 60 * 24)) + 1);
    const averageCostPerDay = Math.round(totalCost / totalDays);

    const dailyAllowed = trip.budgetLimit / totalDays;
    const overbudgetDays = Object.keys(dailyExpenses).filter(date => {
      return dailyExpenses[date] > dailyAllowed;
    }).map(date => ({
      date,
      spent: Math.round(dailyExpenses[date]),
      allowed: Math.round(dailyAllowed)
    }));

    return {
      totalCost,
      budgetLimit: trip.budgetLimit,
      averageCostPerDay,
      breakdown: [
        { name: "Accommodation", value: accommodationTotal, color: "#0f766e" },
        { name: "Transport", value: transportTotal, color: "#3b82f6" },
        { name: "Activities", value: activitiesTotal, color: "#6d28d9" },
        { name: "Meals & Incidental", value: mealsTotal, color: "#f59e0b" }
      ],
      dailyExpenses: Object.keys(dailyExpenses).map(date => ({
        date,
        spent: Math.round(dailyExpenses[date])
      })),
      overbudgetDays
    };
  },

  // --- ADMIN STATS ---
  async getAdminStats() {
    await delay(350);
    const trips = await this.getTrips();
    const cities = await this.getCities();
    const preplanned = await this.getPreplannedTrips();

    const totalTripsCreated = trips.length + 15; // simulate real statistics scale
    const activeTripsCount = trips.length;
    const completedTripsCount = 27; 
    const totalUsers = 48;

    const cityPopularity = {};
    cities.forEach(c => { cityPopularity[c.name] = 0; });
    trips.forEach(t => {
      t.stops.forEach(s => {
        const city = cities.find(c => c.id === s.cityId);
        if (city) {
          cityPopularity[city.name] = (cityPopularity[city.name] || 0) + 1;
        }
      });
    });

    const popularDestinations = Object.keys(cityPopularity)
      .map(name => ({ name, count: cityPopularity[name] + Math.floor(Math.random() * 5) + 3 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalUsers,
      totalTripsCreated,
      activeTripsCount,
      completedTripsCount,
      popularDestinations,
      recentActivity: [
        { id: 1, user: "Karan Johar", action: "Created itinerary 'Goa Getaway'", time: "3 mins ago" },
        { id: 2, user: "Shriti Sen", action: "Cloned preplanned package 'Classic Rajasthan'", time: "15 mins ago" },
        { id: 3, user: "Rohit Sharma", action: "Exported PDF budget for 'Kashmir Retreat'", time: "1 hour ago" },
        { id: 4, user: "Pooja Hegde", action: "Registered a new account from Bengaluru", time: "2 hours ago" }
      ],
      userGrowth: [
        { month: "Mar", count: 10 },
        { month: "Apr", count: 18 },
        { month: "May", count: 25 },
        { month: "Jun", count: 32 },
        { month: "Jul", count: 41 },
        { month: "Aug", count: 48 }
      ],
      tripCategoryBreakdown: [
        { name: "Adventure", value: 35, color: "#8b5cf6" },
        { name: "Leisure", value: 45, color: "#14b8a6" },
        { name: "Spiritual", value: 20, color: "#f59e0b" }
      ]
    };
  }
};
