import { UMBRACO_API_BASE_URL } from '../utils/config';

export interface UmbracoContentItem {
  id: string;
  name: string;
  contentType: string;
  properties?: {
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
    return (await response.json()).items[0];
  } catch (error) {
    console.error('Error fetching root item from Umbraco:', error);
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
    return (await response.json()).items[0];
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
    return (await response.json()).items;
  }
  catch (error) {
    console.error(`Error fetching Descendants Children by ${contentId}:`, error);
    return [];
  }
}

export function extractImageUrlFromUmbracoImage(image: string | UmbracoImage | UmbracoImage[] | null | undefined): string  {
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
}