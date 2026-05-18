import {
  Itinerary,
  TripFormData,
  BUDGET_ESTIMATES,
  PlaceCategory,
  TravelInterest,
  BudgetBreakdown,
  TimeOfDay,
} from '@/types/travel';

type PlaceTemplate = {
  name: string;
  description: string;
  familyFriendly: boolean;
  indoor: boolean;
  duration: string;
  rating: number;
};

const mockPlaces: Record<PlaceCategory, PlaceTemplate[]> = {
  monument: [
    { name: 'Historic Fort', description: 'Ancient architecture, city views, and rich storytelling.', familyFriendly: true, indoor: false, duration: '2-3 hours', rating: 4.6 },
    { name: 'Royal Palace', description: 'Grand halls and heritage exhibits with guided tours.', familyFriendly: true, indoor: true, duration: '2 hours', rating: 4.7 },
    { name: 'Ancient Temple', description: 'Sacred complex with intricate carvings and peaceful courtyards.', familyFriendly: true, indoor: false, duration: '1-2 hours', rating: 4.5 },
  ],
  food: [
    { name: 'Heritage Restaurant', description: 'Regional specialties served in a memorable historic setting.', familyFriendly: true, indoor: true, duration: '1.5 hours', rating: 4.6 },
    { name: 'Street Food Market', description: 'High-energy local flavors and must-try snacks.', familyFriendly: false, indoor: false, duration: '2 hours', rating: 4.4 },
    { name: 'Rooftop Cafe', description: 'Scenic sunset dining with a relaxed atmosphere.', familyFriendly: true, indoor: true, duration: '1-2 hours', rating: 4.5 },
  ],
  nature: [
    { name: 'Botanical Gardens', description: 'A calm green retreat with shaded walking paths.', familyFriendly: true, indoor: false, duration: '2 hours', rating: 4.5 },
    { name: 'Lake View Point', description: 'Open-air lake vistas and easygoing boating options.', familyFriendly: true, indoor: false, duration: '2-3 hours', rating: 4.4 },
    { name: 'Mountain Trail', description: 'A scenic trail with broad views and photo-worthy stops.', familyFriendly: false, indoor: false, duration: '3-4 hours', rating: 4.7 },
  ],
  adventure: [
    { name: 'Adventure Park', description: 'Zip lines, rope activities, and fun challenge zones.', familyFriendly: true, indoor: false, duration: '2-3 hours', rating: 4.5 },
    { name: 'Water Sports Center', description: 'Kayaking and other outdoor adrenaline activities.', familyFriendly: false, indoor: false, duration: '3 hours', rating: 4.6 },
    { name: 'Desert Safari', description: 'A bold outdoors experience with dramatic landscapes.', familyFriendly: true, indoor: false, duration: '3-4 hours', rating: 4.7 },
  ],
  culture: [
    { name: 'Art Gallery', description: 'Traditional and modern exhibits that reveal local identity.', familyFriendly: true, indoor: true, duration: '1-2 hours', rating: 4.3 },
    { name: 'Cultural Center', description: 'Performances, craft demos, and local storytelling.', familyFriendly: true, indoor: true, duration: '2 hours', rating: 4.5 },
    { name: 'Heritage Walk', description: 'Guided exploration through storied streets and landmarks.', familyFriendly: true, indoor: false, duration: '2-3 hours', rating: 4.6 },
  ],
  shopping: [
    { name: 'Traditional Bazaar', description: 'Textiles, souvenirs, and local finds in one lively market.', familyFriendly: true, indoor: false, duration: '2 hours', rating: 4.2 },
    { name: 'Artisan Market', description: 'Handcrafted goods and conversations with local makers.', familyFriendly: true, indoor: false, duration: '1-2 hours', rating: 4.4 },
    { name: 'Night Market', description: 'Late-evening shopping and bites in a vibrant setting.', familyFriendly: false, indoor: false, duration: '2 hours', rating: 4.3 },
  ],
};

const categoryByInterest: Record<TravelInterest, PlaceCategory[]> = {
  adventure: ['adventure', 'nature'],
  food: ['food'],
  culture: ['culture', 'monument'],
  nature: ['nature'],
  nightlife: ['food', 'shopping'],
  shopping: ['shopping'],
};

const budgetShareByLevel = {
  low: { accommodation: 28, food: 24, transport: 20, activities: 18, shopping: 10 },
  medium: { accommodation: 32, food: 22, transport: 18, activities: 18, shopping: 10 },
  high: { accommodation: 38, food: 20, transport: 16, activities: 16, shopping: 10 },
} as const;

const timeSlots: TimeOfDay[] = ['morning', 'afternoon', 'evening'];

const pickWeather = () => {
  const weatherPool = [
    { temperature: 24, condition: 'Pleasant', humidity: 46, icon: 'sun', description: 'Comfortable weather for walking tours and open-air stops.' },
    { temperature: 31, condition: 'Hot', humidity: 38, icon: 'sun', description: 'Warm conditions, so indoor breaks and hydration matter.' },
    { temperature: 27, condition: 'Rainy', humidity: 72, icon: 'cloud-rain', description: 'Light showers are likely, so keep a few indoor alternatives ready.' },
  ];

  return weatherPool[Math.floor(Math.random() * weatherPool.length)];
};

const buildBudgetBreakdown = (totalBudget: number, budgetLevel: TripFormData['budgetLevel']): BudgetBreakdown => {
  const shares = budgetShareByLevel[budgetLevel];
  return {
    accommodation: Math.floor(totalBudget * (shares.accommodation / 100)),
    food: Math.floor(totalBudget * (shares.food / 100)),
    transport: Math.floor(totalBudget * (shares.transport / 100)),
    activities: Math.floor(totalBudget * (shares.activities / 100)),
    shopping: Math.floor(totalBudget * (shares.shopping / 100)),
  };
};

const getPreferredCategories = (interests: TravelInterest[]) => {
  const selected = interests.length > 0 ? interests : ['culture', 'food'];
  const categories = selected.flatMap((interest) => categoryByInterest[interest]);
  return [...new Set(categories)];
};

const getDayCategories = (preferredCategories: PlaceCategory[], index: number, tripPace: TripFormData['tripPace']) => {
  const defaultRotation: PlaceCategory[] = ['monument', 'food', 'nature', 'culture', 'shopping', 'adventure'];
  const pool = preferredCategories.length > 0
    ? [...preferredCategories, ...defaultRotation]
    : defaultRotation;

  const targetCount = tripPace === 'packed' ? 3 : 2;
  return Array.from({ length: targetCount }, (_, offset) => pool[(index + offset) % pool.length]);
};

const getActivityTips = (
  category: PlaceCategory,
  weatherCondition: string,
  tripPace: TripFormData['tripPace'],
  familyFriendly: boolean
) => {
  const tips = [
    tripPace === 'relaxed'
      ? 'Keep 30-45 minutes free after this stop for a comfortable pace.'
      : 'Keep your transfers tight here to stay on track for a fuller day.',
    familyFriendly
      ? 'Good stop if you are traveling with kids or older family members.'
      : 'Best suited if your group is comfortable with a more active pace.',
  ];

  if (weatherCondition === 'Rainy') {
    tips.push(category === 'culture' || category === 'food'
      ? 'This is a strong rainy-day stop with good indoor cover.'
      : 'Carry an umbrella and keep one indoor backup nearby.');
  }

  if (weatherCondition === 'Hot') {
    tips.push('Carry water and prefer shade or air-conditioned breaks around this stop.');
  }

  return tips;
};

const getTravelTips = (
  formData: TripFormData,
  weatherCondition: string,
  destination: string
) => {
  const tips = [
    `Start monument visits early in ${destination} to avoid crowd peaks.`,
    'Keep a small cash buffer for local markets and short transport hops.',
    formData.tripPace === 'relaxed'
      ? 'Leave some open pockets in your day for cafe stops or spontaneous detours.'
      : 'Pre-book tickets where possible so a packed plan stays smooth.',
  ];

  if (formData.interests.includes('food')) {
    tips.push('Reserve one meal slot for a regional specialty rather than generic dining.');
  }
  if (formData.interests.includes('shopping')) {
    tips.push('Shop later in the trip so you can compare prices before buying souvenirs.');
  }
  if (weatherCondition === 'Rainy') {
    tips.push('Keep one museum, gallery, or indoor food stop in mind as a weather-safe backup.');
  }
  if (weatherCondition === 'Hot') {
    tips.push('Plan your longest walks before noon and use the afternoon for indoor or shaded stops.');
  }
  if (formData.travelType === 'family') {
    tips.push('Prioritize washroom access, snack breaks, and shorter transfer times for family comfort.');
  }

  return tips;
};

const buildPackingChecklist = (formData: TripFormData, weatherCondition: string) => {
  const checklist = [
    'Government ID and booking confirmations',
    'Phone charger and power bank',
    'Comfortable walking shoes',
    'Small day bag for daily essentials',
  ];

  if (weatherCondition === 'Rainy') {
    checklist.push('Compact umbrella or light rain jacket');
  }
  if (weatherCondition === 'Hot') {
    checklist.push('Sunscreen, sunglasses, and a refillable water bottle');
  }
  if (formData.interests.includes('adventure')) {
    checklist.push('Sportswear and an extra quick-dry outfit');
  }
  if (formData.travelType === 'family') {
    checklist.push('Snacks, wet wipes, and a small comfort kit for kids');
  }

  return checklist;
};

const buildTravelChecklist = (formData: TripFormData) => {
  const checklist = [
    'Confirm transport bookings',
    'Save hotel address and check-in details offline',
    'Keep emergency contacts and important numbers handy',
    'Download offline maps for your destination',
  ];

  if (formData.tripPace === 'packed') {
    checklist.push('Pre-book key attractions to avoid queues');
  }
  if (formData.travelType !== 'solo') {
    checklist.push('Share the day plan with your group before leaving');
  }

  return checklist;
};

const parseDurationHours = (duration: string) => {
  const numericParts = duration.match(/\d+/g)?.map(Number) ?? [2];
  return numericParts.reduce((sum, value) => sum + value, 0) / numericParts.length;
};

export const generateMockItinerary = (formData: TripFormData): Itinerary => {
  const { destination, days, travelType, budgetLevel, interests, tripPace } = formData;
  const budgetInfo = BUDGET_ESTIMATES[budgetLevel];
  const weather = pickWeather();
  const preferredCategories = getPreferredCategories(interests);

  const activityCountPerDay = tripPace === 'packed' ? 3 : 2;
  const dailyBudget = Math.floor((budgetInfo.min + budgetInfo.max) / 2);
  const totalBudget = dailyBudget * days;

  const itineraryDays = Array.from({ length: days }, (_, i) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);
    const categories = getDayCategories(preferredCategories, i, tripPace);

    const activities = categories.map((category, slotIndex) => {
      const template = mockPlaces[category][(i + slotIndex) % mockPlaces[category].length];
      const durationHours = parseDurationHours(template.duration);
      const baseCost = Math.floor((dailyBudget / activityCountPerDay) * (durationHours / 2));
      const familyFriendly =
        travelType === 'family' ? true : template.familyFriendly;

      return {
        time: timeSlots[slotIndex] ?? 'evening',
        place: {
          id: `place-${i + 1}-${slotIndex}`,
          name: `${destination} ${template.name}`,
          category,
          description: template.description,
          budgetTier: budgetLevel,
          estimatedCost: Math.max(baseCost, Math.floor(dailyBudget * 0.18)),
          duration: template.duration,
          rating: template.rating,
          familyFriendly,
          indoor: template.indoor,
          nearbyAlternatives: mockPlaces[category]
            .filter((item) => item.name !== template.name)
            .slice(0, 2)
            .map((item) => `${destination} ${item.name}`),
        },
        tips: getActivityTips(category, weather.condition, tripPace, familyFriendly),
      };
    });

    return {
      day: i + 1,
      date: currentDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
      dailyBudget,
      activities,
    };
  });

  const summaryInterests = interests.length > 0 ? interests.join(', ') : 'culture and food';

  return {
    destination,
    totalDays: days,
    travelType,
    weather,
    totalBudget,
    days: itineraryDays,
    tips: getTravelTips(formData, weather.condition, destination),
    imageUrl: '',
    budgetBreakdown: buildBudgetBreakdown(totalBudget, budgetLevel),
    packingChecklist: buildPackingChecklist(formData, weather.condition),
    travelChecklist: buildTravelChecklist(formData),
    assistantHighlights: {
      summary: `Built for a ${tripPace} ${days}-day ${travelType} trip with extra weight on ${summaryInterests}.`,
      weatherNote:
        weather.condition === 'Rainy'
          ? 'Your plan leans on flexible indoor backups because showers are likely.'
          : weather.condition === 'Hot'
            ? 'The schedule favors easier pacing in warmer hours and stronger daytime hydration advice.'
            : 'The weather supports a balanced mix of outdoor exploration and leisurely stops.',
      paceNote:
        tripPace === 'relaxed'
          ? 'Expect fewer stops per day, more breathing room, and easier recovery between activities.'
          : 'This plan maximizes each day with fuller activity blocks and tighter transitions.',
      interestNote: `Priority categories were chosen from your interests so the itinerary feels more personal and less generic.`,
    },
  };
};
