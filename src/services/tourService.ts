import { fetchContentByType, fetchDescendantsChildrenByID, UmbracoContentItem, UmbracoImage, extractImageUrlFromUmbracoImage } from "./umbracoService";

export interface Tour {
    id: number;
    name: string;
    price: number;
    duration: string;
    description: string;
    highlights: string[];
    includes: string[];
    difficulty: string;
    image?: string;
    subTitle: string;
    subDescription: string;
    slug?: string;
}

export interface ToursPage {
    title: string;
    description: string;
    subTitle?: string;
    subDescription?: string;
    bannerImage?: string;
    bookingInformation?: string; // Rich text HTML content
    tours: Tour[];
}

export interface UmbracoTours extends UmbracoContentItem {
    id: string;
    name: string;
    contentType: string;
    properties?: {
        title?: string;
        header?: string;
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
 * Fetch tours page content and all tour items from Umbraco Content Delivery API
 * Finds the 'tour' content type, then fetches all descendants (child tours)
 * @returns Object containing page title/header, description, banner image, and tours array
 */
export async function fetchToursDataFromUmbracoApi(): Promise<ToursPage> {
    try {
        let toursPage: ToursPage = {
            title: "",
            description: "",
            subTitle: "",
            subDescription: "",
            bannerImage: "",
            bookingInformation: "",
            tours: [],
        };

        // Step 1: Find the 'tour' content type node
        const toursData: UmbracoTours | null = await fetchContentByType("tour") as UmbracoTours | null;
        if (!toursData) {
            console.warn('Could not fetch tour content type from Umbraco');
            return toursPage;
        }

        console.log('Tour page data from API:', toursData);

        // Step 2: Extract page-level properties (title/header, description, subTitle, subDescription, banner image, bookingInformation)
        // Check for both 'header' and 'title' properties, but keep empty if not available
        toursPage.title = toursData.properties?.header || toursData.properties?.title || toursData.name || '';
        toursPage.description = toursData.properties?.description || '';
        // Try multiple property name variations for subTitle and subDescription
        toursPage.subTitle = toursData.properties?.subTitle || toursData.properties?.subtitle || toursData.properties?.sub_title || '';
        toursPage.subDescription = toursData.properties?.subDescription || toursData.properties?.subdescription || toursData.properties?.sub_description || '';
        toursPage.bannerImage = extractImageUrlFromUmbracoImage(toursData.properties?.bannerImage);
        // Extract bookingInformation as rich text HTML
        // Handle rich text field which can be an object with markup/value property or a string
        const bookingInfo = toursData.properties?.bookingInformation;
        if (typeof bookingInfo === 'string') {
            toursPage.bookingInformation = bookingInfo;
        } else if (bookingInfo && typeof bookingInfo === 'object') {
            // Try common rich text field structures
            toursPage.bookingInformation = bookingInfo.markup || 
                                          bookingInfo.value || 
                                          bookingInfo.html || 
                                          bookingInfo.content ||
                                          (Array.isArray(bookingInfo) && bookingInfo.length > 0 ? bookingInfo[0]?.markup || bookingInfo[0]?.value || '' : '') ||
                                          '';
        } else {
            toursPage.bookingInformation = '';
        }
        
        console.log('Tour page properties from API:', toursData.properties);
        console.log('Tour page subTitle property:', toursData.properties?.subTitle, toursData.properties?.subtitle, toursData.properties?.sub_title);
        console.log('Tour page subDescription property:', toursData.properties?.subDescription, toursData.properties?.subdescription, toursData.properties?.sub_description);
        console.log('Tour page bookingInformation raw:', bookingInfo);
        console.log('Tour page bookingInformation extracted:', toursPage.bookingInformation);

        console.log('Tour page title/header:', toursPage.title);
        console.log('Tour page description:', toursPage.description);

        // Step 3: Get all descendants (all child tour items) at once
        const descendantsChildren = await fetchDescendantsChildrenByID(toursData.id);
        if (!descendantsChildren || descendantsChildren.length === 0) {
            console.warn('No tour items found in Umbraco');
            return toursPage;
        }

        console.log('Found tour descendants:', descendantsChildren.length);

        // Step 4: Process all tour items
        const tours: Tour[] = [];

        for (const item of descendantsChildren) {
            // Only process items that are actual tour items (not categories or other types)
            if (item.contentType === 'tour' || item.contentType === 'tourItem') {
                const tour = populateTour(item, tours.length + 1);
                if (tour) {
                    tours.push(tour);
                }
            }
        }

        toursPage.tours = tours;
        console.log('Processed tours:', tours.length);

        return toursPage;
    } catch (error) {
        console.error('Error fetching tours data from Umbraco API:', error);
        return {
            title: "",
            description: "",
            subTitle: "",
            subDescription: "",
            bannerImage: "",
            bookingInformation: "",
            tours: [],
        };
    }
}

/**
 * Populate a Tour object from an Umbraco content item
 */
function populateTour(item: UmbracoContentItem, index: number): Tour | null {
    try {
        const properties = item.properties || {};

        const tour: Tour = {
            id: index,
            name: properties.name || properties.title || item.name || `Tour ${index}`,
            price: parseFloat(properties.price) || 0,
            duration: properties.duration || '',
            description: properties.description || '',
            highlights: extractArrayProperty(properties.highlights),
            includes: extractArrayProperty(properties.includes),
            difficulty: properties.difficulty || '',
            image: extractImageUrlFromUmbracoImage(properties.mainImage || properties.image),
            subTitle: properties.subTitle || '',
            subDescription: properties.subDescription || '',
            slug: item.url || item.route?.path || item.name?.toLowerCase().replace(/\s+/g, '-'),
        };

        return tour;
    } catch (error) {
        console.error('Error populating tour:', error, item);
        return null;
    }
}

/**
 * Extract array property from Umbraco content item
 * Handles both direct arrays and nested structures
 */
function extractArrayProperty(property: any): string[] {
    if (!property) return [];

    if (Array.isArray(property)) {
        // If it's already an array, map to strings
        return property.map((item: any) => {
            if (typeof item === 'string') return item;
            if (item?.content?.properties?.name) return item.content.properties.name;
            if (item?.name) return item.name;
            if (item?.properties?.name) return item.properties.name;
            return String(item);
        });
    }

    // If it's a nested structure with items
    if (property.items && Array.isArray(property.items)) {
        return property.items.map((item: any) => {
            if (item?.content?.properties?.name) return item.content.properties.name;
            if (item?.name) return item.name;
            if (typeof item === 'string') return item;
            return String(item);
        });
    }

    // If it's a string, try to parse as JSON
    if (typeof property === 'string') {
        try {
            const parsed = JSON.parse(property);
            if (Array.isArray(parsed)) {
                return parsed.map((item: any) => String(item));
            }
        } catch (e) {
            // If parsing fails, return as single-item array
            return [property];
        }
    }

    return [];
}

