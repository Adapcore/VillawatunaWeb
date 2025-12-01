// API utilities for fetching data from JSON files
import { roomsData } from '../json/rooms';
import { banquetSpacesData } from '../json/banquet-spaces';
import { galleryData } from '../json/gallery';
import { newsData } from '../json/news';
import { menuData } from '../json/menu';

export async function fetchRooms() {
  try {
    // Simulate API call with a promise
    return await Promise.resolve(roomsData);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    // Fallback data
    return { rooms: [] };
  }
}

export async function fetchBanquetSpaces() {
  try {
    return await Promise.resolve(banquetSpacesData);
  } catch (error) {
    console.error('Error fetching banquet spaces:', error);
    return { spaces: [] };
  }
}

export async function fetchGallery() {
  try {
    return await Promise.resolve(galleryData);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return { images: [] };
  }
}

export async function fetchNews() {
  try {
    return await Promise.resolve(newsData);
  } catch (error) {
    console.error('Error fetching news:', error);
    return { news: [], gallery_preview: [] };
  }
}

export async function fetchMenu() {
  try {
    return await Promise.resolve(menuData);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return { categories: [] };
  }
}

// Types
export interface Room {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  size?: string;
  guests?: string;
  bedrooms?: { name: string; beds: string }[];
  keyAmenities?: string[];
  images: string[];
  accessories: string[];
  facilities: string[];
}

export interface BanquetSpace {
  id: number;
  name: string;
  capacity: string;
  image: string;
  rating: number;
  description: string;
}

export interface GalleryImage {
  id: number;
  category: string;
  alt: string;
  image: string;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  category: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients?: string;
}

export interface MenuSubsection {
  id: number;
  name: string;
  items: MenuItem[];
}

export interface MenuCategory {
  id: number;
  name: string;
  items?: MenuItem[];
  subsections?: MenuSubsection[];
}