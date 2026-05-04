import { type DestinationData } from "@/components/DestinationPackingModal";

export const destCategories = [
  { id: "all", label: "ทั้งหมด" },
  { id: "beach", label: "ชายหาด" },
  { id: "city", label: "เมือง" },
  { id: "mountain", label: "ภูเขา" },
  { id: "abroad", label: "ต่างประเทศ" },
  { id: "ceremony", label: "พิธีการ" },
];

export const destinations: DestinationData[] = [
  { id: 1, name: "Monument of Berlin", location: "Berlin, Germany", image: "/asset/destinations/berlin.jpg", category: "city", destinationType: "city", suggestedActivities: ["photography", "shopping", "dinner", "cycling"], climate: "Continental", description: "เมืองประวัติศาสตร์ที่ผสมผสานสถาปัตยกรรมเก่าแก่กับศิลปะร่วมสมัย" },
  { id: 2, name: "Millennium Bridge", location: "London, UK", image: "/asset/destinations/london.jpg", category: "city", destinationType: "city", suggestedActivities: ["photography", "shopping", "dinner", "business"], climate: "Temperate", description: "เมืองหลวงที่เต็มไปด้วยวัฒนธรรม พิพิธภัณฑ์ และไลฟ์สไตล์ร่วมสมัย" },
  { id: 3, name: "Rialto Bridge", location: "Venice, Italy", image: "/asset/destinations/venice.jpg", category: "city", destinationType: "city", suggestedActivities: ["photography", "dinner", "shopping"], climate: "Mediterranean", description: "เมืองแห่งคลองที่โรแมนติก สถาปัตยกรรมเรเนสซองส์ และอาหารอิตาเลียน" },
  { id: 4, name: "Sea of Orange Roofs", location: "Lisbon, Portugal", image: "/asset/destinations/lisbon.jpg", category: "culture", destinationType: "city", suggestedActivities: ["photography", "hiking", "shopping", "dinner"], climate: "Mediterranean", description: "เมืองบนเนินเขาที่มีหลังคาสีส้ม ถนนหินทรุด และวัฒนธรรม Fado" },
  { id: 5, name: "Santorini Sunset", location: "Santorini, Greece", image: "/asset/destinations/santorini.jpg", category: "beach", destinationType: "beach", suggestedActivities: ["swimming", "photography", "dinner", "snorkeling"], climate: "Mediterranean", description: "เกาะทะเลสีคราม อาคารขาวบนหน้าผา พร้อมพระอาทิตย์ตกที่สวยที่สุดในโลก" },
  { id: 6, name: "Bali Rice Terraces", location: "Bali, Indonesia", image: "/asset/destinations/bali.jpg", category: "nature", destinationType: "mountain", suggestedActivities: ["swimming", "diving", "snorkeling", "temple", "yoga", "hiking"], climate: "Tropical", description: "ธรรมชาติเขตร้อน นาขั้นบันได วัดโบราณ และชีวิตที่เรียบง่าย" },
  { id: 7, name: "Tokyo Tower", location: "Tokyo, Japan", image: "/asset/destinations/tokyo.jpg", category: "city", destinationType: "city", suggestedActivities: ["photography", "shopping", "temple", "dinner"], climate: "Temperate", description: "เมืองที่ผสมผสานวัฒนธรรมดั้งเดิมกับเทคโนโลยีล้ำสมัย" },
  { id: 8, name: "Maldives Beach", location: "Maldives", image: "/asset/destinations/maldives.jpg", category: "beach", destinationType: "beach", suggestedActivities: ["swimming", "diving", "snorkeling", "photography"], climate: "Tropical", description: "น้ำทะเลใสระดับ world-class ชายหาดทรายขาว และวิลล่าริมน้ำ" },
  { id: 9, name: "Swiss Alps", location: "Zermatt, Switzerland", image: "/asset/destinations/berlin.jpg", category: "mountain", destinationType: "mountain", suggestedActivities: ["hiking", "skiing", "photography", "camping"], climate: "Alpine", description: "ภูเขาหิมะปกคลุมตลอดปี ทะเลสาบใส และหมู่บ้านน่ารักกลางหุบเขา" },
  { id: 10, name: "Paris Eiffel", location: "Paris, France", image: "/asset/destinations/london.jpg", category: "abroad", destinationType: "abroad", suggestedActivities: ["photography", "shopping", "dinner", "business"], climate: "Temperate", description: "เมืองแห่งแสงไฟ ศิลปะ อาหารระดับโลก และสถาปัตยกรรมโรแมนติก" },
  { id: 11, name: "New York Skyline", location: "New York, USA", image: "/asset/destinations/berlin.jpg", category: "abroad", destinationType: "abroad", suggestedActivities: ["photography", "shopping", "dinner", "business"], climate: "Continental", description: "เมืองที่ไม่เคยหลับ ตึกระฟ้า ศิลปะ และวัฒนธรรมจากทั่วโลก" },
  { id: 12, name: "Thai Wedding Ceremony", location: "Bangkok, Thailand", image: "/asset/destinations/venice.jpg", category: "ceremony", destinationType: "ceremony", suggestedActivities: ["photography", "dinner", "temple"], climate: "Tropical", description: "งานพิธีแต่งงานแบบไทย สวยงาม เครื่องแต่งกายโบราณ และขนบธรรมเนียม" },
];
