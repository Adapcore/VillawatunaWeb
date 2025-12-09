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
  roomData?: Room; // Detailed room data from child room item
  categoryAccessories?: string[]; // Accessories extracted directly from roomCategory
  categoryFacilities?: string[]; // Facilities extracted directly from roomCategory
  categoryKeyAmenities?: string[]; // Key amenities extracted from facilitiesAmenities where keyAmenity === true
  categoryBedrooms?: { name: string; beds: string }[]; // Bedrooms extracted directly from roomCategory
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
    const roomsByPath: Map<string | undefined, Room> = new Map();
    
    console.log('Processing descendants:', descendantsChildren.length);
    
    // First pass: Process room items to get detailed data
    for (const item of descendantsChildren) {
      console.log('Processing item:', item.contentType, item.name, 'Path:', item.route?.path);
      
      if (item?.contentType === 'room' || item?.contentType === 'roomItem') {
        const room = populateRoom(item);
        if (room) {
          rooms.push(room);
          // Store by parent path for matching with category
          const parentPath = item.route?.path?.split('/').slice(0, -1).join('/');
          roomsByPath.set(parentPath, room);
          console.log('  - Stored room with parent path:', parentPath);
          console.log('  - Room data:', { 
            name: room.name, 
            accessories: room.accessories.length, 
            facilities: room.facilities.length,
            keyAmenities: room.keyAmenities?.length || 0
          });
        }
      }
    }
    
    // Second pass: Process room categories and match with room items
    for (const item of descendantsChildren) {
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
        console.log('  - Path:', item.route?.path);
        console.log('  - capacity value:', capacity);
        console.log('  - size value:', size);
        console.log('  - bedrooms property:', item.properties?.bedrooms);
        
        // Extract bedrooms from roomCategory if available
        // Handle nested structure: bedrooms.items[].content.properties
        let categoryBedrooms: { name: string; beds: string }[] = [];
        if (item.properties?.bedrooms) {
          console.log('  - bedrooms property found:', item.properties.bedrooms);
          console.log('  - bedrooms.items:', item.properties.bedrooms?.items);
          // Check for nested structure: bedrooms.items[].content
          if (item.properties.bedrooms?.items && Array.isArray(item.properties.bedrooms.items)) {
            console.log('  - Processing bedrooms.items, count:', item.properties.bedrooms.items.length);
            item.properties.bedrooms.items.forEach((bedroomItem: any, index: number) => {
              console.log(`  - Bedroom item ${index}:`, bedroomItem);
              const bedroomContent = bedroomItem?.content;
              console.log(`  - Bedroom item ${index} content:`, bedroomContent);
              console.log(`  - Bedroom item ${index} content.properties:`, bedroomContent?.properties);
              if (bedroomContent?.properties) {
                const bedroomName = bedroomContent.properties.name || 
                                  bedroomContent.properties.title || 
                                  bedroomContent.properties.bedroomName || 
                                  'Bedroom';
                const bedroomBeds = bedroomContent.properties.beds || 
                                  bedroomContent.properties.bedType || 
                                  bedroomContent.properties.bed || 
                                  '';
                console.log(`  - Extracted bedroom ${index}: name="${bedroomName}", beds="${bedroomBeds}"`);
                categoryBedrooms.push({
                  name: bedroomName,
                  beds: bedroomBeds
                });
              } else {
                console.log(`  - Bedroom item ${index} has no content.properties`);
              }
            });
            console.log('  - Extracted bedrooms from roomCategory (nested structure):', categoryBedrooms);
            console.log('  - Total bedrooms extracted:', categoryBedrooms.length);
          }
          // Fallback: handle direct array structure
          else if (Array.isArray(item.properties.bedrooms)) {
            categoryBedrooms = item.properties.bedrooms.map((bedroom: any) => ({
              name: bedroom.name || bedroom.title || 'Bedroom',
              beds: bedroom.beds || bedroom.bedType || ''
            }));
            console.log('  - Extracted bedrooms from roomCategory (direct array):', categoryBedrooms);
          } 
          // Fallback: handle JSON string
          else if (typeof item.properties.bedrooms === 'string') {
            try {
              const parsed = JSON.parse(item.properties.bedrooms);
              if (Array.isArray(parsed)) {
                categoryBedrooms = parsed.map((bedroom: any) => ({
                  name: bedroom.name || bedroom.title || 'Bedroom',
                  beds: bedroom.beds || bedroom.bedType || ''
                }));
              }
            } catch (e) {
              // If parsing fails, ignore
            }
            console.log('  - Extracted bedrooms from roomCategory (JSON string):', categoryBedrooms);
          }
        }
        
        // Try to find matching room item
        const matchingRoom = roomsByPath.get(item.route?.path);
        console.log('  - Matching room found:', matchingRoom ? 'YES' : 'NO');
        
        // If matching room exists and category has bedrooms, merge them (category bedrooms take priority)
        if (matchingRoom && categoryBedrooms.length > 0) {
          matchingRoom.bedrooms = categoryBedrooms;
          console.log('  - Set bedrooms from category:', categoryBedrooms);
        }
        
        // Store categoryBedrooms in the category for use when creating rooms from categories
        // (even if there's no matching room, we still want to use category bedrooms)
        
        // Extract accessories from roomCategory's roomAccessories property
        // This is where the API stores accessories for roomCategory items
        let categoryAccessories: string[] = [];
        if (item.properties?.roomAccessories) {
          // Use the extractAccessories function (need to define it or extract inline)
          if (item.properties.roomAccessories?.items && Array.isArray(item.properties.roomAccessories.items)) {
            item.properties.roomAccessories.items.forEach((accItem: any) => {
              if (accItem?.content?.properties?.accessory) {
                const accessory = accItem.content.properties.accessory;
                if (typeof accessory === 'string' && accessory.trim()) {
                  categoryAccessories.push(accessory.trim());
                }
              }
            });
          }
          console.log('  - Extracted accessories from roomCategory:', categoryAccessories);
        }
        
        // Extract facilities from roomCategory's facilitiesAmenities property
        // This is where the API stores facilities for roomCategory items
        let categoryFacilities: string[] = [];
        let categoryKeyAmenities: string[] = [];
        if (item.properties?.facilitiesAmenities) {
          // Extract facilities similar to accessories structure
          // The property name is "facilityName" in the API
          if (item.properties.facilitiesAmenities?.items && Array.isArray(item.properties.facilitiesAmenities.items)) {
            item.properties.facilitiesAmenities.items.forEach((facItem: any) => {
              // Check for facilityName property (the actual property name in API)
              if (facItem?.content?.properties?.facilityName) {
                const facility = facItem.content.properties.facilityName;
                const isKeyAmenity = facItem?.content?.properties?.keyAmenity === true;
                
                if (typeof facility === 'string' && facility.trim()) {
                  // Add to facilities list
                  categoryFacilities.push(facility.trim());
                  
                  // If keyAmenity is true, also add to keyAmenities list
                  if (isKeyAmenity) {
                    categoryKeyAmenities.push(facility.trim());
                  }
                }
              }
              // Also check for alternative property names as fallback
              else if (facItem?.content?.properties?.facility) {
                const facility = facItem.content.properties.facility;
                const isKeyAmenity = facItem?.content?.properties?.keyAmenity === true;
                
                if (typeof facility === 'string' && facility.trim()) {
                  categoryFacilities.push(facility.trim());
                  
                  if (isKeyAmenity) {
                    categoryKeyAmenities.push(facility.trim());
                  }
                }
              }
              else if (facItem?.content?.properties?.amenity) {
                const amenity = facItem.content.properties.amenity;
                const isKeyAmenity = facItem?.content?.properties?.keyAmenity === true;
                
                if (typeof amenity === 'string' && amenity.trim()) {
                  categoryFacilities.push(amenity.trim());
                  
                  if (isKeyAmenity) {
                    categoryKeyAmenities.push(amenity.trim());
                  }
                }
              }
            });
          }
          console.log('  - Extracted facilities from roomCategory:', categoryFacilities);
          console.log('  - Extracted keyAmenities from roomCategory (where keyAmenity === true):', categoryKeyAmenities);
          console.log('  - facilitiesAmenities structure:', item.properties.facilitiesAmenities);
        }
        
        // If matching room exists, merge category accessories with room accessories
        if (matchingRoom && categoryAccessories.length > 0) {
          // Merge: API accessories from category first, then room item accessories
          const existingAccessories = matchingRoom.accessories || [];
          const mergedAccessories = [...categoryAccessories];
          existingAccessories.forEach((acc: string) => {
            const exists = categoryAccessories.some(
              (catAcc) => catAcc.toLowerCase().trim() === acc.toLowerCase().trim()
            );
            if (!exists) {
              mergedAccessories.push(acc);
            }
          });
          matchingRoom.accessories = mergedAccessories;
          console.log('  - Merged accessories (category + room):', mergedAccessories);
        }
        
        // If matching room exists, merge category facilities with room facilities
        if (matchingRoom && categoryFacilities.length > 0) {
          // Merge: API facilities from category first, then room item facilities
          const existingFacilities = matchingRoom.facilities || [];
          const mergedFacilities = [...categoryFacilities];
          existingFacilities.forEach((fac: string) => {
            const exists = categoryFacilities.some(
              (catFac) => catFac.toLowerCase().trim() === fac.toLowerCase().trim()
            );
            if (!exists) {
              mergedFacilities.push(fac);
            }
          });
          matchingRoom.facilities = mergedFacilities;
          console.log('  - Merged facilities (category + room):', mergedFacilities);
        }
        
        // If matching room exists, merge category keyAmenities with room keyAmenities
        if (matchingRoom && categoryKeyAmenities.length > 0) {
          // Merge: API keyAmenities from category first, then room item keyAmenities
          const existingKeyAmenities = matchingRoom.keyAmenities || [];
          const mergedKeyAmenities = [...categoryKeyAmenities];
          existingKeyAmenities.forEach((keyAmenity: string) => {
            const exists = categoryKeyAmenities.some(
              (catKeyAmenity) => catKeyAmenity.toLowerCase().trim() === keyAmenity.toLowerCase().trim()
            );
            if (!exists) {
              mergedKeyAmenities.push(keyAmenity);
            }
          });
          matchingRoom.keyAmenities = mergedKeyAmenities;
          console.log('  - Merged keyAmenities (category + room):', mergedKeyAmenities);
        }
        
        roomCategories.push({
          id: item.id,
          title: categoryTitle,
          path: item.route?.path,
          sortOrder: sortOrder,
          mainImage: mainImageUrl,
          description: description,
          capacity: capacity,
          size: size,
          roomData: matchingRoom, // Store the matching room data (with merged accessories/facilities/keyAmenities/bedrooms if applicable)
          categoryAccessories: categoryAccessories, // Store category-level accessories
          categoryFacilities: categoryFacilities, // Store category-level facilities
          categoryKeyAmenities: categoryKeyAmenities, // Store category-level keyAmenities
          categoryBedrooms: categoryBedrooms // Store category-level bedrooms
        });
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
    // Handle nested structure: bedrooms.items[].content.properties
    let bedrooms: { name: string; beds: string }[] = [];
    if (item.properties?.bedrooms) {
      // Check for nested structure: bedrooms.items[].content
      if (item.properties.bedrooms?.items && Array.isArray(item.properties.bedrooms.items)) {
        item.properties.bedrooms.items.forEach((bedroomItem: any) => {
          const bedroomContent = bedroomItem?.content;
          if (bedroomContent?.properties) {
            const bedroomName = bedroomContent.properties.name || 
                              bedroomContent.properties.title || 
                              bedroomContent.properties.bedroomName || 
                              'Bedroom';
            const bedroomBeds = bedroomContent.properties.beds || 
                              bedroomContent.properties.bedType || 
                              bedroomContent.properties.bed || 
                              '';
            bedrooms.push({
              name: bedroomName,
              beds: bedroomBeds
            });
          }
        });
        console.log(`Room "${item.properties?.title || item.name}" - Extracted bedrooms (nested structure):`, bedrooms);
      }
      // Fallback: handle direct array structure
      else if (Array.isArray(item.properties.bedrooms)) {
        bedrooms = item.properties.bedrooms.map((bedroom: any) => ({
          name: bedroom.name || bedroom.title || 'Bedroom',
          beds: bedroom.beds || bedroom.bedType || ''
        }));
        console.log(`Room "${item.properties?.title || item.name}" - Extracted bedrooms (direct array):`, bedrooms);
      } 
      // Fallback: handle JSON string
      else if (typeof item.properties.bedrooms === 'string') {
        try {
          const parsed = JSON.parse(item.properties.bedrooms);
          if (Array.isArray(parsed)) {
            bedrooms = parsed.map((bedroom: any) => ({
              name: bedroom.name || bedroom.title || 'Bedroom',
              beds: bedroom.beds || bedroom.bedType || ''
            }));
          }
        } catch (e) {
          // If parsing fails, ignore
        }
        console.log(`Room "${item.properties?.title || item.name}" - Extracted bedrooms (JSON string):`, bedrooms);
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

    // Extract accessories from nested Umbraco structure: roomAccessories > items > content > properties > accessory
    const extractAccessories = (roomAccessories: any): string[] => {
      if (!roomAccessories) return [];
      
      const accessories: string[] = [];
      
      // Handle the actual API structure: roomAccessories.items[].content.properties.accessory
      if (roomAccessories?.items && Array.isArray(roomAccessories.items)) {
        roomAccessories.items.forEach((item: any) => {
          // Check for item.content.properties.accessory (lowercase)
          if (item?.content?.properties?.accessory) {
            const accessory = item.content.properties.accessory;
            if (typeof accessory === 'string' && accessory.trim()) {
              accessories.push(accessory.trim());
            }
          }
          // Also check for item.content.Properties.Accessory (uppercase) as fallback
          else if (item?.content?.Properties?.Accessory) {
            const accessory = item.content.Properties.Accessory;
            if (typeof accessory === 'string' && accessory.trim()) {
              accessories.push(accessory.trim());
            }
          }
        });
      }
      // Handle array of content items (alternative structure)
      else if (Array.isArray(roomAccessories)) {
        roomAccessories.forEach((item: any) => {
          // Check if item has content.properties.accessory (lowercase)
          if (item?.content?.properties?.accessory) {
            const accessory = item.content.properties.accessory;
            if (typeof accessory === 'string' && accessory.trim()) {
              accessories.push(accessory.trim());
            }
          }
          // Also check content.Properties.Accessory (uppercase) as fallback
          else if (item?.content?.Properties?.Accessory) {
            const accessory = item.content.Properties.Accessory;
            if (typeof accessory === 'string' && accessory.trim()) {
              accessories.push(accessory.trim());
            }
          }
          // Also check direct Properties.Accessory (in case structure is different)
          else if (item?.Properties?.Accessory) {
            const accessory = item.Properties.Accessory;
            if (typeof accessory === 'string' && accessory.trim()) {
              accessories.push(accessory.trim());
            }
          }
        });
      }
      // Handle object with content array
      else if (roomAccessories?.content) {
        const content = Array.isArray(roomAccessories.content) 
          ? roomAccessories.content 
          : [roomAccessories.content];
        
        content.forEach((item: any) => {
          // Check properties.accessory (lowercase)
          if (item?.properties?.accessory) {
            const accessory = item.properties.accessory;
            if (typeof accessory === 'string' && accessory.trim()) {
              accessories.push(accessory.trim());
            }
          }
          // Check Properties.Accessory (uppercase) as fallback
          else if (item?.Properties?.Accessory) {
            const accessory = item.Properties.Accessory;
            if (typeof accessory === 'string' && accessory.trim()) {
              accessories.push(accessory.trim());
            }
          }
        });
      }
      // Handle direct Properties.Accessory structure
      else if (roomAccessories?.Properties?.Accessory) {
        const accessory = roomAccessories.Properties.Accessory;
        if (typeof accessory === 'string' && accessory.trim()) {
          accessories.push(accessory.trim());
        }
      }
      
      return accessories;
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

    // Extract accessories - prioritize nested structure from roomAccessories
    let accessories: string[] = [];
    
    // First, try to extract from nested roomAccessories structure
    if (item.properties?.roomAccessories) {
      console.log(`Room "${item.properties?.title || item.name}" - roomAccessories structure:`, {
        hasItems: !!item.properties.roomAccessories.items,
        itemsLength: item.properties.roomAccessories.items?.length || 0,
        items: item.properties.roomAccessories.items
      });
      
      accessories = extractAccessories(item.properties.roomAccessories);
      console.log(`Room "${item.properties?.title || item.name}" - Extracted from roomAccessories:`, accessories);
    }
    
    // Fallback to other property names if roomAccessories didn't yield results
    if (accessories.length === 0) {
      accessories = extractArray(item.properties?.accessories || item.properties?.Accessories);
    }
    
    const facilities = extractArray(item.properties?.facilities || item.properties?.Facilities);
    
    // Log accessories extraction for debugging
    if (accessories.length > 0) {
      console.log(`Room "${item.properties?.title || item.name}" - Final extracted ${accessories.length} accessories:`, accessories);
    } else {
      console.log(`Room "${item.properties?.title || item.name}" - No accessories found. Properties checked:`, {
        roomAccessories: item.properties?.roomAccessories,
        roomAccessoriesItems: item.properties?.roomAccessories?.items,
        accessories: item.properties?.accessories,
        Accessories: item.properties?.Accessories,
        roomAccessoriesStructure: item.properties?.roomAccessories ? 'Found' : 'Not found'
      });
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
      accessories: accessories,
      facilities: facilities,
      slug: generateSlug(item.properties?.title || item.properties?.name || item.name || ''),
    };

    return room;
  } catch (error) {
    console.error('Error populating room:', error);
    return null;
  }
}

