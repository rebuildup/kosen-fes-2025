// src/pages/Events.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Events.css";

type EventCategory =
  | "all"
  | "ceremony"
  | "performance"
  | "workshop"
  | "food"
  | "film";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  likes?: number;
  comments?: number;
  attending?: number;
}

const Events = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<EventCategory>("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize events data
  useEffect(() => {
    // Simulate loading data from an API
    setIsLoading(true);
    setTimeout(() => {
      setEvents(eventsData);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        gsap.from(".page-title", {
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(".filter-tags", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.2,
        });

        gsap.from(".event-card", {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.4,
        });
      }, pageRef);

      return () => ctx.revert();
    }
  }, [isLoading]);

  // Filter events when active filter changes
  useEffect(() => {
    if (!isLoading && activeFilter !== "all") {
      // Animate out
      gsap.to(".event-card", {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          // Filter events and then animate back in
          gsap.from(".event-card", {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.1,
          });
        },
      });
    }
  }, [activeFilter, isLoading]);

  const handleFilterChange = (category: EventCategory) => {
    setActiveFilter(category);
  };

  // Filter events based on active filter
  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) => event.category === activeFilter);

  // Sample events data
  const eventsData: Event[] = [
    {
      id: 1,
      title: "Opening Ceremony",
      date: "May 15, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Main Stage",
      category: "ceremony",
      description:
        "Join us for the grand opening of Cultural Festival 2025 with special performances, keynote speakers, and a special ribbon-cutting ceremony by the Mayor. Don't miss this exciting kickoff to our three-day celebration of culture and arts!",
      image: "https://source.unsplash.com/random/600x400/?ceremony",
      likes: 245,
      comments: 37,
      attending: 512,
    },
    {
      id: 2,
      title: "Traditional Dance Performance",
      date: "May 15, 2025",
      time: "1:00 PM - 2:30 PM",
      location: "Performance Hall",
      category: "performance",
      description:
        "Experience breathtaking traditional dances from various cultures performed by skilled dance troupes from around the world. Featured performances include traditional Japanese, Indian, Mexican, and African dances.",
      image: "https://source.unsplash.com/random/600x400/?dance",
      likes: 189,
      comments: 28,
      attending: 304,
    },
    {
      id: 3,
      title: "Interactive Art Workshop",
      date: "May 15, 2025",
      time: "3:00 PM - 5:00 PM",
      location: "Art Studio A",
      category: "workshop",
      description:
        "Learn creative techniques and create your own artwork under the guidance of professional artists. All materials provided. This workshop is suitable for all skill levels, from beginners to advanced artists.",
      image: "https://source.unsplash.com/random/600x400/?art,workshop",
      likes: 122,
      comments: 19,
      attending: 75,
    },
    {
      id: 4,
      title: "Cultural Food Fair",
      date: "May 16, 2025",
      time: "11:00 AM - 6:00 PM",
      location: "Food Court",
      category: "food",
      description:
        "Taste a variety of delicious international cuisines prepared by local restaurants and food enthusiasts. Over 30 food stalls representing cuisines from all continents. Food tasting tickets available at the entrance.",
      image: "https://source.unsplash.com/random/600x400/?food,international",
      likes: 356,
      comments: 64,
      attending: 820,
    },
    {
      id: 5,
      title: "Live Music Concert",
      date: "May 16, 2025",
      time: "7:00 PM - 10:00 PM",
      location: "Main Stage",
      category: "performance",
      description:
        "Enjoy an evening of amazing music performances featuring both local and international artists. The concert will showcase various music genres including classical, jazz, rock, and world music.",
      image: "https://source.unsplash.com/random/600x400/?concert",
      likes: 412,
      comments: 87,
      attending: 1250,
    },
    {
      id: 6,
      title: "Film Screening",
      date: "May 17, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Theater",
      category: "film",
      description:
        "Watch a curated selection of cultural short films followed by a discussion with filmmakers. This year's theme focuses on cultural heritage and modern interpretations of traditional stories.",
      image: "https://source.unsplash.com/random/600x400/?cinema",
      likes: 98,
      comments: 31,
      attending: 156,
    },
    {
      id: 7,
      title: "Culinary Workshop",
      date: "May 17, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Cooking Studio",
      category: "workshop",
      description:
        "Learn to cook traditional dishes from around the world with our expert chefs. In this workshop, you'll prepare and taste three different international recipes. All ingredients and cooking tools provided.",
      image: "https://source.unsplash.com/random/600x400/?cooking,workshop",
      likes: 134,
      comments: 42,
      attending: 68,
    },
    {
      id: 8,
      title: "Closing Ceremony",
      date: "May 17, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Main Stage",
      category: "ceremony",
      description:
        "Join us as we wrap up the festival with special performances, awards presentation, and a spectacular fireworks display. We'll announce the winners of various festival competitions and celebrate the success of this year's event.",
      image: "https://source.unsplash.com/random/600x400/?fireworks",
      likes: 287,
      comments: 53,
      attending: 743,
    },
  ];

  return (
    <div className="events-page" ref={pageRef}>
      <div className="events-header">
        <h1 className="page-title">Festival Events</h1>

        {/* Instagram-like search bar */}
        <div className="search-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search events"
            className="search-input"
          />
        </div>

        {/* Instagram-like filter tags */}
        <div className="filter-tags">
          <button
            className={`filter-tag ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`filter-tag ${
              activeFilter === "ceremony" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("ceremony")}
          >
            Ceremonies
          </button>
          <button
            className={`filter-tag ${
              activeFilter === "performance" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("performance")}
          >
            Performances
          </button>
          <button
            className={`filter-tag ${
              activeFilter === "workshop" ? "active" : ""
            }`}
            onClick={() => handleFilterChange("workshop")}
          >
            Workshops
          </button>
          <button
            className={`filter-tag ${activeFilter === "food" ? "active" : ""}`}
            onClick={() => handleFilterChange("food")}
          >
            Food
          </button>
          <button
            className={`filter-tag ${activeFilter === "film" ? "active" : ""}`}
            onClick={() => handleFilterChange("film")}
          >
            Film
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-container">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
                <div className="event-category-badge">{event.category}</div>
                <div className="event-date-badge">{event.date}</div>
              </div>
              <div className="event-content">
                <h2 className="event-title">{event.title}</h2>
                <div className="event-details">
                  <div className="event-detail">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-stats">
                  <div className="event-stat">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{event.likes}</span>
                  </div>
                  <div className="event-stat">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <span>{event.comments}</span>
                  </div>
                  <div className="event-stat">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{event.attending} attending</span>
                  </div>
                </div>
                <div className="event-actions">
                  <button className="event-action-btn interested">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    Interested
                  </button>
                  <button className="event-action-btn going">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Going
                  </button>
                  <button className="event-action-btn share">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
