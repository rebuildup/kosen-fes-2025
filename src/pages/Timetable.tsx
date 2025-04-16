// src/pages/Timetable.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Timetable.css";

type Event = {
  id: number;
  title: string;
  start: string;
  end: string;
  location: string;
  category: string;
};

const Timetable = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeDay, setActiveDay] = useState("day1");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".timetable-tabs", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.3,
      });

      gsap.from(".time-slot", {
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.5,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const switchDay = (day: string) => {
    setActiveDay(day);

    // Animate events when switching days
    gsap.fromTo(
      ".time-event",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  };

  const schedule: Record<string, Event[]> = {
    day1: [
      {
        id: 1,
        title: "Registration",
        start: "09:00",
        end: "10:00",
        location: "Main Entrance",
        category: "general",
      },
      {
        id: 2,
        title: "Opening Ceremony",
        start: "10:00",
        end: "12:00",
        location: "Main Stage",
        category: "ceremony",
      },
      {
        id: 3,
        title: "Traditional Dance",
        start: "13:00",
        end: "14:30",
        location: "Performance Hall",
        category: "performance",
      },
      {
        id: 4,
        title: "Art Workshop",
        start: "15:00",
        end: "17:00",
        location: "Art Studio A",
        category: "workshop",
      },
      {
        id: 5,
        title: "Welcome Dinner",
        start: "18:00",
        end: "20:00",
        location: "Food Court",
        category: "food",
      },
    ],
    day2: [
      {
        id: 6,
        title: "Yoga Session",
        start: "08:00",
        end: "09:00",
        location: "Garden Area",
        category: "workshop",
      },
      {
        id: 7,
        title: "Food Fair Opens",
        start: "11:00",
        end: "18:00",
        location: "Food Court",
        category: "food",
      },
      {
        id: 8,
        title: "Panel Discussion",
        start: "13:00",
        end: "14:30",
        location: "Conference Room",
        category: "talk",
      },
      {
        id: 9,
        title: "Photography Workshop",
        start: "15:00",
        end: "16:30",
        location: "Art Studio B",
        category: "workshop",
      },
      {
        id: 10,
        title: "Live Music Concert",
        start: "19:00",
        end: "22:00",
        location: "Main Stage",
        category: "performance",
      },
    ],
    day3: [
      {
        id: 11,
        title: "Meditation Session",
        start: "08:00",
        end: "09:00",
        location: "Garden Area",
        category: "workshop",
      },
      {
        id: 12,
        title: "Culinary Workshop",
        start: "10:00",
        end: "12:00",
        location: "Food Court",
        category: "workshop",
      },
      {
        id: 13,
        title: "Film Screening",
        start: "14:00",
        end: "16:00",
        location: "Theater",
        category: "film",
      },
      {
        id: 14,
        title: "Award Ceremony",
        start: "16:30",
        end: "17:30",
        location: "Performance Hall",
        category: "ceremony",
      },
      {
        id: 15,
        title: "Closing Ceremony",
        start: "18:00",
        end: "20:00",
        location: "Main Stage",
        category: "ceremony",
      },
    ],
  };

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  const getEventPositionAndHeight = (event: Event) => {
    const startTime = parseInt(event.start.split(":")[0]);
    const endTime = parseInt(event.end.split(":")[0]);
    const startMinutes = parseInt(event.start.split(":")[1]);
    const endMinutes = parseInt(event.end.split(":")[1]);

    const startIndex = timeSlots.findIndex(
      (time) => parseInt(time.split(":")[0]) === startTime
    );

    // Calculate duration in hours
    const duration = endTime - startTime + (endMinutes - startMinutes) / 60;

    // Calculate top position (percentage from the top of the time slots container)
    const top = startIndex * 60 + (startMinutes / 60) * 60;

    // Calculate height based on duration (1 hour = 60px)
    const height = duration * 60;

    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className="timetable-container" ref={pageRef}>
      <h1 className="page-title">Festival Schedule</h1>

      <div className="timetable-tabs">
        <button
          className={`tab-btn ${activeDay === "day1" ? "active" : ""}`}
          onClick={() => switchDay("day1")}
        >
          Day 1 (May 15)
        </button>
        <button
          className={`tab-btn ${activeDay === "day2" ? "active" : ""}`}
          onClick={() => switchDay("day2")}
        >
          Day 2 (May 16)
        </button>
        <button
          className={`tab-btn ${activeDay === "day3" ? "active" : ""}`}
          onClick={() => switchDay("day3")}
        >
          Day 3 (May 17)
        </button>
      </div>

      <div className="timetable-grid">
        <div className="time-slots">
          {timeSlots.map((time, index) => (
            <div key={index} className="time-slot">
              <span>{time}</span>
            </div>
          ))}
        </div>

        <div className="timeline">
          {timeSlots.map((_, index) => (
            <div key={index} className="timeline-line"></div>
          ))}
        </div>

        <div className="events-container">
          {schedule[activeDay].map((event) => {
            const { top, height } = getEventPositionAndHeight(event);
            return (
              <div
                key={event.id}
                className={`time-event ${event.category}`}
                style={{ top, height }}
              >
                <h3 className="event-title">{event.title}</h3>
                <div className="event-details">
                  <span className="event-time">
                    {event.start} - {event.end}
                  </span>
                  <span className="event-location">{event.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
