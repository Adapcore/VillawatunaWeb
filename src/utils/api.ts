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
export interface UmbracoImage {
  url?: string;
  mediaType?: string;
  name?: string;
  width?: number;
  height?: number;
  focalPoint?: {
    left?: number;
    top?: number;
  };
}

export interface UmbracoContentItem {
  id: string;
  name: string;
  contentType: string;
  properties?: {
    title?: string;
    description?: string | null;
    mainImage?: string | UmbracoImage | UmbracoImage[] | null;
    images?: string | UmbracoImage | UmbracoImage[] | null;
    price?: number;
    content?: string | null;
    noteRequired?: boolean;
    [key: string]: any;
  };
  url?: string;
  route?: {
    path?: string;
    startItem?: {
      id?: string;
      path?: string;
    };
  };
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
 * @returns Array of subcategory objects with id and name
 */
export async function fetchSubcategoriesFromUmbraco(
  categoryId: string
): Promise<UmbracoContentItem[]> {
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
    
    // Filter for menuSubcategory content type and return items with id and name
    const subcategories = data.items?.filter((item) => item.contentType === 'menuSubcategory') || [];
    
    return subcategories;
  } catch (error) {
    console.error(`Error fetching subcategories for ${categoryId}:`, error);
    return [];
  }
}

/**
 * Fetch menu items (menuItem) for a specific subcategory
 * @param subcategoryId - The Umbraco subcategory ID to fetch children from
 * @returns Array of MenuItem objects mapped from Umbraco data
 */
export async function fetchMenuItemsFromUmbraco(
  subcategoryId: string
): Promise<MenuItem[]> {
  try {
    const apiUrl = `https://localhost:44343/umbraco/delivery/api/v2/content/?fetch=children:${subcategoryId}`;
    
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
    
    // Filter for menuItem content type and map to MenuItem structure
    const menuItems: MenuItem[] = (data.items || [])
      .filter((item) => item.contentType === 'menuItem')
      .map((item, index) => {
        const properties = item.properties || {};
        
        // Extract image URL (handle string, object, and array formats)
        let imageUrl = '';
        
        const extractImageUrl = (image: string | UmbracoImage | UmbracoImage[] | null | undefined): string => {
          if (!image) return '';
          
          let url = '';
          
          // Handle string URL
          if (typeof image === 'string') {
            url = image;
          }
          // Handle array of images (take first one)
          else if (Array.isArray(image)) {
            if (image.length > 0 && image[0].url) {
              url = image[0].url;
            }
          }
          // Handle single image object
          else if (typeof image === 'object' && image.url) {
            url = image.url;
          }
          
          // Convert relative URLs to absolute URLs if needed
          if (url && !url.startsWith('http') && !url.startsWith('//')) {
            // If it's a relative path, prepend Umbraco base URL
            const umbracoBase = 'https://localhost:44343';
            url = url.startsWith('/') ? `${umbracoBase}${url}` : `${umbracoBase}/${url}`;
          }
          
          return url;
        };
        
        // Try mainImage first, then images
        imageUrl = extractImageUrl(properties.mainImage) || extractImageUrl(properties.images);
        
        // Generate a numeric ID from the Umbraco ID or use index
        const numericId = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || index + 1;
        
        // Convert price from cents to dollars (900 -> 9.00, but stored as 9 in MenuItem)
        // Based on the code, prices are multiplied by 100 when displayed, so 900 should be stored as 9
        const price = properties.price ? properties.price / 100 : 0;
        
        return {
          id: numericId,
          name: properties.title || item.name || '',
          description: properties.description || '',
          price: price,
          image: imageUrl || `menu-item-${index}`,
          ingredients: properties.content || undefined,
        };
      });
    
    return menuItems;
  } catch (error) {
    console.error(`Error fetching menu items for ${subcategoryId}:`, error);
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