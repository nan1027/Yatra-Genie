import { Itinerary, TripFormData, BUDGET_ESTIMATES } from '@/types/travel';

// Mock data generator for when APIs are not available
// This provides a realistic preview of the itinerary structure

export const generateMockItinerary = (formData: TripFormData): Itinerary => {
  const { destination, days, travelType, budgetLevel } = formData;
  const budgetInfo = BUDGET_ESTIMATES[budgetLevel];
  const dailyBudget = Math.floor((budgetInfo.min + budgetInfo.max) / 2);

  const mockPlaces = {
    monument: [
      { name: 'Historic Fort', description: 'Ancient fortress with stunning architecture' },
      { name: 'Royal Palace', description: 'Magnificent palace showcasing royal heritage' },
      { name: 'Ancient Temple', description: 'Sacred temple with intricate carvings' },
    ],
    food: [
      { name: 'Heritage Restaurant', description: 'Authentic local cuisine in royal ambiance' },
      { name: 'Street Food Market', description: 'Vibrant market with local delicacies' },
      { name: 'Rooftop Cafe', description: 'Scenic views with fusion dishes' },
    ],
    nature: [
      { name: 'Botanical Gardens', description: 'Lush gardens with exotic flora' },
      { name: 'Lake View Point', description: 'Serene lake with boating facilities' },
      { name: 'Mountain Trail', description: 'Scenic hiking path with panoramic views' },
    ],
    adventure: [
      { name: 'Adventure Park', description: 'Thrilling activities for all ages' },
      { name: 'Water Sports Center', description: 'Kayaking, rafting and more' },
      { name: 'Desert Safari', description: 'Camel rides and dune bashing' },
    ],
    culture: [
      { name: 'Art Gallery', description: 'Contemporary and traditional art exhibitions' },
      { name: 'Cultural Center', description: 'Traditional performances and workshops' },
      { name: 'Heritage Walk', description: 'Guided tour through historic lanes' },
    ],
    shopping: [
      { name: 'Traditional Bazaar', description: 'Handcrafts, textiles and spices' },
      { name: 'Artisan Market', description: 'Local craftsmen showcasing their work' },
      { name: 'Night Market', description: 'Vibrant shopping under the stars' },
    ],
  };

  const getTravelTips = () => {
    const baseTips = [
      `Best time to visit monuments is early morning to avoid crowds`,
      `Carry cash for small vendors and street food stalls`,
      `Respect local customs and dress modestly at religious sites`,
    ];

    if (travelType === 'solo') {
      baseTips.push('Join local walking tours to meet fellow travelers');
      baseTips.push('Share your itinerary with someone back home');
    } else if (travelType === 'family') {
      baseTips.push('Plan rest breaks for children between activities');
      baseTips.push('Look for family-friendly restaurants with varied menus');
    } else {
      baseTips.push('Book group activities in advance for better rates');
      baseTips.push('Evening cultural shows are great group experiences');
    }

    if (budgetLevel === 'low') {
      baseTips.push('Use public transport and shared autos for savings');
    } else if (budgetLevel === 'high') {
      baseTips.push('Pre-book luxury experiences for exclusive access');
    }

    return baseTips;
  };

  const generateDays = () => {
    const categories: Array<'monument' | 'food' | 'nature' | 'adventure' | 'culture' | 'shopping'> = 
      ['monument', 'food', 'nature', 'adventure', 'culture', 'shopping'];
    
    return Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const morningCat = categories[i % categories.length];
      const afternoonCat = categories[(i + 1) % categories.length];
      const eveningCat = 'food' as const;

      return {
        day: dayNum,
        date: date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' }),
        dailyBudget,
        activities: [
          {
            time: 'morning' as const,
            place: {
              id: `place-${dayNum}-morning`,
              name: `${destination} ${mockPlaces[morningCat][i % 3].name}`,
              category: morningCat,
              description: mockPlaces[morningCat][i % 3].description,
              budgetTier: budgetLevel,
              estimatedCost: Math.floor(dailyBudget * 0.3),
              duration: '2-3 hours',
              rating: 4.5,
            },
            tips: ['Arrive early for best experience', 'Carry water and sunscreen'],
          },
          {
            time: 'afternoon' as const,
            place: {
              id: `place-${dayNum}-afternoon`,
              name: `${destination} ${mockPlaces[afternoonCat][i % 3].name}`,
              category: afternoonCat,
              description: mockPlaces[afternoonCat][i % 3].description,
              budgetTier: budgetLevel,
              estimatedCost: Math.floor(dailyBudget * 0.4),
              duration: '3-4 hours',
              rating: 4.3,
            },
            tips: ['Take afternoon tea break', 'Best photography lighting at 4 PM'],
          },
          {
            time: 'evening' as const,
            place: {
              id: `place-${dayNum}-evening`,
              name: `${destination} ${mockPlaces[eveningCat][(i + 1) % 3].name}`,
              category: eveningCat,
              description: mockPlaces[eveningCat][(i + 1) % 3].description,
              budgetTier: budgetLevel,
              estimatedCost: Math.floor(dailyBudget * 0.3),
              duration: '2 hours',
              rating: 4.6,
            },
            tips: ['Try the local specialty', 'Reservations recommended'],
          },
        ],
      };
    });
  };

  return {
    destination,
    totalDays: days,
    travelType,
    weather: {
      temperature: Math.floor(Math.random() * 15) + 20,
      condition: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 30) + 40,
      icon: '☀️',
      description: 'Pleasant weather ideal for sightseeing',
    },
    totalBudget: dailyBudget * days,
    days: generateDays(),
    tips: getTravelTips(),
    imageUrl: '',
  };
};
