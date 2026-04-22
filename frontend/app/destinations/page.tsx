"use client";

import Navbar from "@/components/Navbar";
import DestinationPackingModal, { type DestinationData } from "@/components/DestinationPackingModal";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

const categories = [
  { id: "all", label: "ทั้งหมด" },
  { id: "beach", label: "ชายหาด" },
  { id: "city", label: "เมือง" },
  { id: "nature", label: "ธรรมชาติ" },
  { id: "culture", label: "วัฒนธรรม" },
  { id: "nearby", label: "ใกล้เมือง" },
];

const destinations: DestinationData[] = [
  {
    id: 1,
    name: "Monument of Berlin",
    location: "Berlin, Germany",
    image: "/asset/destinations/berlin.jpg",
    category: "city",
    destinationType: "city",
    suggestedActivities: ["photography", "shopping", "dinner", "cycling"],
    climate: "Continental",
    description: "เมืองประวัติศาสตร์ที่ผสมผสานสถาปัตยกรรมเก่าแก่กับศิลปะร่วมสมัย",
  },
  {
    id: 2,
    name: "Millennium Bridge",
    location: "London, UK",
    image: "/asset/destinations/london.jpg",
    category: "city",
    destinationType: "city",
    suggestedActivities: ["photography", "shopping", "dinner", "business"],
    climate: "Temperate",
    description: "เมืองหลวงที่เต็มไปด้วยวัฒนธรรม พิพิธภัณฑ์ และไลฟ์สไตล์ร่วมสมัย",
  },
  {
    id: 3,
    name: "Rialto Bridge",
    location: "Venice, Italy",
    image: "/asset/destinations/venice.jpg",
    category: "city",
    destinationType: "city",
    suggestedActivities: ["photography", "dinner", "shopping"],
    climate: "Mediterranean",
    description: "เมืองแห่งคลองที่โรแมนติก สถาปัตยกรรมเรเนสซองส์ และอาหารอิตาเลียน",
  },
  {
    id: 4,
    name: "Sea of Orange Roofs",
    location: "Lisbon, Portugal",
    image: "/asset/destinations/lisbon.jpg",
    category: "culture",
    destinationType: "city",
    suggestedActivities: ["photography", "hiking", "shopping", "dinner"],
    climate: "Mediterranean",
    description: "เมืองบนเนินเขาที่มีหลังคาสีส้ม ถนนหินทรุด และวัฒนธรรม Fado",
  },
  {
    id: 5,
    name: "Santorini Sunset",
    location: "Santorini, Greece",
    image: "/asset/destinations/santorini.jpg",
    category: "beach",
    destinationType: "beach",
    suggestedActivities: ["swimming", "photography", "dinner", "snorkeling"],
    climate: "Mediterranean",
    description: "เกาะทะเลสีคราม อาคารขาวบนหน้าผา พร้อมพระอาทิตย์ตกที่สวยที่สุดในโลก",
  },
  {
    id: 6,
    name: "Bali Rice Terraces",
    location: "Bali, Indonesia",
    image: "/asset/destinations/bali.jpg",
    category: "nature",
    destinationType: "mountain",
    suggestedActivities: ["swimming", "diving", "snorkeling", "temple", "yoga", "hiking"],
    climate: "Tropical",
    description: "ธรรมชาติเขตร้อน นาขั้นบันได วัดโบราณ และชีวิตที่เรียบง่าย",
  },
  {
    id: 7,
    name: "Tokyo Tower",
    location: "Tokyo, Japan",
    image: "/asset/destinations/tokyo.jpg",
    category: "city",
    destinationType: "city",
    suggestedActivities: ["photography", "shopping", "temple", "dinner"],
    climate: "Temperate",
    description: "เมืองที่ผสมผสานวัฒนธรรมดั้งเดิมกับเทคโนโลยีล้ำสมัย",
  },
  {
    id: 8,
    name: "Maldives Beach",
    location: "Maldives",
    image: "/asset/destinations/maldives.jpg",
    category: "beach",
    destinationType: "beach",
    suggestedActivities: ["swimming", "diving", "snorkeling", "photography"],
    climate: "Tropical",
    description: "น้ำทะเลใสระดับ world-class ชายหาดทรายขาว และวิลล่าริมน้ำ",
  },
];

export default function DestinationsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationData | null>(null);
  const [showPackingModal, setShowPackingModal] = useState(false);

  const handleCardClick = (dest: DestinationData) => {
    setSelectedDestination(dest);
    setShowPackingModal(true);
    setIsPaused(true);
  };

  const handleCloseModal = () => {
    setShowPackingModal(false);
    setSelectedDestination(null);
    setIsPaused(false);
  };

  const filteredDestinations =
    activeCategory === "all"
      ? destinations
      : destinations.filter((d) => d.category === activeCategory);

  // Duplicate items for infinite scroll effect
  const duplicatedDestinations = [...filteredDestinations, ...filteredDestinations];

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar variant="light" />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-8 md:px-16 pt-6 pb-12">
        {/* Header */}
        <div className="mb-6">
          {/* Title */}
          <div className="inline-block">
            <h1 className="text-4xl font-serif text-gray-900 mb-1.5">Destinations</h1>
            <div className="w-full h-px bg-brand"></div>
          </div>

          {/* Subtitle with Arrows */}
          <div className="flex items-center justify-between mt-2">
            <p className="text-brand text-sm font-light">
              เลือกแล้วเราจะช่วยวางแผนทุกอย่างให้คุณ
            </p>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center hover:bg-brand-dark transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 flex-wrap mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-brand text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Auto-scrolling Carousel */}
        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className={`flex gap-6 ${isPaused ? "[animation-play-state:paused]" : ""}`}
            style={{
              animation: "scroll 30s linear infinite",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedDestinations.map((destination, index) => (
              <div
                key={`${destination.id}-${index}`}
                className="flex-shrink-0 w-72 group cursor-pointer"
                onClick={() => handleCardClick(destination)}
              >
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${destination.image}')`,
                      backgroundColor: "#e5e5e5",
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{destination.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Packing Recommendation Modal */}
      {showPackingModal && selectedDestination && (
        <DestinationPackingModal
          destination={selectedDestination}
          onClose={handleCloseModal}
        />
      )}

      {/* CSS Animation Keyframes */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}