export const eventImages = {
  concert: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  singer: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
  workshop: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
  comedy: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80",
  food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80"
};

export const demoEvents = [
  {
    id: 1,
    eventName: "Arijit Singh Live In Concert",
    category: "MUSIC",
    location: "MCA International Stadium, Pune",
    eventDate: "2026-06-20",
    startTime: "19:00:00",
    description: "Experience a premium live music night with immersive stage lighting, rich vocals, and reserved seating.",
    image: eventImages.singer,
    price: 1500
  },
  {
    id: 2,
    eventName: "Java Full Stack Workshop",
    category: "WORKSHOP",
    location: "Hinjewadi Tech Park, Pune",
    eventDate: "2026-06-25",
    startTime: "10:00:00",
    description: "Hands-on workshop covering Spring Boot, React, deployment, and production API design.",
    image: eventImages.workshop,
    price: 999
  },
  {
    id: 3,
    eventName: "Standup Comedy Show",
    category: "CULTURAL",
    location: "Phoenix Auditorium, Mumbai",
    eventDate: "2026-07-15",
    startTime: "20:00:00",
    description: "A sharp, relaxed evening with popular comedians and reserved seating.",
    image: eventImages.comedy,
    price: 499
  },
  {
    id: 4,
    eventName: "Food Festival 2026",
    category: "CULTURAL",
    location: "Koregaon Park, Pune",
    eventDate: "2026-08-10",
    startTime: "12:00:00",
    description: "Regional food stalls, live counters, music, and family experiences.",
    image: eventImages.food,
    price: 0
  }
];

export const demoTickets = [
  { id: 1, ticketName: "VIP", price: 3000, availableQuantity: 120, description: "Best seats with lounge access" },
  { id: 2, ticketName: "Gold", price: 1500, availableQuantity: 200, description: "Great seats with good view" },
  { id: 3, ticketName: "General", price: 500, availableQuantity: 500, description: "Standard seating" }
];

export const demoBookings = [
  { id: "BKG0012", event: "Arijit Singh Live In Concert", date: "20 Jun 2026", tickets: 2, amount: 3000, status: "Confirmed" },
  { id: "BKG0011", event: "Java Full Stack Workshop", date: "25 Jun 2026", tickets: 1, amount: 999, status: "Confirmed" },
  { id: "BKG0010", event: "Standup Comedy Show", date: "15 Jul 2026", tickets: 2, amount: 998, status: "Cancelled" }
];

export const adminRows = [
  { id: "BKG0012", user: "Rahul Sharma", event: "Arijit Singh Live In Concert", amount: 6100, status: "Confirmed" },
  { id: "BKG0011", user: "Anjali Patil", event: "Java Full Stack Workshop", amount: 999, status: "Confirmed" },
  { id: "BKG0010", user: "Vikram Joshi", event: "Standup Comedy Show", amount: 998, status: "Cancelled" },
  { id: "BKG0009", user: "Sneha Kulkarni", event: "Food Festival 2026", amount: 0, status: "Confirmed" }
];
