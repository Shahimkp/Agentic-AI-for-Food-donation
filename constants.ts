import { FoodItem } from './types';

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    donorName: 'Fresh Bakery',
    contact: '555-0101',
    image: 'https://picsum.photos/seed/bread/400/300',
    title: 'Sourdough Loaves',
    description: 'Freshly baked sourdough bread from this morning. Perfect condition.',
    quantity: '5 loaves',
    location: '123 Baker St, San Francisco, CA',
    coords: { lat: 37.7749, lng: -122.4194 },
    status: 'available',
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    donorName: 'Corporate Catering',
    contact: '555-0102',
    image: 'https://picsum.photos/seed/salad/400/300',
    title: 'Mixed Green Salads',
    description: 'Individually packed mixed green salads with balsamic dressing on the side.',
    quantity: '12 boxes',
    location: '456 Tech Park, San Jose, CA',
    coords: { lat: 37.3382, lng: -121.8863 },
    status: 'available',
    createdAt: Date.now() - 7200000,
  },
];
