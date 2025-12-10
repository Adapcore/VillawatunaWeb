import { fetchContentByType, fetchDescendantsChildrenByID, UmbracoContentItem, UmbracoImage, extractImageUrlFromUmbracoImage } from "./umbracoService";

export interface Tour {
    id: number;
    name: string;
    price: number;
    priceTitle?: string; // API property to replace "Person" text
    duration: string;
    description: string;
    highlights: string[];
    includes: string[];
    whatsIncluded: string[]; // API property: whatsIncluded
    difficultyLevel?: string; // API property: easy, moderate, hard
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
                    // Ensure tour has a valid name before adding
                    if (tour.name && tour.name.trim() !== '') {
                        tours.push(tour);
                    } else {
                        console.warn('Tour skipped - missing or empty name:', item);
                    }
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

        // Extract description - handle both string and rich text object formats
        let description = '';
        const descriptionProp = properties.description;
        if (typeof descriptionProp === 'string') {
            description = descriptionProp;
        } else if (descriptionProp && typeof descriptionProp === 'object') {
            // Handle rich text field which can be an object with markup/value property
            description = descriptionProp.markup || 
                         descriptionProp.value || 
                         descriptionProp.html || 
                         descriptionProp.content ||
                         (Array.isArray(descriptionProp) && descriptionProp.length > 0 ? descriptionProp[0]?.markup || descriptionProp[0]?.value || '' : '') ||
                         '';
        }

        // Extract name with fallback - ensure it's never empty
        const tourName = (properties.name || properties.title || item.name || `Tour ${index}`).trim();
        if (!tourName || tourName === '') {
            console.warn('Tour has empty name, using fallback:', { properties, item });
        }
        
        // Extract duration and priceTitle as strings, handling objects
        let duration = '';
        if (properties.duration) {
            if (typeof properties.duration === 'string') {
                duration = properties.duration;
            } else if (typeof properties.duration === 'object' && properties.duration.properties) {
                duration = properties.duration.properties.name || properties.duration.properties.value || String(properties.duration);
            } else {
                duration = String(properties.duration);
            }
        }
        
        let priceTitle = '';
        if (properties.priceTitle || properties.price_title) {
            const priceTitleProp = properties.priceTitle || properties.price_title;
            if (typeof priceTitleProp === 'string') {
                priceTitle = priceTitleProp;
            } else if (typeof priceTitleProp === 'object' && priceTitleProp.properties) {
                priceTitle = priceTitleProp.properties.name || priceTitleProp.properties.value || String(priceTitleProp);
            } else {
                priceTitle = String(priceTitleProp);
            }
        }
        
        const tour: Tour = {
            id: index,
            name: tourName || `Tour ${index}`,
            price: parseFloat(properties.price) || 0,
            priceTitle: priceTitle,
            duration: duration,
            description: description,
            highlights: extractArrayProperty(properties.highlights),
            includes: extractArrayProperty(properties.includes),
            whatsIncluded: extractArrayProperty(properties.whatsIncluded),
            // Use difficultyLevel from API for color mapping (easy, moderate, hard)
            // Try multiple property name variations, normalize to lowercase
            difficultyLevel: (() => {
                // Log all properties to find the correct property name
                const allKeys = Object.keys(properties || {});
                const difficultyKeys = allKeys.filter(key => 
                    key.toLowerCase().includes('difficulty') || 
                    key.toLowerCase().includes('level')
                );
                console.log(`Tour "${properties.name || item.name}" - Properties with 'difficulty' or 'level' in name:`, difficultyKeys);
                
                // Try difficultyLevel first (check for null/undefined/empty)
                let level = null;
                
                // Check all possible property name variations
                const possibleNames = [
                    'difficultyLevel',
                    'difficulty_level', 
                    'DifficultyLevel',
                    'level',
                    'tourDifficulty',
                    'tourDifficultyLevel'
                ];
                
                for (const propName of possibleNames) {
                    const value = properties[propName];
                    if (value !== null && value !== undefined && value !== '') {
                        level = value;
                        console.log(`Tour "${properties.name || item.name}" - Found difficultyLevel in property "${propName}":`, value);
                        break;
                    }
                }
                
                // Also check if any of the filtered keys have a value
                for (const key of difficultyKeys) {
                    const value = properties[key];
                    if (value !== null && value !== undefined && value !== '') {
                        level = value;
                        console.log(`Tour "${properties.name || item.name}" - Found difficultyLevel in property "${key}":`, value);
                        break;
                    }
                }
                
                // Normalize to lowercase and trim if we have a value
                const result = level ? String(level).toLowerCase().trim() : '';
                console.log(`Tour "${properties.name || item.name}" - Final difficultyLevel value:`, result);
                return result;
            })(),
            image: extractImageUrlFromUmbracoImage(properties.mainImage || properties.image),
            subTitle: properties.subTitle || '',
            subDescription: properties.subDescription || '',
            slug: item.url || item.route?.path || item.name?.toLowerCase().replace(/\s+/g, '-'),
        };

        console.log(`Tour "${tour.name}" - Description extracted:`, description);
        console.log(`Tour "${tour.name}" - Description raw property:`, descriptionProp);
        console.log(`Tour "${tour.name}" - PriceTitle:`, tour.priceTitle);
        console.log(`Tour "${tour.name}" - PriceTitle raw property:`, properties.priceTitle, properties.price_title);
        console.log(`Tour "${tour.name}" - DifficultyLevel FINAL extracted:`, tour.difficultyLevel);
        console.log(`Tour "${tour.name}" - Highlights extracted:`, tour.highlights);
        console.log(`Tour "${tour.name}" - Highlights raw property:`, properties.highlights);
        console.log(`Tour "${tour.name}" - WhatsIncluded extracted:`, tour.whatsIncluded);
        console.log(`Tour "${tour.name}" - WhatsIncluded raw property:`, properties.whatsIncluded);
        console.log(`Tour "${tour.name}" - Full properties:`, properties);

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

    // Handle nested structure with items array (like highlights.items[] or whatsIncluded.items[])
    // Structure: {items: [{content: {contentType: "stringItem", properties: {item: "..."}}, settings: null}]}
    if (property.items && Array.isArray(property.items)) {
        console.log('extractArrayProperty - Found items array structure, extracting from items');
        return property.items.map((item: any, index: number) => {
            // Handle structure: {content: {contentType: "stringItem", properties: {item: "..."}}, settings: null}
            if (item.content && item.content.properties) {
                const props = item.content.properties;
                // Check for 'item' property first (as shown in the API structure)
                if (props.item) {
                    return String(props.item);
                }
                // Fallback to other common property names
                const textValue = props.name || 
                                props.title || 
                                props.text || 
                                props.value || 
                                props.markup || 
                                props.html ||
                                props.content;
                if (textValue) {
                    if (typeof textValue === 'object') {
                        if (textValue.markup) return String(textValue.markup);
                        if (textValue.value) return String(textValue.value);
                        if (textValue.html) return String(textValue.html);
                        if (textValue.content) return String(textValue.content);
                        if (textValue.name) return String(textValue.name);
                        if (textValue.title) return String(textValue.title);
                        if (textValue.text) return String(textValue.text);
                    }
                    return String(textValue);
                }
                // Try to find any string property
                const allProps = Object.keys(props);
                for (const propKey of allProps) {
                    const propValue = props[propKey];
                    if (typeof propValue === 'string' && propValue.trim() !== '') {
                        console.log(`Found string property "${propKey}" in items[${index}]:`, propValue);
                        return propValue;
                    }
                }
            }
            // Handle direct content structure
            if (item.contentType && item.properties) {
                const props = item.properties;
                if (props.item) return String(props.item);
                const textValue = props.name || props.title || props.text || props.value;
                if (textValue) return String(textValue);
            }
            console.warn('extractArrayProperty (items) - Could not extract text from item:', item);
            return '';
        }).filter(item => item !== '');
    }

    if (Array.isArray(property)) {
        // If it's already an array, map to strings
        return property.map((item: any, index: number) => {
            if (typeof item === 'string') return item;
            
            // Handle rich text objects with markup/value
            if (item && typeof item === 'object') {
                // Handle content wrapper: {content: {contentType: "stringItem", properties: {item: "..."}}}
                if (item.content && item.content.properties) {
                    const props = item.content.properties;
                    // Check for 'item' property first (as shown in the API structure)
                    if (props.item) {
                        return String(props.item);
                    }
                    // Fallback to other common property names
                    const textValue = props.name || 
                                    props.title || 
                                    props.text || 
                                    props.value || 
                                    props.markup || 
                                    props.html ||
                                    props.content ||
                                    props.description ||
                                    props.label;
                    if (textValue) {
                        if (typeof textValue === 'object') {
                            if (textValue.markup) return String(textValue.markup);
                            if (textValue.value) return String(textValue.value);
                            if (textValue.html) return String(textValue.html);
                            if (textValue.content) return String(textValue.content);
                            if (textValue.name) return String(textValue.name);
                            if (textValue.title) return String(textValue.title);
                            if (textValue.text) return String(textValue.text);
                        }
                        return String(textValue);
                    }
                    // Try to find any string property
                    const allProps = Object.keys(props);
                    for (const propKey of allProps) {
                        const propValue = props[propKey];
                        if (typeof propValue === 'string' && propValue.trim() !== '') {
                            return propValue;
                        }
                    }
                }
                
                // Handle Umbraco content structure: {contentType, id, properties}
                if (item.contentType && item.properties) {
                    const props = item.properties;
                    // Check for 'item' property first
                    if (props.item) {
                        return String(props.item);
                    }
                    // Try all possible property names
                    const textValue = props.name || 
                                    props.title || 
                                    props.text || 
                                    props.value || 
                                    props.markup || 
                                    props.html ||
                                    props.content ||
                                    props.description ||
                                    props.label;
                    
                    if (textValue) {
                        if (typeof textValue === 'object') {
                            if (textValue.markup) return String(textValue.markup);
                            if (textValue.value) return String(textValue.value);
                            if (textValue.html) return String(textValue.html);
                            if (textValue.content) return String(textValue.content);
                            if (textValue.name) return String(textValue.name);
                            if (textValue.title) return String(textValue.title);
                            if (textValue.text) return String(textValue.text);
                        }
                        return String(textValue);
                    }
                    
                    // Try to find any string property
                    const allProps = Object.keys(props);
                    for (const propKey of allProps) {
                        const propValue = props[propKey];
                        if (typeof propValue === 'string' && propValue.trim() !== '') {
                            return propValue;
                        }
                    }
                    return '';
                }
                
                // Handle nested structure: {content: {contentType, properties}}
                if (item.content && item.content.contentType && item.content.properties) {
                    const props = item.content.properties;
                    const textValue = props.name || 
                                    props.title || 
                                    props.text || 
                                    props.value || 
                                    props.markup || 
                                    props.html;
                    if (textValue) return String(textValue);
                }
                
                // Handle direct properties
                if (item.markup) return String(item.markup);
                if (item.value) return String(item.value);
                if (item.html) return String(item.html);
                if (item.content) {
                    if (typeof item.content === 'string') return item.content;
                    if (item.content.markup) return String(item.content.markup);
                    if (item.content.value) return String(item.content.value);
                }
            }
            
            if (item?.name) return String(item.name);
            if (item?.title) return String(item.title);
            if (item?.text) return String(item.text);
            if (item?.properties?.name) return String(item.properties.name);
            
            // Last resort: log and return empty
            console.warn('extractArrayProperty - Could not extract text from item:', item);
            return '';
        }).filter(item => item !== ''); // Remove empty strings
    }

    // If it's a nested structure with items
    if (property.items && Array.isArray(property.items)) {
        return property.items.map((item: any, index: number) => {
            if (typeof item === 'string') return item;
            
            // Handle rich text objects with markup/value
            if (item && typeof item === 'object') {
                // Handle Umbraco content structure: {contentType, id, properties}
                if (item.contentType && item.properties) {
                    const props = item.properties;
                    const textValue = props.name || 
                                    props.title || 
                                    props.text || 
                                    props.value || 
                                    props.markup || 
                                    props.html ||
                                    props.content ||
                                    props.description ||
                                    props.label;
                    
                    if (textValue) {
                        if (typeof textValue === 'object') {
                            if (textValue.markup) return String(textValue.markup);
                            if (textValue.value) return String(textValue.value);
                            if (textValue.html) return String(textValue.html);
                            if (textValue.content) return String(textValue.content);
                            if (textValue.name) return String(textValue.name);
                            if (textValue.title) return String(textValue.title);
                            if (textValue.text) return String(textValue.text);
                        }
                        return String(textValue);
                    }
                    
                    // Try to find any string property
                    const allProps = Object.keys(props);
                    for (const propKey of allProps) {
                        const propValue = props[propKey];
                        if (typeof propValue === 'string' && propValue.trim() !== '') {
                            return propValue;
                        }
                    }
                    console.warn('Array item (items) has contentType but no extractable text property:', item);
                    return '';
                }
                
                // Handle content wrapper: {content: {properties: {...}}}
                if (item.content && item.content.properties) {
                    const props = item.content.properties;
                    const textValue = props.name || 
                                    props.title || 
                                    props.text || 
                                    props.value || 
                                    props.markup || 
                                    props.html ||
                                    props.content;
                    if (textValue) {
                        if (typeof textValue === 'object') {
                            if (textValue.markup) return String(textValue.markup);
                            if (textValue.value) return String(textValue.value);
                            if (textValue.html) return String(textValue.html);
                            if (textValue.content) return String(textValue.content);
                        }
                        return String(textValue);
                    }
                }
                
                // Handle nested structure: {content: {contentType, properties}}
                if (item.content && item.content.contentType && item.content.properties) {
                    const props = item.content.properties;
                    const textValue = props.name || 
                                    props.title || 
                                    props.text || 
                                    props.value || 
                                    props.markup || 
                                    props.html;
                    if (textValue) return String(textValue);
                }
                
                // Handle direct properties
                if (item.markup) return String(item.markup);
                if (item.value) return String(item.value);
                if (item.html) return String(item.html);
                if (item.content) {
                    if (typeof item.content === 'string') return item.content;
                    if (item.content.markup) return String(item.content.markup);
                    if (item.content.value) return String(item.content.value);
                }
            }
            
            if (item?.name) return String(item.name);
            if (item?.title) return String(item.title);
            if (item?.text) return String(item.text);
            
            console.warn('extractArrayProperty (items) - Could not extract text from item:', item);
            return '';
        }).filter(item => item !== ''); // Remove empty strings
    }

    // If it's a string, try to parse as JSON
    if (typeof property === 'string') {
        try {
            const parsed = JSON.parse(property);
            if (Array.isArray(parsed)) {
                return parsed.map((item: any) => {
                    if (typeof item === 'string') return item;
                    if (item?.markup) return item.markup;
                    if (item?.value) return item.value;
                    return String(item);
                });
            }
        } catch (e) {
            // If parsing fails, return as single-item array
            return [property];
        }
    }

    return [];
}

