import { useState, useEffect } from "react";
import Homepage from "./pages/homepage";
import ToursPage from "./pages/tours";
import RoomDetailPage from "./pages/rooms";
import RoomsListPage from "./pages/rooms-list";
import ContactPage from "./pages/contact";
import MenuPage from "./pages/menu";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");

  useEffect(() => {
    // Get initial page from URL
    const path = window.location.pathname;
    setCurrentPage(path);

    // Handle browser back/forward
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () =>
      window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href) {
        const url = new URL(link.href);
        // Only handle internal links
        if (
          url.origin === window.location.origin &&
          !link.target
        ) {
          e.preventDefault();
          const path = url.pathname + url.hash;

          if (url.pathname !== window.location.pathname) {
            window.history.pushState({}, "", path);
            setCurrentPage(url.pathname);
          } else if (url.hash) {
            // Handle hash navigation on same page
            window.location.hash = url.hash;
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () =>
      document.removeEventListener("click", handleClick);
  }, []);

  // Render current page
  if (currentPage === "/tours") {
    return <ToursPage />;
  }

  if (currentPage === "/contact") {
    return <ContactPage />;
  }

  if (currentPage === "/rooms") {
    return <RoomsListPage />;
  }

  // Handle room detail pages
  if (currentPage.startsWith("/rooms/")) {
    const roomSlug = currentPage.replace("/rooms/", "");
    return <RoomDetailPage roomSlug={roomSlug} />;
  }

  // Handle menu category pages
  if (currentPage.startsWith("/menu/")) {
    const categorySlug = currentPage.replace("/menu/", "");
    return <MenuPage categorySlug={categorySlug} />;
  }

  return <Homepage />;
}