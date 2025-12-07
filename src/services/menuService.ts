import { fetchContentByType, fetchDescendantsChildrenByID,UmbracoContentItem,UmbracoImage,extractImageUrlFromUmbracoImage } from "./umbracoService";

export interface Menu {
    title: string;
    serviceCharge: number;
    categories: MenuCategory[];
    subcategories: Map<string | undefined, MenuSubCategory[]>;
    items: Map<string | undefined, MenuItem[]>;  
  }

  export interface MenuCategory {
    id: number;
    name: string;    
    path:string;
    openingHoursText?: string;
    sortOrder?: number;    
    subCategories?: MenuSubCategory[];    
    items?: MenuItem[];
  }

  export interface MenuSubCategory {
    id: number;
    name: string;
    categoryPath?:string;
    path:string;
    sortOrder?: number;
    items?: MenuItem[];
  }

export interface MenuItem {
    id: number;    
    name: string;
    subcategoryPath?:string;
    path?:string;
    description: string;
    price: number;
    image: string;
    sortOrder?: number;
    ingredients?: string | { markup?: string; blocks?: any[] };
  }

  export interface UmbracoMenu extends UmbracoContentItem {
    id: string;
    name: string;
    contentType: string;
    properties?: {      
      title?: string;
      description?: string | null;
      serviceCharge?: number;
      bannerImage?: string | UmbracoImage | UmbracoImage[] | null;      
      serviceChargeText?: string | null;      
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
 * Fetch menu content and categories from Umbraco Content Delivery API
 * Dynamically finds the menu ID from root, then fetches categories
 * @param parentId - Optional: The Umbraco content ID to fetch children from (if not provided, will auto-detect)
 * @returns Object containing menu item (with title) and categories array
 */
export async function fetchMenuDataFromUmbracoApi(): Promise<Menu> {
    try {
      let menu: Menu = {
        title: "",
        serviceCharge: 0,
        categories: [],
        subcategories: new Map(),
        items: new Map(),
      }; 

      const menuData :UmbracoMenu | null = await fetchContentByType("menu") as UmbracoMenu | null;
      if (!menuData) {
        throw new Error('Could not fetch menu content type from Umbraco');
      }

      menu.title = menuData.properties?.title || menuData.name || '';
      menu.serviceCharge = menuData.properties?.serviceCharge || 0;
  
      const descendantsChildren = await fetchDescendantsChildrenByID(menuData.id);
      if (!descendantsChildren) {
        throw new Error('Could not fetch descendants children from Umbraco');
      }


      let subcategories: Map<string | undefined, MenuSubCategory[]> = new Map();
      let menuItems: Map<string | undefined, MenuItem[]> = new Map();
      
      for (const item of descendantsChildren) {
        if (item?.contentType) {
          if (item.contentType === 'menuCategory') {
            menu.categories.push(populateMenuCategory(item));
          }
          else if (item.contentType === 'menuSubcategory') {
            let subCategory = populateMenuSubCategory(item);            
            if (subcategories.has(subCategory.categoryPath)) {
              subcategories.get(subCategory.categoryPath)?.push(subCategory);
            }
            else {
              subcategories.set(subCategory.categoryPath, [subCategory]);
            }
          }
          else if (item.contentType === 'menuItem') {            
            let menuItem = populateMenuItem(item);
            if (menuItems.has(menuItem.subcategoryPath)) {
              menuItems.get(menuItem.subcategoryPath)?.push(menuItem);
            }
            else {
              menuItems.set(menuItem.subcategoryPath, [populateMenuItem(item)]);
            }
          }
        }
      }
  
      if(menu.categories.length > 0) {
        menu.categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      }

      menu.categories.forEach(category => {
        category.subCategories = subcategories.get(category.path) || [];

        category.subCategories.forEach(subCategory => {
          subCategory.items = menuItems.get(subCategory.path) || [];
        });
      });  

      return menu;    
    } catch (error) {
      console.error('Error fetching menu data from Umbraco:', error);
      // Fallback to empty data if API fails
      return null as unknown as Menu;
    }
  }

  export function populateMenuCategory(item: UmbracoContentItem): MenuCategory {
    return {
        id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0,
        name: item.properties?.name || item.name || '',
        path: item.route?.path || '',
        sortOrder: item.properties?.page ? item.properties?.page : 0,
        openingHoursText: item.properties?.openingHoursText || ''
      };
  }

  export function populateMenuSubCategory(item: UmbracoContentItem): MenuSubCategory { 
    let path: string | undefined = item.route?.path;
    let categoryPath: string | undefined = path;
    // Delete last item from path and assign it
    if (item.route?.path) {
      const pathParts = item.route.path.split('/');
      pathParts.pop();
      pathParts.pop();
      categoryPath = pathParts.join('/')+'/';
    }
    
    return {
        id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0,
        name: item.properties?.name || item.name || '',        
        path: path || '',        
        categoryPath: categoryPath || ''
      };
  }

  export function populateMenuItem(item: UmbracoContentItem): MenuItem {
    let path: string | undefined = item.route?.path;
    let subcategoryPath: string | undefined = path;
    // Delete last item from path and assign it
    if (item.route?.path) {
      const pathParts = item.route.path.split('/');
      pathParts.pop();
      pathParts.pop();
      subcategoryPath = pathParts.join('/')+'/';
    }

    // Extract content - handle both string and object formats (Umbraco rich text editor returns object with markup property)
    let contentValue: string | undefined = undefined;
    if (item.properties?.content) {
      if (typeof item.properties?.content === 'string') {
        contentValue = item.properties?.content;
      } else if (typeof item.properties?.content === 'object' && item.properties?.content !== null && 'markup' in item.properties?.content) {
        contentValue = (item.properties?.content as { markup: string }).markup;
      }
    }

    // Try mainImage first, then images
    let imageUrl = extractImageUrlFromUmbracoImage(item.properties?.mainImage) || extractImageUrlFromUmbracoImage(item.properties?.images);
    let menuItem: MenuItem = {  
      id: parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) || 0,
      path: path || '',
      subcategoryPath: subcategoryPath || '',
      name: item.properties?.title || item.name || '',
      description: item.properties?.description || '',
      price: item.properties?.price ? item.properties?.price / 100 : 0,
      image: imageUrl,
      ingredients: contentValue,
    };

    return menuItem;
}