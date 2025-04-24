// src/data/events.ts
import { Event } from "../types/common";

export const events: Event[] = [
  {
    id: "event-1",
    type: "event",
    title: "Opening Ceremony",
    description:
      "The grand opening ceremony of Ube Kosen Festival 2025 with special performances by students.",
    imageUrl: "./images/events/event-1.jpg",
    date: "2025-11-08",
    time: "10:00 - 11:00",
    location: "Main Stage, Ube National College of Technology",
    tags: ["ceremony", "performance"],
    organizer: "Festival Committee",
    duration: 60,
  },
  {
    id: "event-2",
    type: "event",
    title: "Robot Combat Competition",
    description:
      "Watch engineering students pit their robot creations against each other in an exciting battle.",
    imageUrl: "./images/events/event-2.jpg",
    date: "2025-11-08",
    time: "13:00 - 15:00",
    location: "Engineering Building, Ube National College of Technology",
    tags: ["robotics", "competition", "engineering"],
    organizer: "Robotics Club",
    duration: 120,
  },
  {
    id: "event-3",
    type: "event",
    title: "Cultural Dance Performance",
    description:
      "International students showcase traditional dances from around the world.",
    imageUrl: "./images/events/event-3.jpg",
    date: "2025-11-08",
    time: "16:00 - 17:30",
    location: "Main Stage, Ube National College of Technology",
    tags: ["dance", "cultural", "performance"],
    organizer: "International Students Association",
    duration: 90,
  },
  {
    id: "event-4",
    type: "event",
    title: "Science Fair",
    description:
      "Exhibition of innovative science projects by students from all departments.",
    imageUrl: "./images/events/event-4.jpg",
    date: "2025-11-09",
    time: "10:00 - 16:00",
    location: "Science Building, Ube National College of Technology",
    tags: ["science", "exhibition"],
    organizer: "Science Club",
    duration: 360,
  },
  {
    id: "event-5",
    type: "event",
    title: "Band Live Concert",
    description:
      "Live music performances by student bands featuring a variety of genres.",
    imageUrl: "./images/events/event-5.jpg",
    date: "2025-11-09",
    time: "18:00 - 21:00",
    location: "Main Stage, Ube National College of Technology",
    tags: ["music", "concert", "band"],
    organizer: "Music Club",
    duration: 180,
  },
  {
    id: "event-6",
    type: "event",
    title: "Closing Ceremony",
    description:
      "The final event of the festival with awards ceremony and special performances.",
    imageUrl: "./images/events/event-6.jpg",
    date: "2025-11-09",
    time: "21:30 - 22:30",
    location: "Main Stage, Ube National College of Technology",
    tags: ["ceremony", "awards"],
    organizer: "Festival Committee",
    duration: 60,
  },
];
