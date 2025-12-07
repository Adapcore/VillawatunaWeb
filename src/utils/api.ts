// API utilities for fetching data from JSON files
import { roomsData } from '../json/rooms';
import { banquetSpacesData } from '../json/banquet-spaces';
import { galleryData } from '../json/gallery';
import { newsData } from '../json/news';
import { menuData } from '../json/menu';
import { UMBRACO_API_BASE_URL } from './config';

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

/**
 * Fetch menu content and categories from Umbraco Content Delivery API
 * Dynamically finds the menu ID from root, then fetches categories
 * @param parentId - Optional: The Umbraco content ID to fetch children from (if not provided, will auto-detect)
 * @returns Object containing menu item (with title) and categories array
 */
export async function fetchMenuFromUmbraco(): Promise<Menu> {
  try {
    let menu: Menu = {
      data: null,
      categories: [],
      subcategories: new Map(),
      items: new Map(),
    };

    menu.data = await fetchContentByType("menu");    
    if (!menu.data) {
      throw new Error('Could not fetch menu content type from Umbraco');
    }

    const descendantsChildren = await fetchDescendantsChildrenByID(menu.data.id);
    if (!descendantsChildren) {
      throw new Error('Could not fetch descendants children from Umbraco');
    }
    
    for (const item of descendantsChildren) {
      if (item?.contentType) {
        if (item.contentType === 'menuCategory') {
          menu.categories.push(item);
        }
        else if (item.contentType === 'menuSubcategory') {
          let path: string | undefined = item.route?.path;
          // Delete last item from path and assign it
          if (item.route?.path) {
            const pathParts = item.route.path.split('/');
            pathParts.pop();
            pathParts.pop();
            path = pathParts.join('/')+'/';
          }
          if (menu.subcategories.has(path)) {
            menu.subcategories.get(path)?.push(item);
          }
          else {
            menu.subcategories.set(path, [item]);
          }
        }
        else if (item.contentType === 'menuItem') {
          let path: string | undefined = item.route?.path;
          // Delete last item from path and assign it
          if (item.route?.path) {
            const pathParts = item.route.path.split('/');
            pathParts.pop();
            pathParts.pop();
            path = pathParts.join('/')+'/';
          }
          if (menu.items.has(path)) {
            menu.items.get(path)?.push(populateMenuItem(item));
          }
          else {
            menu.items.set(path, [populateMenuItem(item)]);
          }
        }
      }
    }

    if(menu.categories.length > 0) {
      menu.categories.sort((a, b) => a.properties?.page - b.properties?.page);
    }
    
    return menu;    
  } catch (error) {
    console.error('Error fetching menu data from Umbraco:', error);
    // Fallback to empty data if API fails
    return null as unknown as Menu;
  }
}


/**
 * Fetch menu items (menuItem) for a specific subcategory
 * @param subcategoryId - The Umbraco subcategory ID to fetch children from
 * @returns Array of MenuItem objects mapped from Umbraco data
 */
export function populateMenuItem(item: UmbracoContentItem): MenuItem { 
    // Extract content - handle both string and object formats (Umbraco rich text editor returns object with markup property)
    let contentValue: string | undefined = undefined;
    if (item.properties?.content) {
      if (typeof item.properties?.content === 'string') {
        contentValue = item.properties?.content;
      } else if (typeof item.properties?.content === 'object' && item.properties?.content !== null && 'markup' in item.properties?.content) {
        contentValue = (item.properties?.content as { markup: string }).markup;
      }
    }

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
            url = url.startsWith('/') ? `${UMBRACO_API_BASE_URL}${url}` : `${UMBRACO_API_BASE_URL}/${url}`;
          }
          
          return url;
    };

    // Try mainImage first, then images
    let imageUrl = extractImageUrl(item.properties?.mainImage) || extractImageUrl(item.properties?.images);

    let menuItem: MenuItem = {  
      id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0,
      name: item.properties?.title || item.name || '',
      description: item.properties?.description || '',
      price: item.properties?.price ? item.properties?.price / 100 : 0,
      image: imageUrl,
      ingredients: contentValue,
    };

    return menuItem;
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
    name?: string;
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

export interface Menu {
  data: UmbracoContentItem | null;
  categories: UmbracoContentItem[];
  subcategories: Map<string | undefined, UmbracoContentItem[]>;
  items: Map<string | undefined, MenuItem[]>;  
}

export interface UmbracoContentResponse {
  items: UmbracoContentItem[];
  total: number;
}

export interface UmbracoSingleItemResponse extends UmbracoContentItem {}

/**
 * Fetch root item from Umbraco Content Delivery API
 * @returns Root content item
 */
export async function fetchRootItemFromUmbraco(): Promise<UmbracoContentItem | null> {
  try {
    const apiUrl = `${UMBRACO_API_BASE_URL}/umbraco/delivery/api/v2/content/item/`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText}`);
    }

    const data: UmbracoSingleItemResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching root item from Umbraco:', error);
    return null;
  }
}

/**
 * Find menu content type from root item's children
 * @param rootId - The root item ID to fetch children from
 * @returns Menu content item or null if not found
 */
export async function findMenuContent(rootId: string): Promise<UmbracoContentItem | null> {
  try {
    const apiUrl = `${UMBRACO_API_BASE_URL}/umbraco/delivery/api/v2/content/?fetch=children:${rootId}&sort=sortOrder:asc`;
    
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
    
    // Find item with contentType "menu"
    const menuItem = data.items?.find((item) => item.contentType === 'menu');
    
    if (menuItem) {
      console.log(`Found menu content type with ID: ${menuItem.id}`);
      return menuItem;
    }
    
    console.warn('No menu content type found in root children');
    return null;
  } catch (error) {
    console.error('Error finding menu content:', error);
    return null;
  }
}

/**
 * Fetch item by type to get its properties (like title)
 * @param contentType - The type of content to fetch
 * @returns content item or null if not found
 */
export async function fetchContentByType(contentType: string): Promise<UmbracoContentItem | null> {
  try {
    const apiUrl = `${UMBRACO_API_BASE_URL}/umbraco/delivery/api/v2/content?filter=contentType:${contentType}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText}`);
    }

    const data: UmbracoSingleItemResponse = (await response.json()).items[0];
    return data;
  } catch (error) {
    console.error(`Error fetching content by ${contentType}:`, error);
    return null;
  }
}

/**
 * Fetch menu item by type to get its properties (like title)
 * @param contentType - The type of content to fetch
 * @returns content item or null if not found
 */
export async function fetchDescendantsChildrenByID(contentId: string): Promise<Array<UmbracoContentItem> | null> {
  try {
    const apiUrl = `${UMBRACO_API_BASE_URL}/umbraco/delivery/api/v2/content?fetch=descendants:${contentId}&take=160&sort=level:asc`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText}`);
    }

    const data: Array<UmbracoSingleItemResponse> = (await response.json()).items;
    return data;
  } 
  catch (error) {
    console.error(`Error fetching Descendants Children by ${contentId}:`, error);
    return [];
  }
}

/**
 * Fetch menu item by ID to get its properties (like title)
 * @param menuId - The menu item ID
 * @returns Menu content item or null if not found
 */
export async function fetchMenuContentById(menuId: string): Promise<UmbracoContentItem | null> {
  try {
    const apiUrl = `${UMBRACO_API_BASE_URL}/umbraco/delivery/api/v2/content/item/${menuId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText}`);
    }

    const data: UmbracoSingleItemResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching menu content by ID ${menuId}:`, error);
    return null;
  }
}

/**
 * Fetch menu content and categories from Umbraco Content Delivery API
 * Dynamically finds the menu ID from root, then fetches categories
 * @param parentId - Optional: The Umbraco content ID to fetch children from (if not provided, will auto-detect)
 * @returns Object containing menu item (with title) and categories array
 */
export async function fetchMenuDataFromUmbraco(
  parentId?: string
): Promise<{ menuItem: UmbracoContentItem | null; categories: UmbracoContentItem[] }> {
  try {
    let menuId = parentId;
    let menuItem: UmbracoContentItem | null = null;
    
    // If parentId not provided, dynamically find it
    if (!menuId) {
      // Step 1: Fetch root item
      const rootItem = await fetchRootItemFromUmbraco();
      if (!rootItem) {
        throw new Error('Could not fetch root item from Umbraco');
      }
      
      // Step 2: Find menu content type from root's children
      const foundMenuItem = await findMenuContent(rootItem.id);
      if (!foundMenuItem) {
        throw new Error('Could not find menu content type in root children');
      }
      menuId = foundMenuItem.id;
      
      // Step 2b: Fetch full menu item details to get all properties (like title)
      const fullMenuItem = await fetchMenuContentById(menuId);
      menuItem = fullMenuItem || foundMenuItem; // Use full item if available, otherwise use basic item
    } else {
      // If parentId provided, fetch the menu item to get its properties
      menuItem = await fetchMenuContentById(menuId);
    }
    
    // Step 3: Fetch menu categories using the menu ID (sorted by original Umbraco sort order)
    const apiUrl = `${UMBRACO_API_BASE_URL}/umbraco/delivery/api/v2/content/?fetch=children:${menuId}&sort=sortOrder:asc`;
    
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
    
    return { menuItem, categories };
  } catch (error) {
    console.error('Error fetching menu data from Umbraco:', error);
    // Fallback to empty data if API fails
    return { menuItem: null, categories: [] };
  }
}

/**
 * Fetch menu categories from Umbraco Content Delivery API
 * Dynamically finds the menu ID from root, then fetches categories
 * @param parentId - Optional: The Umbraco content ID to fetch children from (if not provided, will auto-detect)
 * @returns Array of menu category objects with id and name
 */
export async function fetchMenuCategoriesFromUmbraco(
  parentId?: string
): Promise<UmbracoContentItem[]> {
  const { categories } = await fetchMenuDataFromUmbraco(parentId);
  return categories;
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
    const apiUrl = `${UMBRACO_API_BASE_URL}/umbraco/delivery/api/v2/content/?fetch=children:${categoryId}&sort=sortOrder:asc`;
    
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
    const apiUrl = `${UMBRACO_API_BASE_URL}/umbraco/delivery/api/v2/content/?fetch=children:${subcategoryId}&sort=sortOrder:asc`;
    
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
            url = url.startsWith('/') ? `${UMBRACO_API_BASE_URL}${url}` : `${UMBRACO_API_BASE_URL}/${url}`;
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
        
        // Extract content - handle both string and object formats (Umbraco rich text editor returns object with markup property)
        let contentValue: string | undefined = undefined;
        if (properties.content) {
          if (typeof properties.content === 'string') {
            contentValue = properties.content;
          } else if (typeof properties.content === 'object' && properties.content !== null && 'markup' in properties.content) {
            contentValue = properties.content.markup;
          }
        }
        
        return {
          id: numericId,
          name: properties.title || item.name || '',
          description: properties.description || '',
          price: price,
          image: imageUrl || `menu-item-${index}`,
          ingredients: contentValue,
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
  ingredients?: string | { markup?: string; blocks?: any[] };
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
  openingHoursText?: string;
}