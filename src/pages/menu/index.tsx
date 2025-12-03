import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { fetchMenu, fetchMenuCategoriesFromUmbraco, fetchSubcategoriesFromUmbraco, fetchMenuItemsFromUmbraco, type MenuCategory, type MenuItem } from '../../utils/api';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { MenuItemModal } from '../../components/MenuItemModal';

interface MenuPageProps {
  categorySlug?: string;
}

// Image mapping for menu items
const getItemImage = (imageKey: string): string => {
  const imageMap: { [key: string]: string } = {
    'juice-lemon': 'https://images.unsplash.com/photo-1596434837467-1e4a2b47fff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMGp1aWNlJTIwZ2xhc3N8ZW58MXx8fHwxNzYyMDk0MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'juice-papaya': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBheWElMjBqdWljZSUyMHRyb3BpY2FsfGVufDF8fHx8MTc2MjA5NDI0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'juice-pineapple': 'https://images.unsplash.com/photo-1666181898487-c57bf1da263f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lYXBwbGUlMjBqdWljZSUyMGZyZXNofGVufDF8fHx8MTc2MjA5NDI0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'juice-mango': 'https://images.unsplash.com/photo-1745943585965-b6b1f8b34e8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGp1aWNlJTIwZ2xhc3N8ZW58MXx8fHwxNzYyMDk0MjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'juice-passion': 'https://images.unsplash.com/photo-1606673993554-a5f993a16e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzaW9uJTIwZnJ1aXQlMjBqdWljZXxlbnwxfHx8fDE3NjIwOTQyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'juice-avocado': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'juice-banana': 'https://images.unsplash.com/photo-1596434837467-1e4a2b47fff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'juice-orange': 'https://images.unsplash.com/photo-1596434837467-1e4a2b47fff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'juice-watermelon': 'https://images.unsplash.com/photo-1596434837467-1e4a2b47fff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'juice-mixed': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'shake-banana': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'shake-papaya': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'shake-avocado': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'shake-mango': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'shake-chocolate': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'shake-mixed': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-hot-2': 'https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-4': 'https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-hot-cinnamon': 'https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-hot-black-coffee': 'https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-hot-1': 'https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjYXBwdWNjaW5vfGVufDF8fHx8MTc2MjAxODkwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'beverage-2': 'https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-soft-1': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-soft-fanta': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-soft-soda': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-other-1': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'beverage-other-2': 'https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'breakfast-1': 'https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBlZ2dzJTIwdG9hc3R8ZW58MXx8fHwxNzYyMDk0MjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'breakfast-2': 'https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'breakfast-3': 'https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'breakfast-4': 'https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'breakfast-5': 'https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'snack-1': 'https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMGFwcGV0aXplcnxlbnwxfHx8fDE3NjIwOTQyNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'snack-2': 'https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'snack-3': 'https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'snack-4': 'https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'snack-5': 'https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'appetizer-1': 'https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGZyZXNofGVufDF8fHx8MTc2MjAwMTA4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'appetizer-2': 'https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'appetizer-3': 'https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'appetizer-4': 'https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'main-1': 'https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwZmlzaHxlbnwxfHx8fDE3NjIwMDE2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'main-2': 'https://images.unsplash.com/photo-1569723650154-b787178cc880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWslMjBwbGF0ZXxlbnwxfHx8fDE3NjIwMzgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'main-3': 'https://images.unsplash.com/photo-1569723650154-b787178cc880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'main-4': 'https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'seafood-1': 'https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'seafood-2': 'https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'seafood-3': 'https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'seafood-4': 'https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'dessert-1': 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjE5OTgzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'dessert-2': 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'dessert-3': 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'dessert-4': 'https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  };

  return imageMap[imageKey] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
};

export default function MenuPage({ categorySlug }: MenuPageProps) {
  const [allCategories, setAllCategories] = useState<MenuCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<MenuCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Helper function to generate slug from category name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  // Category hours information
  const categoryHours: { [key: string]: string } = {
    'Beverages': 'Available: All day 8:00 AM - 10:00 PM',
    'Breakfast': 'Breakfast Hours: 8:00 AM - 11:00 AM daily',
    'Snacks': 'Snacks Hours: 11:00 AM - 6:00 PM daily',
    'Starters': 'Available: 12:00 PM - 10:00 PM daily',
    'Main Course': 'Available: 12:00 PM - 10:00 PM daily',
    'Seafood': 'Available: 12:00 PM - 10:00 PM daily',
    'Desserts': 'Available: All day 8:00 AM - 10:00 PM',
  };

  useEffect(() => {
    const loadMenu = async () => {
      try {
        // Fetch menu categories from Umbraco API (with IDs)
        const umbracoCategories = await fetchMenuCategoriesFromUmbraco();
        
        // Fetch menu data (items)
        const menuResponse = await fetchMenu();
        const categoriesArray = menuResponse.categories || [];
        
        // Map Umbraco category names to menu categories and fetch subcategories
        let mappedCategories: MenuCategory[] = [];
        
        if (umbracoCategories.length > 0) {
          // Map Umbraco categories to existing menu data and fetch subcategories
          mappedCategories = await Promise.all(
            umbracoCategories.map(async (umbracoCategory, index) => {
              // Try to find matching category in static data by name
              const matchingCategory = categoriesArray.find(
                (cat) => cat.name.toLowerCase() === umbracoCategory.name.toLowerCase()
              );
              
              let category: MenuCategory;
              
              if (matchingCategory) {
                category = { ...matchingCategory, name: umbracoCategory.name };
              } else {
                // If no match found, use the category at the same index or create a new one
                const fallbackCategory = categoriesArray[index] || categoriesArray[0];
                category = { ...fallbackCategory, name: umbracoCategory.name, id: index + 1 };
              }
              
              // If category has subsections, fetch subcategories from Umbraco and update names and items
              if (category.subsections && category.subsections.length > 0) {
                const umbracoSubcategories = await fetchSubcategoriesFromUmbraco(umbracoCategory.id);
                
                // Map Umbraco subcategories to existing subsections
                if (umbracoSubcategories.length > 0) {
                  category.subsections = await Promise.all(
                    category.subsections.map(async (subsection, subIndex) => {
                      const umbracoSubcategory = umbracoSubcategories[subIndex];
                      
                      if (umbracoSubcategory) {
                        // Fetch menu items for this subcategory
                        const umbracoItems = await fetchMenuItemsFromUmbraco(umbracoSubcategory.id);
                        
                        // Update subsection with Umbraco name and items
                        return {
                          ...subsection,
                          name: umbracoSubcategory.name,
                          items: umbracoItems.length > 0 ? umbracoItems : subsection.items,
                        };
                      }
                      return subsection;
                    })
                  );
                }
              }
              
              return category;
            })
          );
        } else {
          // Fallback to static categories if Umbraco API fails
          mappedCategories = categoriesArray;
        }
        
        setAllCategories(mappedCategories);
        
        // Set active category based on slug or default to first category
        if (categorySlug) {
          const foundCategory = mappedCategories.find((c: MenuCategory) => 
            generateSlug(c.name) === categorySlug
          );
          setActiveCategory(foundCategory || mappedCategories[0]);
        } else {
          setActiveCategory(mappedCategories[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading menu:', error);
        // Fallback to static menu data
        const menuResponse = await fetchMenu();
        const categoriesArray = menuResponse.categories || [];
        setAllCategories(categoriesArray);
        setActiveCategory(categoriesArray[0] || null);
        setLoading(false);
      }
    };

    loadMenu();
  }, [categorySlug]);

  const handleCategoryChange = (category: MenuCategory) => {
    setActiveCategory(category);
    const slug = generateSlug(category.name);
    window.history.pushState({}, '', `/menu/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c2e3e] mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!activeCategory) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="mb-4 text-gray-900">Menu Not Found</h1>
          <p className="text-gray-700 mb-8">Unable to load the menu.</p>
          <a 
            href="/"
            className="inline-block bg-[#5c2e3e] text-white px-8 py-3 rounded-lg hover:bg-[#4a2530] transition-colors"
          >
            Return to Homepage
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Menu Content */}
      <div className="pt-24 pb-16">
        {/* Title */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-2">VillaWatuna Restaurant</h1>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-300 sticky top-[128px] bg-white z-40 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 pb-4 pt-2">
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category)}
                  className={`relative pb-2 transition-colors ${
                    activeCategory.id === category.id
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {category.name}
                  {activeCategory.id === category.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5c2e3e]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="container mx-auto px-4 py-12">
          {activeCategory.subsections ? (
            // Render subsections (for Beverages and Breakfast)
            <>
              {activeCategory.subsections.map((subsection) => (
                <div key={subsection.id} className="mb-16">
                  <h2 className="text-[#5c2e3e] mb-8 uppercase tracking-wide">{subsection.name}</h2>
                  <div className={subsection.name.toLowerCase().includes('western') 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                  }>
                    {subsection.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          // Open modal for items with ingredients (Breakfast, Main Course, etc.)
                          if (item.ingredients) {
                            setSelectedItem(item);
                          }
                        }}
                        className={`group bg-white rounded-2xl overflow-hidden hover:bg-gray-50 transition-colors shadow-md border border-gray-100 ${
                          item.ingredients ? 'cursor-pointer' : ''
                        }`}
                      >
                        {/* Standard layout for all items */}
                        <div className="flex items-center gap-3 h-full p-3">
                          <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#3a3a3a]">
                            <ImageWithFallback
                              src={
                                item.image && 
                                typeof item.image === 'string' && 
                                (item.image.startsWith('http') || item.image.startsWith('//') || item.image.startsWith('/'))
                                  ? item.image 
                                  : getItemImage(item.image || '')
                              }
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 mb-1 truncate">{item.name}</h3>
                            {item.description && (
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                            )}
                            <p className="text-teal-600">LKR {item.price * 100}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Category Hours Footer */}
              {categoryHours[activeCategory.name] && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="bg-[#5c2e3e] text-white px-8 py-6 rounded-lg text-center">
                    <p className="text-lg mb-2">{categoryHours[activeCategory.name]}</p>
                    <p className="text-sm opacity-90">(All prices are subject to 10% service charge)</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Render direct items (for other categories)
            <>
              <div className="mb-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {activeCategory.items?.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-[#3a3a3a]">
                        <ImageWithFallback
                          src={
                            item.image && 
                            typeof item.image === 'string' && 
                            (item.image.startsWith('http') || item.image.startsWith('//') || item.image.startsWith('/'))
                              ? item.image 
                              : getItemImage(item.image || '')
                          }
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="text-white mb-1">{item.name}</h3>
                        <p className="text-amber-400">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Category Hours Footer */}
              {categoryHours[activeCategory.name] && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="bg-[#5c2e3e] text-white px-8 py-6 rounded-lg text-center">
                    <p className="text-lg mb-2">{categoryHours[activeCategory.name]}</p>
                    <p className="text-sm opacity-90">(All prices are subject to 10% service charge)</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Menu Item Modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <Footer />
    </div>
  );
}