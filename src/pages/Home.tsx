// src/pages/Home.tsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import "./Home.css";

const Home = () => {
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bannerTl = gsap.timeline();

    // Animate hero section
    bannerTl
      .from(".hero-title", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(
        ".hero-subtitle",
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        ".hero-btn",
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(".decoration", {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        stagger: 0.2,
        ease: "power1.out",
      });

    // Animate stories
    gsap.from(".story-item", {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
    });

    // Animate posts with scroll trigger
    gsap.from(".feed-post", {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
      ease: "power2.out",
    });

    // Animate event cards
    gsap.from(".event-card", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.3,
    });

    return () => {
      bannerTl.kill();
    };
  }, []);

  // Sample data for stories
  const stories = [
    {
      id: 1,
      title: "Opening Ceremony",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      title: "Dance Performances",
      image: "https://i.pravatar.cc/150?img=2",
    },
    { id: 3, title: "Art Exhibits", image: "https://i.pravatar.cc/150?img=3" },
    { id: 4, title: "Food Festival", image: "https://i.pravatar.cc/150?img=4" },
    { id: 5, title: "Music Concert", image: "https://i.pravatar.cc/150?img=5" },
    {
      id: 6,
      title: "Cultural Workshop",
      image: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: 7,
      title: "Photography Tour",
      image: "https://i.pravatar.cc/150?img=7",
    },
    {
      id: 8,
      title: "Closing Ceremony",
      image: "https://i.pravatar.cc/150?img=8",
    },
  ];

  // Trending topics
  const trending = [
    {
      id: 1,
      category: "Trending in Festival",
      title: "Opening Ceremony Highlights",
      posts: "2,543 posts",
    },
    {
      id: 2,
      category: "Music",
      title: "Festival Band Lineup Announced",
      posts: "1,829 posts",
    },
    {
      id: 3,
      category: "Art",
      title: "Interactive Art Installations",
      posts: "1,245 posts",
    },
    {
      id: 4,
      category: "Food",
      title: "International Food Court",
      posts: "987 posts",
    },
  ];

  // Who to follow
  const followSuggestions = [
    {
      id: 1,
      name: "Festival Music",
      username: "@festival_music",
      avatar: "https://i.pravatar.cc/150?img=50",
    },
    {
      id: 2,
      name: "Art Exhibits",
      username: "@art_exhibits",
      avatar: "https://i.pravatar.cc/150?img=35",
    },
    {
      id: 3,
      name: "Cultural Workshops",
      username: "@workshops",
      avatar: "https://i.pravatar.cc/150?img=28",
    },
  ];

  // Sample posts
  const posts = [
    {
      id: 1,
      user: {
        name: "Festival Official",
        username: "@festival2025",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      time: "2 hours ago",
      content:
        "We're excited to announce the full lineup for the Cultural Festival 2025! 🎉 Three days of amazing performances, exhibits, and workshops await you. Get your tickets now!",
      image: "https://source.unsplash.com/random/600x400/?festival",
      likes: 245,
      comments: 37,
      shares: 89,
    },
    {
      id: 2,
      user: {
        name: "Art Curator",
        username: "@art_gallery",
        avatar: "https://i.pravatar.cc/150?img=32",
      },
      time: "5 hours ago",
      location: "Main Exhibition Hall",
      content:
        "Setting up the international art exhibit for the festival. We have pieces from over 20 countries! Can't wait for everyone to see these amazing works. #CulturalFestival2025 #ArtExhibit",
      image: "https://source.unsplash.com/random/600x400/?art,exhibition",
      likes: 178,
      comments: 24,
      shares: 45,
    },
    {
      id: 3,
      user: {
        name: "Dance Troupe",
        username: "@dance_collective",
        avatar: "https://i.pravatar.cc/150?img=25",
      },
      time: "Yesterday",
      location: "Performance Hall",
      content:
        "Final rehearsal for our big performance at the Cultural Festival 2025! We've been preparing for months to bring you traditional dances with a modern twist. See you all there! 💃🕺 #DancePerformance",
      image: "https://source.unsplash.com/random/600x400/?dance,performance",
      likes: 302,
      comments: 41,
      shares: 67,
    },
  ];

  // Featured events
  const events = [
    {
      id: 1,
      title: "Opening Ceremony",
      date: "May 15, 2025",
      time: "10:00 AM",
      location: "Main Stage",
      image: "https://source.unsplash.com/random/300x180/?ceremony",
      description:
        "Join us for the grand opening with special performances and keynote speakers.",
    },
    {
      id: 2,
      title: "Cultural Dance Performance",
      date: "May 16, 2025",
      time: "2:00 PM",
      location: "Performance Hall",
      image: "https://source.unsplash.com/random/300x180/?dance",
      description:
        "Experience traditional dances from around the world performed by skilled artists.",
    },
    {
      id: 3,
      title: "International Food Fair",
      date: "May 15-17, 2025",
      time: "11:00 AM - 8:00 PM",
      location: "Food Court",
      image: "https://source.unsplash.com/random/300x180/?food,international",
      description:
        "Taste culinary delights from over 30 countries at our international food fair.",
    },
  ];

  return (
    <div className="home-container" ref={homeRef}>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Cultural Festival 2025</h1>
          <p className="hero-subtitle">
            Experience art, music, and culture like never before at our
            three-day festival
          </p>
          <Link to="/events" className="hero-btn">
            Explore Events
          </Link>
        </div>
        <div className="hero-decorations">
          <svg
            className="decoration d1"
            viewBox="0 0 100 100"
            width="120"
            height="120"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M30,50 Q50,20 70,50 Q50,80 30,50"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          <svg
            className="decoration d2"
            viewBox="0 0 100 100"
            width="160"
            height="160"
          >
            <rect
              x="25"
              y="25"
              width="50"
              height="50"
              fill="none"
              stroke="white"
              strokeWidth="2"
              rx="10"
            />
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
          <svg
            className="decoration d3"
            viewBox="0 0 100 100"
            width="100"
            height="100"
          >
            <polygon
              points="50,10 90,50 50,90 10,50"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Stories Section (Instagram Style) */}
      <div className="stories-section">
        <div className="stories-container">
          {stories.map((story) => (
            <div key={story.id} className="story-item">
              <div className="story-ring">
                <div className="story-img-container">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="story-img"
                  />
                </div>
              </div>
              <span className="story-title">{story.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View (1-column grid) */}
      <div className="home-feed">
        {/* Status Composer (Twitter-like) */}
        <div className="status-composer">
          <img
            src="https://i.pravatar.cc/150?img=68"
            alt="Your avatar"
            className="composer-avatar"
          />
          <div className="composer-input-container">
            <textarea
              className="composer-textarea"
              placeholder="What's happening at the festival?"
            ></textarea>
            <div className="composer-actions">
              <div className="composer-tools">
                <div className="composer-tool">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="composer-tool">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="composer-tool">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="composer-tool">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
              <button className="composer-submit">Post</button>
            </div>
          </div>
        </div>

        {/* Feed Posts */}
        {posts.map((post) => (
          <div key={post.id} className="feed-post">
            <div className="post-header">
              <div className="post-user">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="post-avatar"
                />
                <div className="post-user-info">
                  <div className="post-username">{post.user.name}</div>
                  <div className="post-location">
                    {post.location || post.user.username}
                  </div>
                  <div className="post-time">{post.time}</div>
                </div>
              </div>
              <div className="post-more">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </div>
            </div>
            <div className="post-content">{post.content}</div>
            <img src={post.image} alt="Post" className="post-image" />
            <div className="post-actions">
              <div className="post-action like">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{post.likes}</span>
              </div>
              <div className="post-action comment">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>{post.comments}</span>
              </div>
              <div className="post-action share">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>{post.shares}</span>
              </div>
              <div className="post-action bookmark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
            </div>
          </div>
        ))}

        {/* Trending Section (Twitter Style) */}
        <div className="trending-section">
          <h3 className="trending-header">What's happening</h3>
          <ul className="trending-list">
            {trending.map((item) => (
              <li key={item.id} className="trending-item">
                <div className="trending-category">{item.category}</div>
                <div className="trending-title">{item.title}</div>
                <div className="trending-meta">
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
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                  <span>{item.posts}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="trending-show-more">Show more</div>
        </div>

        {/* Who to follow (Twitter Style) */}
        <div className="who-to-follow">
          <h3 className="who-to-follow-header">Who to follow</h3>
          <ul className="follow-list">
            {followSuggestions.map((user) => (
              <li key={user.id} className="follow-item">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="follow-avatar"
                />
                <div className="follow-info">
                  <div className="follow-name">{user.name}</div>
                  <div className="follow-username">{user.username}</div>
                </div>
                <button className="follow-btn">Follow</button>
              </li>
            ))}
          </ul>
          <div className="trending-show-more">Show more</div>
        </div>

        {/* Featured Events Section */}
        <section className="featured-events">
          <h2 className="section-title">Featured Events</h2>
          <div className="events-container">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-img-container">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="event-img"
                  />
                  <div className="event-date">{event.date}</div>
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <div className="event-time">
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
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>{" "}
                      {event.time}
                    </div>
                    <div className="event-location">
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
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>{" "}
                      {event.location}
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-actions">
                    <div className="event-action interested">
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
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      <span>Interested</span>
                    </div>
                    <div className="event-action going">
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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Going</span>
                    </div>
                    <div className="event-action share">
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
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="trending-show-more">
            <Link to="/events">View all events</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
