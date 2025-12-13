export type UserRole = 'donor' | 'receiver';

export interface FoodItem {
  id: string;
  donorName: string;
  contact: string;
  image: string; // Base64 string
  title: string;
  description: string;
  quantity: string;
  location: string;
  coords?: { lat: number; lng: number }; // Optional for map simulation
  status: 'available' | 'claimed';
  createdAt: number;
}

export interface FoodRequest {
  id: string;
  receiverName: string;
  contact: string;
  itemRequested: string;
  quantity: string;
  status: 'pending' | 'fulfilled';
  createdAt: number;
}

export interface GeminiFoodAnalysis {
  title: string;
  description: string;
  quantityEstimation: string;
  category: string;
}
