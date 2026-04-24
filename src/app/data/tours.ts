export interface Tour {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  duration: string;
  category: string;
  bestSeller?: boolean;
  image: string;
  description: string;
  images: string[];
  included: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
}

export const tours: Tour[] = [
  {
    id: "1",
    title: "Tropical Paradise Beach Escape",
    location: "Maldives",
    price: 1899,
    rating: 4.9,
    reviews: 342,
    duration: "7 days",
    category: "Beach",
    bestSeller: true,
    image: "https://images.unsplash.com/photo-1660289647786-bfa5e9e8ba16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2UlMjBkZXN0aW5hdGlvbnxlbnwxfHx8fDE3NzIzMDY0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Experience the ultimate tropical getaway in the pristine waters of the Maldives. Relax on white sand beaches, snorkel in crystal-clear lagoons, and enjoy world-class hospitality.",
    images: [
      "https://images.unsplash.com/photo-1660289647786-bfa5e9e8ba16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2UlMjBkZXN0aW5hdGlvbnxlbnwxfHx8fDE3NzIzMDY0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1648997934392-7213a9ce50b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB5YWNodCUyMHNhaWxpbmclMjBvY2VhbnxlbnwxfHx8fDE3NzIyOTU5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    included: [
      "Luxury resort accommodation",
      "Daily breakfast and dinner",
      "Airport transfers",
      "Snorkeling equipment",
      "Sunset cruise",
      "Spa treatment"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Welcome",
        description: "Arrive at Malé International Airport and transfer to your luxury resort. Settle in and enjoy a welcome dinner."
      },
      {
        day: 2,
        title: "Beach Day & Snorkeling",
        description: "Relax on pristine beaches and explore vibrant coral reefs with complimentary snorkeling equipment."
      },
      {
        day: 3,
        title: "Island Hopping",
        description: "Visit nearby local islands and experience authentic Maldivian culture and cuisine."
      },
      {
        day: 4,
        title: "Water Sports",
        description: "Try kayaking, paddleboarding, and jet skiing in the turquoise waters."
      },
      {
        day: 5,
        title: "Sunset Cruise",
        description: "Enjoy a romantic sunset cruise with champagne and canapés."
      },
      {
        day: 6,
        title: "Spa & Relaxation",
        description: "Indulge in a rejuvenating spa treatment and enjoy your last full day in paradise."
      },
      {
        day: 7,
        title: "Departure",
        description: "Enjoy a final breakfast before transferring to the airport for your departure."
      }
    ]
  },
  {
    id: "2",
    title: "Mountain Hiking Adventure",
    location: "Swiss Alps",
    price: 2199,
    rating: 4.8,
    reviews: 287,
    duration: "5 days",
    category: "Adventure",
    bestSeller: true,
    image: "https://images.unsplash.com/photo-1767909599777-f73144edcfc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMGFkdmVudHVyZSUyMHNjZW5pY3xlbnwxfHx8fDE3NzIyNTk2OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Trek through breathtaking alpine landscapes with expert guides. Experience stunning mountain views, charming villages, and authentic Swiss hospitality.",
    images: [
      "https://images.unsplash.com/photo-1767909599777-f73144edcfc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhpa2luZyUyMGFkdmVudHVyZSUyMHNjZW5pY3xlbnwxfHx8fDE3NzIyNTk2OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    included: [
      "Mountain lodge accommodation",
      "All meals included",
      "Professional hiking guide",
      "Hiking equipment rental",
      "Cable car passes",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Zermatt",
        description: "Arrive in the charming mountain village of Zermatt and meet your guide."
      },
      {
        day: 2,
        title: "Matterhorn Base Trek",
        description: "Hike to the base of the iconic Matterhorn with stunning alpine views."
      },
      {
        day: 3,
        title: "Glacier Trail",
        description: "Trek along ancient glacier paths with breathtaking scenery."
      },
      {
        day: 4,
        title: "Alpine Lakes Circuit",
        description: "Hike around pristine alpine lakes and enjoy a picnic lunch in nature."
      },
      {
        day: 5,
        title: "Departure",
        description: "Final breakfast and transfer to Geneva for your departure flight."
      }
    ]
  },
  {
    id: "3",
    title: "Historic European City Tour",
    location: "Rome, Italy",
    price: 1599,
    rating: 4.7,
    reviews: 456,
    duration: "6 days",
    category: "Culture",
    bestSeller: true,
    image: "https://images.unsplash.com/photo-1765621026270-15301e0c538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjBhcmNoaXRlY3R1cmUlMjBoaXN0b3JpY3xlbnwxfHx8fDE3NzIzMDY0NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Explore the eternal city of Rome with skip-the-line access to major attractions. Walk through 2,000 years of history from the Colosseum to the Vatican.",
    images: [
      "https://images.unsplash.com/photo-1765621026270-15301e0c538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGNpdHklMjBhcmNoaXRlY3R1cmUlMjBoaXN0b3JpY3xlbnwxfHx8fDE3NzIzMDY0NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    included: [
      "4-star hotel accommodation",
      "Daily breakfast",
      "Skip-the-line tickets",
      "Professional tour guide",
      "Airport transfers",
      "Food tour experience"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Ancient Rome",
        description: "Check in and explore the Colosseum, Roman Forum, and Palatine Hill."
      },
      {
        day: 2,
        title: "Vatican City",
        description: "Visit the Vatican Museums, Sistine Chapel, and St. Peter's Basilica."
      },
      {
        day: 3,
        title: "Baroque Rome",
        description: "Discover the Trevi Fountain, Spanish Steps, and Pantheon."
      },
      {
        day: 4,
        title: "Food & Wine Tour",
        description: "Experience authentic Roman cuisine with a guided food tour."
      },
      {
        day: 5,
        title: "Day Trip to Tivoli",
        description: "Visit the stunning Villa d'Este and Hadrian's Villa."
      },
      {
        day: 6,
        title: "Departure",
        description: "Final breakfast and airport transfer for your departure."
      }
    ]
  },
  {
    id: "4",
    title: "African Safari Experience",
    location: "Kenya",
    price: 3499,
    rating: 5.0,
    reviews: 198,
    duration: "8 days",
    category: "Wildlife",
    bestSeller: false,
    image: "https://images.unsplash.com/photo-1729359035276-189519a4b072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjB3aWxkbGlmZSUyMGFmcmljYSUyMGFuaW1hbHN8ZW58MXx8fHwxNzcyMzA2NDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Witness the Great Migration and spot the Big Five in Kenya's premier national parks. Luxury safari lodges and expert rangers ensure an unforgettable adventure.",
    images: [
      "https://images.unsplash.com/photo-1729359035276-189519a4b072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZhcmklMjB3aWxkbGlmZSUyMGFmcmljYSUyMGFuaW1hbHN8ZW58MXx8fHwxNzcyMzA2NDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    included: [
      "Luxury safari lodge accommodation",
      "All meals and beverages",
      "Game drives (morning & evening)",
      "Professional safari guide",
      "Park entrance fees",
      "Domestic flights"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Nairobi",
        description: "Arrive in Nairobi and transfer to your hotel. Evening briefing with your guide."
      },
      {
        day: 2,
        title: "Masai Mara",
        description: "Fly to Masai Mara for your first game drive in search of the Big Five."
      },
      {
        day: 3,
        title: "Full Day Safari",
        description: "Morning and evening game drives with a picnic lunch in the reserve."
      },
      {
        day: 4,
        title: "Masai Village Visit",
        description: "Experience local Masai culture and continue wildlife viewing."
      },
      {
        day: 5,
        title: "Lake Nakuru",
        description: "Transfer to Lake Nakuru National Park, famous for flamingos and rhinos."
      },
      {
        day: 6,
        title: "Amboseli National Park",
        description: "Travel to Amboseli with views of Mount Kilimanjaro and elephant herds."
      },
      {
        day: 7,
        title: "Final Safari",
        description: "Last game drive and transfer back to Nairobi."
      },
      {
        day: 8,
        title: "Departure",
        description: "Airport transfer for your international flight home."
      }
    ]
  },
  {
    id: "5",
    title: "Japan Cultural Journey",
    location: "Tokyo & Kyoto",
    price: 2799,
    rating: 4.9,
    reviews: 312,
    duration: "10 days",
    category: "Culture",
    bestSeller: false,
    image: "https://images.unsplash.com/photo-1712244876693-a89f6172178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMHRlbXBsZSUyMGNoZXJyeSUyMGJsb3Nzb218ZW58MXx8fHwxNzcyMzA2NDY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Immerse yourself in Japanese culture from ancient temples to modern Tokyo. Experience tea ceremonies, stay in traditional ryokans, and explore historic sites.",
    images: [
      "https://images.unsplash.com/photo-1712244876693-a89f6172178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMHRlbXBsZSUyMGNoZXJyeSUyMGJsb3Nzb218ZW58MXx8fHwxNzcyMzA2NDY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    included: [
      "Hotel & ryokan accommodation",
      "Daily breakfast",
      "JR Rail Pass (7 days)",
      "Professional guide",
      "Tea ceremony experience",
      "Cooking class"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Tokyo",
        description: "Arrive and explore the vibrant Shibuya and Harajuku districts."
      },
      {
        day: 2,
        title: "Modern Tokyo",
        description: "Visit Tokyo Tower, teamLab Borderless, and the Imperial Palace gardens."
      },
      {
        day: 3,
        title: "Day Trip to Nikko",
        description: "Explore UNESCO World Heritage shrines and natural beauty."
      },
      {
        day: 4,
        title: "Mt. Fuji & Hakone",
        description: "Visit Mt. Fuji area and stay in a traditional onsen ryokan."
      },
      {
        day: 5,
        title: "Journey to Kyoto",
        description: "Bullet train to Kyoto and visit Fushimi Inari Shrine."
      },
      {
        day: 6,
        title: "Kyoto Temples",
        description: "Explore Kinkaku-ji, Ryoan-ji, and Arashiyama Bamboo Grove."
      },
      {
        day: 7,
        title: "Tea Ceremony & Gion",
        description: "Participate in a traditional tea ceremony and explore Gion district."
      },
      {
        day: 8,
        title: "Nara Day Trip",
        description: "Visit Nara's friendly deer and Todai-ji Temple."
      },
      {
        day: 9,
        title: "Free Day in Kyoto",
        description: "Explore at your own pace or join optional activities."
      },
      {
        day: 10,
        title: "Departure",
        description: "Transfer to Kansai Airport for your departure flight."
      }
    ]
  },
  {
    id: "6",
    title: "Northern Lights Quest",
    location: "Iceland",
    price: 2299,
    rating: 4.8,
    reviews: 223,
    duration: "6 days",
    category: "Adventure",
    bestSeller: false,
    image: "https://images.unsplash.com/photo-1666003400042-a9e68d6bff0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYSUyMGJvcmVhbGlzfGVufDF8fHx8MTc3MjI3NDgwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Chase the magical Aurora Borealis across Iceland's stunning landscapes. Explore glaciers, geothermal pools, and volcanic terrain while hunting for nature's greatest light show.",
    images: [
      "https://images.unsplash.com/photo-1666003400042-a9e68d6bff0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYSUyMGJvcmVhbGlzfGVufDF8fHx8MTc3MjI3NDgwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    included: [
      "Hotel accommodation",
      "Daily breakfast",
      "Northern Lights tours",
      "Blue Lagoon entry",
      "Glacier hiking",
      "All transfers"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Blue Lagoon",
        description: "Arrive in Reykjavik and relax in the famous Blue Lagoon."
      },
      {
        day: 2,
        title: "Golden Circle",
        description: "Visit Thingvellir National Park, Geysir, and Gullfoss waterfall."
      },
      {
        day: 3,
        title: "South Coast Adventure",
        description: "Explore black sand beaches, waterfalls, and glacier views."
      },
      {
        day: 4,
        title: "Glacier Hiking",
        description: "Guided hike on an ancient glacier and ice cave exploration."
      },
      {
        day: 5,
        title: "Northern Lights Hunt",
        description: "Dedicated Northern Lights tour in optimal viewing locations."
      },
      {
        day: 6,
        title: "Departure",
        description: "Final morning in Reykjavik before airport transfer."
      }
    ]
  },
  {
    id: "7",
    title: "Desert Dunes Adventure",
    location: "Morocco",
    price: 1799,
    rating: 4.6,
    reviews: 167,
    duration: "7 days",
    category: "Adventure",
    bestSeller: false,
    image: "https://images.unsplash.com/photo-1599220191013-71404f71e8df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzYW5kJTIwZHVuZXMlMjBzdW5zZXR8ZW58MXx8fHwxNzcyMjUyMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Journey through Morocco's Sahara Desert on camelback. Experience Berber hospitality, sleep under the stars, and explore ancient kasbahs.",
    images: [
      "https://images.unsplash.com/photo-1599220191013-71404f71e8df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzYW5kJTIwZHVuZXMlMjBzdW5zZXR8ZW58MXx8fHwxNzcyMjUyMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    included: [
      "Riad & desert camp accommodation",
      "All meals included",
      "Camel trekking",
      "4x4 desert transport",
      "Professional guide",
      "Airport transfers"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Marrakech",
        description: "Arrive and explore the vibrant Jemaa el-Fnaa square and souks."
      },
      {
        day: 2,
        title: "Atlas Mountains",
        description: "Drive through the High Atlas Mountains to the desert gateway."
      },
      {
        day: 3,
        title: "Kasbah Route",
        description: "Visit the UNESCO-listed Ait Benhaddou kasbah."
      },
      {
        day: 4,
        title: "Sahara Desert",
        description: "Camel trek into the dunes and camp under the stars."
      },
      {
        day: 5,
        title: "Desert Experience",
        description: "Sunrise in the Sahara and 4x4 tour of the dunes."
      },
      {
        day: 6,
        title: "Return to Marrakech",
        description: "Journey back through the Draa Valley."
      },
      {
        day: 7,
        title: "Departure",
        description: "Final breakfast and airport transfer."
      }
    ]
  },
  {
    id: "8",
    title: "Caribbean Island Hopping",
    location: "Caribbean Islands",
    price: 2499,
    rating: 4.7,
    reviews: 289,
    duration: "9 days",
    category: "Beach",
    bestSeller: false,
    image: "https://images.unsplash.com/photo-1654868631247-a669007d88db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRvdXJpc3RzJTIwc21pbGluZyUyMHRyYXZlbHxlbnwxfHx8fDE3NzIzMDY0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Sail through paradise visiting multiple Caribbean islands. Snorkel vibrant reefs, relax on pristine beaches, and experience island culture.",
    images: [
      "https://images.unsplash.com/photo-1654868631247-a669007d88db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRvdXJpc3RzJTIwc21pbGluZyUyMHRyYXZlbHxlbnwxfHx8fDE3NzIzMDY0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    included: [
      "Beachfront accommodation",
      "Daily breakfast & lunch",
      "Inter-island transfers",
      "Snorkeling equipment",
      "Water sports activities",
      "Sunset catamaran cruise"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Barbados",
        description: "Check in to your beachfront resort and enjoy the sunset."
      },
      {
        day: 2,
        title: "Barbados Exploration",
        description: "Snorkel with sea turtles and explore the island."
      },
      {
        day: 3,
        title: "St. Lucia",
        description: "Ferry to St. Lucia and visit the iconic Pitons."
      },
      {
        day: 4,
        title: "Rainforest & Beach",
        description: "Hike through rainforest and relax on Anse Chastanet beach."
      },
      {
        day: 5,
        title: "Grenada",
        description: "Travel to the 'Spice Isle' and tour a nutmeg plantation."
      },
      {
        day: 6,
        title: "Underwater Sculpture Park",
        description: "Snorkel the famous underwater sculpture park."
      },
      {
        day: 7,
        title: "Tobago Cays",
        description: "Day trip to the pristine Tobago Cays marine park."
      },
      {
        day: 8,
        title: "Final Beach Day",
        description: "Relax and enjoy water sports on your final full day."
      },
      {
        day: 9,
        title: "Departure",
        description: "Airport transfer for your departure flight."
      }
    ]
  }
];

export const categories = ["All", "Beach", "Adventure", "Culture", "Wildlife"];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    location: "San Francisco, USA",
    rating: 5,
    comment: "The Maldives trip was absolutely incredible! Every detail was perfectly planned. Our guide was knowledgeable and the resort exceeded expectations. Highly recommend!",
    image: "https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyMzA2MTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tour: "Tropical Paradise Beach Escape"
  },
  {
    id: 2,
    name: "James Okonkwo",
    location: "Lagos, Nigeria",
    rating: 5,
    comment: "The Kenya safari was a dream come true. Seeing the Big Five in their natural habitat was breathtaking. The luxury lodges and professional guides made it unforgettable.",
    image: "https://images.unsplash.com/photo-1614807536394-cd67bd4a634b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwc21pbGluZyUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjMwNjQ2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tour: "African Safari Experience"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    comment: "Japan exceeded all my expectations! The mix of ancient traditions and modern culture was fascinating. The ryokan stay and tea ceremony were highlights. Can't wait to go back!",
    image: "https://images.unsplash.com/photo-1753161025207-219ad023d7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdCUyMGN1c3RvbWVyfGVufDF8fHx8MTc3MjMwNjQ2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tour: "Japan Cultural Journey"
  }
];
