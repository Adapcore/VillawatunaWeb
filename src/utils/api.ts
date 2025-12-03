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

// Umbraco Content Delivery API
export interface UmbracoContentItem {
  id: string;
  name: string;
  contentType: string;
  properties?: {
    [key: string]: any;
  };
  url?: string;
}

export interface UmbracoContentResponse {
  items: UmbracoContentItem[];
  total: number;
}

/**
 * Fetch menu categories from Umbraco Content Delivery API
 * @param parentId - The Umbraco content ID to fetch children from
 * @returns Array of menu category objects with id and name
 */
export async function fetchMenuCategoriesFromUmbraco(
  parentId: string = '68c64598-62f8-4e8a-bd11-efead8d4f23f'
): Promise<UmbracoContentItem[]> {
  try {
    const apiUrl = `https://localhost:44343/umbraco/delivery/api/v2/content/?fetch=children:${parentId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText}`);
    }

    const data: UmbracoContentResponse = await response.json();
    
    // Filter for menuCategory content type and return items with id and name
    const categories = data.items?.filter((item) => item.contentType === 'menuCategory') || [];
    
    return categories;
  } catch (error) {
    console.error('Error fetching menu categories from Umbraco:', error);
    // Fallback to empty array if API fails
    return [];
  }
}

/**
 * Fetch subcategories (menuSubcategory) for a specific category
 * @param categoryId - The Umbraco category ID to fetch children from
 * @returns Array of subcategory names
 */
export async function fetchSubcategoriesFromUmbraco(
  categoryId: string
): Promise<string[]> {
  try {
    const apiUrl = `https://localhost:44343/umbraco/delivery/api/v2/content/?fetch=children:${categoryId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText}`);
    }

    const data: UmbracoContentResponse = await response.json();
    
    // Filter for menuSubcategory content type and extract names
    const subcategoryNames = data.items
      ?.filter((item) => item.contentType === 'menuSubcategory')
      .map((item) => item.name) || [];
    
    return subcategoryNames;
  } catch (error) {
    console.error(`Error fetching subcategories for ${categoryId}:`, error);
    return [];
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