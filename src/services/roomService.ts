import { fetchContentByType, fetchDescendantsChildrenByID, UmbracoContentItem, UmbracoImage, extractImageUrlFromUmbracoImage } from "./umbracoService";

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
  slug?: string;
}

export interface RoomCategory {
  id: string;
  title: string;
  path?: string;
  sortOrder?: number;
  mainImage?: string;
  description?: string;
  capacity?: string;
  size?: string;
}

export interface RoomsPage {
  title: string;
  description: string;
  bannerImage?: string;
  rooms: Room[];
  roomCategories?: RoomCategory[]; // Array of roomCategory items
}

export interface UmbracoRooms extends UmbracoContentItem {
  id: string;
  name: string;
  contentType: string;
  properties?: {
    title?: string;
    description?: string | null;
    bannerImage?: string | UmbracoImage | UmbracoImage[] | null;
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

/**
 * Fetch rooms page content and all room items from Umbraco Content Delivery API
 * Similar to menuService - finds the 'rooms' content type, then fetches all descendants
 * @returns Object containing page title, description, banner image, and rooms array
 */
export async function fetchRoomsDataFromUmbracoApi(): Promise<RoomsPage> {
  try {
    let roomsPage: RoomsPage = {
      title: "",
      description: "",
      bannerImage: "",
      rooms: [],
      roomCategories: [],
    };

    // Step 1: Find the 'rooms' content type node
    const roomsData: UmbracoRooms | null = await fetchContentByType("rooms") as UmbracoRooms | null;
    if (!roomsData) {
      throw new Error('Could not fetch rooms content type from Umbraco');
    }

    // Step 2: Extract page-level properties (title, description, banner image)
    roomsPage.title = roomsData.properties?.title || roomsData.name || 'Our Rooms & Suites';
    roomsPage.description = roomsData.properties?.description || '';
    roomsPage.bannerImage = extractImageUrlFromUmbracoImage(roomsData.properties?.bannerImage);

    // Step 3: Get all descendants (all room items) at once
    const descendantsChildren = await fetchDescendantsChildrenByID(roomsData.id);
    if (!descendantsChildren || descendantsChildren.length === 0) {
      console.warn('No room items found in Umbraco');
      return roomsPage;
    }

    // Step 4: Process all room items and room categories
    const rooms: Room[] = [];
    const roomCategories: RoomCategory[] = [];
    
    console.log('Processing descendants:', descendantsChildren.length);
    
    for (const item of descendantsChildren) {
      console.log('Processing item:', item.contentType, item.name);
      
      if (item?.contentType === 'roomCategory') {
        // Store roomCategory for mapping to rooms
        const categoryTitle = item.properties?.title || item.properties?.name || item.name || '';
        const sortOrder = item.properties?.sortOrder || item.properties?.page || 0;
        const mainImageUrl = extractImageUrlFromUmbracoImage(item.properties?.mainImage);
        const description = item.properties?.description || item.properties?.summary || '';
        
        // Extract capacity - handle both string and number, check multiple property names
        let capacity = '';
        if (item.properties?.capacity !== undefined && item.properties?.capacity !== null) {
          capacity = String(item.properties.capacity);
        } else if (item.properties?.guests !== undefined && item.properties?.guests !== null) {
          capacity = String(item.properties.guests);
        } else if (item.properties?.Capacity !== undefined && item.properties?.Capacity !== null) {
          capacity = String(item.properties.Capacity);
        }
        
        // Extract size - handle both string and number, check multiple property names
        let size = '';
        if (item.properties?.size !== undefined && item.properties?.size !== null) {
          size = String(item.properties.size);
        } else if (item.properties?.area !== undefined && item.properties?.area !== null) {
          size = String(item.properties.area);
        } else if (item.properties?.Size !== undefined && item.properties?.Size !== null) {
          size = String(item.properties.Size);
        }
        
        console.log('Found roomCategory:', categoryTitle);
        console.log('  - Properties:', item.properties);
        console.log('  - capacity value:', capacity);
        console.log('  - size value:', size);
        
        roomCategories.push({
          id: item.id,
          title: categoryTitle,
          path: item.route?.path,
          sortOrder: sortOrder,
          mainImage: mainImageUrl,
          description: description,
          capacity: capacity,
          size: size
        });
      } else if (item?.contentType === 'room' || item?.contentType === 'roomItem') {
        const room = populateRoom(item);
        if (room) {
          rooms.push(room);
        }
      }
    }
    
    console.log('Found roomCategories:', roomCategories.length, roomCategories);
    
    // Step 4b: Sort room categories by Umbraco sortOrder (ascending)
    if (roomCategories.length > 0) {
      roomCategories.sort((a, b) => {
        const orderA = a.sortOrder || 0;
        const orderB = b.sortOrder || 0;
        return orderA - orderB;
      });
      console.log('Sorted roomCategories by sortOrder:', roomCategories);
    }
    
    // Step 4c: Store room categories for mapping (now in Umbraco sort order)
    roomsPage.roomCategories = roomCategories;

    // Step 5: Sort rooms by sortOrder if available, otherwise by name
    if (rooms.length > 0) {
      rooms.sort((a, b) => {
        // You can add sortOrder to Room interface if needed
        return a.name.localeCompare(b.name);
      });
    }

    roomsPage.rooms = rooms;
    return roomsPage;
  } catch (error) {
    console.error('Error fetching rooms data from Umbraco:', error);
    // Return empty structure if API fails
    return {
      title: "Our Rooms & Suites",
      description: "",
      bannerImage: "",
      rooms: [],
      roomCategories: [],
    };
  }
}

/**
 * Transform Umbraco content item to Room object
 */
export function populateRoom(item: UmbracoContentItem): Room | null {
  try {
    // Extract image URLs - handle both single image and image array
    let mainImageUrl = extractImageUrlFromUmbracoImage(item.properties?.mainImage) || 
                      extractImageUrlFromUmbracoImage(item.properties?.image);
    
    // Extract gallery images
    const galleryImages: string[] = [];
    if (item.properties?.images) {
      if (Array.isArray(item.properties.images)) {
        item.properties.images.forEach((img: any) => {
          const url = extractImageUrlFromUmbracoImage(img);
          if (url) galleryImages.push(url);
        });
      } else {
        const url = extractImageUrlFromUmbracoImage(item.properties.images);
        if (url) galleryImages.push(url);
      }
    }

    // Extract bedrooms data (if stored as array or JSON string)
    let bedrooms: { name: string; beds: string }[] = [];
    if (item.properties?.bedrooms) {
      if (Array.isArray(item.properties.bedrooms)) {
        bedrooms = item.properties.bedrooms.map((bedroom: any) => ({
          name: bedroom.name || bedroom.title || 'Bedroom',
          beds: bedroom.beds || bedroom.bedType || ''
        }));
      } else if (typeof item.properties.bedrooms === 'string') {
        try {
          const parsed = JSON.parse(item.properties.bedrooms);
          if (Array.isArray(parsed)) {
            bedrooms = parsed;
          }
        } catch (e) {
          // If parsing fails, ignore
        }
      }
    }

    // Extract arrays (amenities, accessories, facilities)
    const extractArray = (property: any): string[] => {
      if (!property) return [];
      if (Array.isArray(property)) return property;
      if (typeof property === 'string') {
        try {
          const parsed = JSON.parse(property);
          if (Array.isArray(parsed)) return parsed;
          return property.split(',').map((s: string) => s.trim()).filter(Boolean);
        } catch {
          return property.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    // Generate slug from name
    const generateSlug = (name: string): string => {
      return name.toLowerCase().replace(/\s+/g, '-');
    };

    // Convert GUID to numeric ID (similar to menu service)
    const id = parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0;

    // Extract price (handle both cents and dollars)
    let price = 0;
    if (item.properties?.price) {
      price = typeof item.properties.price === 'number' 
        ? (item.properties.price > 1000 ? item.properties.price / 100 : item.properties.price) // If > 1000, assume cents
        : parseFloat(item.properties.price) || 0;
    }

    const room: Room = {
      id: id,
      name: item.properties?.title || item.properties?.name || item.name || '',
      price: price,
      image: mainImageUrl || '',
      rating: item.properties?.rating || 5,
      description: item.properties?.description || item.properties?.summary || '',
      size: item.properties?.size || item.properties?.area || '',
      guests: item.properties?.guests || item.properties?.capacity || '',
      bedrooms: bedrooms.length > 0 ? bedrooms : undefined,
      keyAmenities: extractArray(item.properties?.keyAmenities || item.properties?.amenities),
      images: galleryImages.length > 0 ? galleryImages : (mainImageUrl ? [mainImageUrl] : []),
      accessories: extractArray(item.properties?.accessories),
      facilities: extractArray(item.properties?.facilities),
      slug: generateSlug(item.properties?.title || item.properties?.name || item.name || ''),
    };

    return room;
  } catch (error) {
    console.error('Error populating room:', error);
    return null;
  }
}

