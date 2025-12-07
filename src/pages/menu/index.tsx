import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
  fetchMenuFromUmbraco,
  fetchMenuDataFromUmbraco,
  fetchSubcategoriesFromUmbraco,
  fetchMenuItemsFromUmbraco,
  fetchMenuContentById,
  fetchMenu,
  type MenuCategory,
  type MenuItem,
  type MenuSubsection,
  type UmbracoContentItem,
} from "../../utils/api";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { MenuItemModal } from "../../components/MenuItemModal";

interface MenuPageProps {
  categorySlug?: string;
}

// Image mapping for menu items
const getItemImage = (imageKey: string): string => {
  const imageMap: { [key: string]: string } = {
    "juice-lemon":
      "https://images.unsplash.com/photo-1596434837467-1e4a2b47fff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbiUyMGp1aWNlJTIwZ2xhc3N8ZW58MXx8fHwxNzYyMDk0MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "juice-papaya":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBheWElMjBqdWljZSUyMHRyb3BpY2FsfGVufDF8fHx8MTc2MjA5NDI0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "juice-pineapple":
      "https://images.unsplash.com/photo-1666181898487-c57bf1da263f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lYXBwbGUlMjBqdWljZSUyMGZyZXNofGVufDF8fHx8MTc2MjA5NDI0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "juice-mango":
      "https://images.unsplash.com/photo-1745943585965-b6b1f8b34e8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGp1aWNlJTIwZ2xhc3N8ZW58MXx8fHwxNzYyMDk0MjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "juice-passion":
      "https://images.unsplash.com/photo-1606673993554-a5f993a16e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzaW9uJTIwZnJ1aXQlMjBqdWljZXxlbnwxfHx8fDE3NjIwOTQyNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "juice-avocado":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "juice-banana":
      "https://images.unsplash.com/photo-1596434837467-1e4a2b47fff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "juice-orange":
      "https://images.unsplash.com/photo-1596434837467-1e4a2b47fff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "juice-watermelon":
      "https://images.unsplash.com/photo-1596434837467-1e4a2b47fff9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "juice-mixed":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "shake-banana":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "shake-papaya":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "shake-avocado":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "shake-mango":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "shake-chocolate":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "shake-mixed":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-hot-2":
      "https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-4":
      "https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-hot-cinnamon":
      "https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-hot-black-coffee":
      "https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-hot-1":
      "https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjYXBwdWNjaW5vfGVufDF8fHx8MTc2MjAxODkwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "beverage-2":
      "https://images.unsplash.com/photo-1730411317769-b991ec3951d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-soft-1":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-soft-fanta":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-soft-soda":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-other-1":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "beverage-other-2":
      "https://images.unsplash.com/photo-1669055110073-6099dcb0a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "breakfast-1":
      "https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBlZ2dzJTIwdG9hc3R8ZW58MXx8fHwxNzYyMDk0MjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "breakfast-2":
      "https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "breakfast-3":
      "https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "breakfast-4":
      "https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "breakfast-5":
      "https://images.unsplash.com/photo-1616902685816-fbe1aeb3ea79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "snack-1":
      "https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMGFwcGV0aXplcnxlbnwxfHx8fDE3NjIwOTQyNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "snack-2":
      "https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "snack-3":
      "https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "snack-4":
      "https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "snack-5":
      "https://images.unsplash.com/photo-1761315413785-0bf98364ceab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "appetizer-1":
      "https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZCUyMGZyZXNofGVufDF8fHx8MTc2MjAwMTA4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "appetizer-2":
      "https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "appetizer-3":
      "https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "appetizer-4":
      "https://images.unsplash.com/photo-1739436776460-35f309e3f887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "main-1":
      "https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwZmlzaHxlbnwxfHx8fDE3NjIwMDE2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "main-2":
      "https://images.unsplash.com/photo-1569723650154-b787178cc880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc3RlYWslMjBwbGF0ZXxlbnwxfHx8fDE3NjIwMzgyMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "main-3":
      "https://images.unsplash.com/photo-1569723650154-b787178cc880?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "main-4":
      "https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "seafood-1":
      "https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "seafood-2":
      "https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "seafood-3":
      "https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "seafood-4":
      "https://images.unsplash.com/photo-1720514091975-a322721f0dc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "dessert-1":
      "https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjE5OTgzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "dessert-2":
      "https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "dessert-3":
      "https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "dessert-4":
      "https://images.unsplash.com/photo-1644158776192-2d24ce35da1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  };

  return (
    imageMap[imageKey] ||
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
  );
};

export default function MenuPage({
  categorySlug,
}: MenuPageProps) {
  const [allCategories, setAllCategories] = useState<
    MenuCategory[]
  >([]);
  const [activeCategory, setActiveCategory] =
    useState<MenuCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] =
    useState<MenuItem | null>(null);
  const [menuTitle, setMenuTitle] =
    useState<string>("Our Menu");
  const [serviceCharge, setServiceCharge] = useState<
    number | null
  >(null);

  // Helper function to generate slug from category name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Helper function to check if content has actual text (not just HTML tags or whitespace)
  // Handles both string format and object format with markup property
  const hasContent = (
    content: string | { markup?: string } | undefined,
  ): boolean => {
    if (!content) {
      return false;
    }

    // Extract markup if it's an object
    let contentString: string | undefined;
    if (typeof content === "string") {
      contentString = content;
    } else if (
      typeof content === "object" &&
      content !== null &&
      "markup" in content
    ) {
      contentString = content.markup;
    } else {
      return false;
    }

    if (!contentString || typeof contentString !== "string") {
      return false;
    }

    // Strip HTML tags and check if there's actual text content
    const textContent = contentString
      .replace(/<[^>]*>/g, "")
      .trim();
    return textContent.length > 0;
  };

  useEffect(() => {
    const loadMenu = async () => {
      try {
        // Fetch menu data (including menu item with title) and categories from Umbraco API
        const menu = await fetchMenuFromUmbraco();

        // Extract menu title from menu item properties
        if (menu && menu.data?.properties?.title) {
          setMenuTitle(menu.data?.properties.title);
        } else if (menu.data && menu.data?.name) {
          setMenuTitle(menu.data?.name);
        }

        // Extract service charge from menu item properties
        if (
          menu.data &&
          menu.data?.properties?.serviceCharge !== undefined
        ) {
          setServiceCharge(menu.data?.properties.serviceCharge);
        }

        // Build categories completely from Umbraco data - no static fallbacks
        let mappedCategories: MenuCategory[] = [];

        // If Umbraco API returns no categories, fallback to static data
        if (menu.categories.length === 0) {
          console.warn(
            "No Umbraco categories found, falling back to static menu data",
          );
          try {
            const staticMenuData = await fetchMenu();
            if (
              staticMenuData &&
              staticMenuData.categories &&
              staticMenuData.categories.length > 0
            ) {
              mappedCategories =
                staticMenuData.categories as MenuCategory[];
            }
          } catch (fallbackError) {
            console.error(
              "Error loading static menu fallback:",
              fallbackError,
            );
          }
        } else if (menu.categories.length > 0) {
          // Build categories entirely from Umbraco
          mappedCategories = await Promise.all(
            menu.categories.map(
              async (umbracoCategory, index) => {
                // Generate unique ID from Umbraco ID to ensure uniqueness
                const uniqueId =
                  parseInt(
                    umbracoCategory.id
                      .replace(/-/g, "")
                      .substring(0, 8),
                    16,
                  ) || index + 1;

                // Fetch full category details to get all properties (including openingHoursText)
                let fullCategory = umbracoCategory;

                // Fetch subcategories from Umbraco
                let subsections: MenuSubsection[] = [];
                let directItems: MenuItem[] = [];

                try {
                  const umbracoSubcategories =
                    menu.subcategories.get(
                      umbracoCategory.route?.path,
                    ) || []; //await fetchSubcategoriesFromUmbraco(umbracoCategory.id);
                  console.log(
                    `Fetched ${umbracoSubcategories.length} subcategories for ${umbracoCategory.name}`,
                    umbracoSubcategories,
                  );

                  if (umbracoSubcategories.length > 0) {
                    // Build subsections from Umbraco subcategories
                    subsections = await Promise.all(
                      umbracoSubcategories.map(
                        async (
                          umbracoSubcategory,
                          subIndex,
                        ) => {
                          try {
                            // Fetch menu items for this subcategory
                            console.log(
                              `Fetching items for subcategory: ${umbracoSubcategory.name} (ID: ${umbracoSubcategory.id})`,
                            );
                            const umbracoItems =
                              menu.items.get(
                                umbracoSubcategory.route?.path,
                              ) || []; //await fetchMenuItemsFromUmbraco(umbracoSubcategory.id);
                            console.log(
                              `Fetched ${umbracoItems.length} items for ${umbracoSubcategory.name}`,
                              umbracoItems,
                            );

                            return {
                              id: subIndex + 1,
                              name: umbracoSubcategory.name,
                              items: umbracoItems, // Only Umbraco items, no fallback
                            };
                          } catch (error) {
                            console.error(
                              `Error fetching items for subcategory ${umbracoSubcategory.name}:`,
                              error,
                            );
                            // Return empty subsection on error - no static fallback
                            return {
                              id: subIndex + 1,
                              name: umbracoSubcategory.name,
                              items: [], // Empty array on error
                            };
                          }
                        },
                      ),
                    );
                  } else {
                    // No subsections - try to fetch direct items
                    try {
                      console.log(
                        `No subsections found, fetching direct items for category: ${umbracoCategory.name}`,
                      );
                      directItems =
                        await fetchMenuItemsFromUmbraco(
                          umbracoCategory.id,
                        );
                      console.log(
                        `Fetched ${directItems.length} direct items for ${umbracoCategory.name}`,
                      );
                    } catch (error) {
                      console.error(
                        `Error fetching direct items for ${umbracoCategory.name}:`,
                        error,
                      );
                      directItems = [];
                    }
                  }
                } catch (error) {
                  console.error(
                    `Error fetching subcategories for ${umbracoCategory.name}:`,
                    error,
                  );
                  // Try to fetch direct items as fallback
                  try {
                    directItems =
                      await fetchMenuItemsFromUmbraco(
                        umbracoCategory.id,
                      );
                  } catch (itemError) {
                    console.error(
                      `Error fetching direct items for ${umbracoCategory.name}:`,
                      itemError,
                    );
                    directItems = [];
                  }
                }

                // Build category from Umbraco data only
                const category: MenuCategory = {
                  id: uniqueId,
                  name: fullCategory.name,
                  openingHoursText:
                    fullCategory.properties?.openingHoursText ||
                    undefined,
                };

                if (subsections.length > 0) {
                  category.subsections = subsections;
                } else if (directItems.length > 0) {
                  category.items = directItems;
                }

                return category;
              },
            ),
          );
        }

        setAllCategories(mappedCategories);

        // Set active category based on slug or default to first category
        // Ensure we only set one active category
        if (categorySlug) {
          const foundCategory = mappedCategories.find(
            (c: MenuCategory) =>
              generateSlug(c.name) === categorySlug,
          );
          if (foundCategory) {
            setActiveCategory(foundCategory);
          } else if (mappedCategories.length > 0) {
            setActiveCategory(mappedCategories[0]);
          }
        } else {
          if (mappedCategories.length > 0) {
            setActiveCategory(mappedCategories[0]);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading menu:", error);
        // Log the full error for debugging
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        // No fallback - return empty categories
        setAllCategories([]);
        setActiveCategory(null);
        setLoading(false);
      }
    };

    loadMenu();
  }, [categorySlug]);

  // Sync active category with allCategories when categories change (only if activeCategory exists)
  useEffect(() => {
    if (activeCategory && allCategories.length > 0) {
      // Find the exact category from allCategories to ensure we're using the same reference
      const exactCategory = allCategories.find(
        (c) =>
          c.id === activeCategory.id &&
          c.name === activeCategory.name,
      );
      // Only update if we found a match and it's a different object reference
      if (
        exactCategory &&
        (exactCategory.id !== activeCategory.id ||
          exactCategory.name !== activeCategory.name)
      ) {
        setActiveCategory(exactCategory);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCategories.length]);

  const handleCategoryChange = (category: MenuCategory) => {
    // Ensure we're setting the exact category object from allCategories
    const exactCategory =
      allCategories.find(
        (c) => c.id === category.id && c.name === category.name,
      ) || category;
    setActiveCategory(exactCategory);
    const slug = generateSlug(exactCategory.name);
    window.history.pushState({}, "", `/menu/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render error state with header and footer
  if (
    !loading &&
    !activeCategory &&
    allCategories.length === 0
  ) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="mb-4 text-gray-900">Menu Not Found</h1>
          <p className="text-gray-700 mb-8">
            Unable to load the menu.
          </p>
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
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-2">
            {menuTitle}
          </h1>
        </div>

        {/* Loading State - Show loader in content area while keeping header/footer visible */}
        {loading ? (
          <div className="container mx-auto px-4 py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5c2e3e] mx-auto"></div>
              <p className="mt-6 text-gray-700">
                Loading menu...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <div className="border-b border-gray-300 sticky top-[128px] bg-white z-40 shadow-sm">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center gap-8 pb-4 pt-2">
                  {allCategories.map((category) => {
                    // Strict matching: both ID and name must match to avoid duplicate active states
                    const isActive =
                      activeCategory &&
                      activeCategory.id === category.id &&
                      activeCategory.name === category.name;
                    return (
                      <button
                        key={`${category.id}-${category.name}`}
                        onClick={() =>
                          handleCategoryChange(category)
                        }
                        className={`relative pb-2 transition-colors ${
                          isActive
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {category.name}
                        {isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5c2e3e]"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Menu Items - Only show active category content */}
            {activeCategory && (
              <div className="container mx-auto px-4 py-12">
                {activeCategory.subsections ? (
                  // Render subsections (for Beverages and Breakfast)
                  <>
                    {activeCategory.subsections.map(
                      (subsection) => (
                        <div
                          key={subsection.id}
                          className="mb-16"
                        >
                          <h2 className="text-[#5c2e3e] mb-8 uppercase tracking-wide">
                            {subsection.name}
                          </h2>
                          <div
                            className={
                              subsection.name
                                .toLowerCase()
                                .includes("western")
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                            }
                          >
                            {subsection.items.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  // Open modal for items with content (rich text)
                                  if (
                                    hasContent(item.ingredients)
                                  ) {
                                    setSelectedItem(item);
                                  }
                                }}
                                className={`group bg-white rounded-2xl overflow-hidden hover:bg-gray-50 transition-colors shadow-md border border-gray-100 ${
                                  hasContent(item.ingredients)
                                    ? "cursor-pointer"
                                    : ""
                                }`}
                              >
                                {/* Standard layout for all items */}
                                <div className="flex items-center gap-3 h-full p-3">
                                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#3a3a3a]">
                                    <ImageWithFallback
                                      src={
                                        item.image &&
                                        typeof item.image ===
                                          "string" &&
                                        (item.image.startsWith(
                                          "http",
                                        ) ||
                                          item.image.startsWith(
                                            "//",
                                          ) ||
                                          item.image.startsWith(
                                            "/",
                                          ))
                                          ? item.image
                                          : getItemImage(
                                              item.image || "",
                                            )
                                      }
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-gray-900 mb-1 truncate">
                                      {item.name}
                                    </h3>
                                    {item.description && (
                                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                        {item.description}
                                      </p>
                                    )}
                                    <p className="text-teal-600">
                                      LKR {item.price * 100}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}

                    {/* Category Hours Footer */}
                    {(activeCategory.openingHoursText ||
                      serviceCharge !== null) && (
                      <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="bg-[#5c2e3e] text-white px-8 py-6 rounded-lg text-center">
                          {activeCategory.openingHoursText && (
                            <p className="text-lg mb-2">
                              {activeCategory.openingHoursText}
                            </p>
                          )}
                          {serviceCharge !== null && (
                            <p
                              className={`text-sm opacity-90 ${activeCategory.openingHoursText ? "" : "text-lg"}`}
                            >
                              (All prices are subject to{" "}
                              {(serviceCharge * 100).toFixed(0)}
                              % service charge)
                            </p>
                          )}
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
                            onClick={() => {
                              // Open modal for items with content (rich text)
                              if (
                                hasContent(item.ingredients)
                              ) {
                                setSelectedItem(item);
                              }
                            }}
                            className={`group ${
                              hasContent(item.ingredients)
                                ? "cursor-pointer"
                                : ""
                            }`}
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-[#3a3a3a]">
                              <ImageWithFallback
                                src={
                                  item.image &&
                                  typeof item.image ===
                                    "string" &&
                                  (item.image.startsWith(
                                    "http",
                                  ) ||
                                    item.image.startsWith(
                                      "//",
                                    ) ||
                                    item.image.startsWith("/"))
                                    ? item.image
                                    : getItemImage(
                                        item.image || "",
                                      )
                                }
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="text-center">
                              <h3 className="text-white mb-1">
                                {item.name}
                              </h3>
                              <p className="text-amber-400">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Hours Footer */}
                    {(activeCategory.openingHoursText ||
                      serviceCharge !== null) && (
                      <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="bg-[#5c2e3e] text-white px-8 py-6 rounded-lg text-center">
                          {activeCategory.openingHoursText && (
                            <p className="text-lg mb-2">
                              {activeCategory.openingHoursText}
                            </p>
                          )}
                          {serviceCharge !== null && (
                            <p
                              className={`text-sm opacity-90 ${activeCategory.openingHoursText ? "" : "text-lg"}`}
                            >
                              (All prices are subject to{" "}
                              {(serviceCharge * 100).toFixed(0)}
                              % service charge)
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
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