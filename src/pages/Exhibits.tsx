// src/pages/Exhibits.tsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Exhibits.css";

type Exhibit = {
  id: number;
  title: string;
  artist: string;
  country: string;
  description: string;
  category: string;
  image: string;
};

const Exhibits = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".filter-options", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.3,
      });

      gsap.from(".exhibit-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.5,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const exhibits: Exhibit[] = [
    {
      id: 1,
      title: "Modern Reflections",
      artist: "Akira Tanaka",
      country: "Japan",
      description:
        "An exploration of modern Japanese identity through abstract paintings.",
      category: "painting",
      image: "painting1",
    },
    {
      id: 2,
      title: "Digital Dreams",
      artist: "Emma Chen",
      country: "Canada",
      description:
        "Interactive digital art installation that responds to viewer movements.",
      category: "digital",
      image: "digital1",
    },
    {
      id: 3,
      title: "Cultural Threads",
      artist: "Maria Garcia",
      country: "Mexico",
      description:
        "Traditional textile art reimagined with contemporary techniques.",
      category: "textile",
      image: "textile1",
    },
    {
      id: 4,
      title: "Urban Landscapes",
      artist: "David Park",
      country: "South Korea",
      description:
        "Photography series documenting urban life across Asian megacities.",
      category: "photography",
      image: "photo1",
    },
    {
      id: 5,
      title: "Ancestral Voices",
      artist: "Kwame Osei",
      country: "Ghana",
      description:
        "Sculptures inspired by traditional West African storytelling.",
      category: "sculpture",
      image: "sculpture1",
    },
    {
      id: 6,
      title: "Floating World",
      artist: "Yuki Tanaka",
      country: "Japan",
      description:
        "Contemporary interpretation of ukiyo-e woodblock printing techniques.",
      category: "painting",
      image: "painting2",
    },
    {
      id: 7,
      title: "Virtual Territories",
      artist: "Alex Rivera",
      country: "United States",
      description:
        "VR installation exploring concepts of borders and boundaries.",
      category: "digital",
      image: "digital2",
    },
    {
      id: 8,
      title: "Woven Stories",
      artist: "Aisha Rahman",
      country: "Pakistan",
      description:
        "Traditional carpet weaving with contemporary narrative elements.",
      category: "textile",
      image: "textile2",
    },
    {
      id: 9,
      title: "Silent Moments",
      artist: "Sophie Dubois",
      country: "France",
      description:
        "Black and white photography capturing intimate human moments.",
      category: "photography",
      image: "photo2",
    },
    {
      id: 10,
      title: "Form and Void",
      artist: "Marco Rossi",
      country: "Italy",
      description: "Minimalist marble sculptures exploring negative space.",
      category: "sculpture",
      image: "sculpture2",
    },
  ];

  const filterExhibits = (category: string) => {
    setActiveCategory(category);

    // Animate cards when filtering
    gsap.fromTo(
      ".exhibit-card",
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

  const filteredExhibits =
    activeCategory === "all"
      ? exhibits
      : exhibits.filter((exhibit) => exhibit.category === activeCategory);

  return (
    <div className="exhibits-container" ref={pageRef}>
      <h1 className="page-title">Art Exhibits</h1>

      <div className="filter-options">
        <button
          className={`filter-option ${
            activeCategory === "all" ? "active" : ""
          }`}
          onClick={() => filterExhibits("all")}
        >
          All
        </button>
        <button
          className={`filter-option ${
            activeCategory === "painting" ? "active" : ""
          }`}
          onClick={() => filterExhibits("painting")}
        >
          Painting
        </button>
        <button
          className={`filter-option ${
            activeCategory === "sculpture" ? "active" : ""
          }`}
          onClick={() => filterExhibits("sculpture")}
        >
          Sculpture
        </button>
        <button
          className={`filter-option ${
            activeCategory === "photography" ? "active" : ""
          }`}
          onClick={() => filterExhibits("photography")}
        >
          Photography
        </button>
        <button
          className={`filter-option ${
            activeCategory === "digital" ? "active" : ""
          }`}
          onClick={() => filterExhibits("digital")}
        >
          Digital
        </button>
        <button
          className={`filter-option ${
            activeCategory === "textile" ? "active" : ""
          }`}
          onClick={() => filterExhibits("textile")}
        >
          Textile
        </button>
      </div>

      <div className="exhibits-grid">
        {filteredExhibits.map((exhibit) => (
          <div key={exhibit.id} className={`exhibit-card ${exhibit.category}`}>
            <div className={`exhibit-image ${exhibit.image}`}>
              <div className="exhibit-category">{exhibit.category}</div>
            </div>
            <div className="exhibit-content">
              <h2 className="exhibit-title">{exhibit.title}</h2>
              <div className="exhibit-artist">
                <span className="artist-name">{exhibit.artist}</span>
                <span className="artist-country">{exhibit.country}</span>
              </div>
              <p className="exhibit-description">{exhibit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exhibits;
