// src/pages/Events.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Events.css";

const Events = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".event-item", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.3,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const events = [
    {
      id: 1,
      title: "Opening Ceremony",
      date: "May 15, 2025",
      time: "10:00 AM - 12:00 PM",
      location: "Main Stage",
      category: "ceremony",
      description:
        "Join us for the grand opening with special performances and keynote speakers to kick off our cultural festival.",
      image: "opening-ceremony",
    },
    {
      id: 2,
      title: "Traditional Dance Performance",
      date: "May 15, 2025",
      time: "1:00 PM - 2:30 PM",
      location: "Performance Hall",
      category: "performance",
      description:
        "Experience breathtaking traditional dances from various cultures performed by skilled dance troupes.",
      image: "dance",
    },
    {
      id: 3,
      title: "Interactive Art Workshop",
      date: "May 15, 2025",
      time: "3:00 PM - 5:00 PM",
      location: "Art Studio A",
      category: "workshop",
      description:
        "Learn creative techniques and create your own artwork under the guidance of professional artists.",
      image: "workshop",
    },
    {
      id: 4,
      title: "Cultural Food Fair",
      date: "May 16, 2025",
      time: "11:00 AM - 6:00 PM",
      location: "Food Court",
      category: "food",
      description:
        "Taste a variety of delicious international cuisines prepared by local restaurants and food enthusiasts.",
      image: "food",
    },
    {
      id: 5,
      title: "Live Music Concert",
      date: "May 16, 2025",
      time: "7:00 PM - 10:00 PM",
      location: "Main Stage",
      category: "performance",
      description:
        "Enjoy an evening of amazing music performances featuring both local and international artists.",
      image: "concert",
    },
    {
      id: 6,
      title: "Film Screening",
      date: "May 17, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Theater",
      category: "film",
      description:
        "Watch a curated selection of cultural short films followed by a discussion with filmmakers.",
      image: "film",
    },
    {
      id: 7,
      title: "Closing Ceremony",
      date: "May 17, 2025",
      time: "6:00 PM - 8:00 PM",
      location: "Main Stage",
      category: "ceremony",
      description:
        "Join us as we wrap up the festival with special performances and awards presentation.",
      image: "closing",
    },
  ];

  return (
    <div className="events-container" ref={pageRef}>
      <h1 className="page-title">Festival Events</h1>

      <div className="filter-container">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Performances</button>
        <button className="filter-btn">Workshops</button>
        <button className="filter-btn">Food</button>
        <button className="filter-btn">Ceremonies</button>
      </div>

      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className={`event-item ${event.category}`}>
            <div className={`event-image ${event.image}`}>
              <div className="event-date">{event.date}</div>
            </div>
            <div className="event-content">
              <div className="event-time-location">
                <span className="event-time">{event.time}</span>
                <span className="event-location">{event.location}</span>
              </div>
              <h2 className="event-title">{event.title}</h2>
              <p className="event-description">{event.description}</p>
              <div className="event-footer">
                <span className={`event-category ${event.category}`}>
                  {event.category}
                </span>
                <button className="event-details-btn">Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
