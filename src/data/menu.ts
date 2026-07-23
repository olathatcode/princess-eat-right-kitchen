import jollof from "@/assets/menu/jollof-rice-goat-meat.jpg";
import egusi from "@/assets/menu/egusi-soup-pounded-yam.jpg";
import efoRiro from "@/assets/menu/efo-riro-amala.jpg";
import abula from "@/assets/menu/ewedu-gbegiri-amala.jpg";
import moiMoi from "@/assets/menu/moi-moi.jpg";

export type MenuCategory = "Rice" | "Swallow & Soup" | "Protein" | "Snacks" | "Drinks";

export type MenuItem = {
  slug: string;
  name: string;
  category: MenuCategory;
  priceNaira: number;
  shortDescription: string;
  description: string;
  ingredients: string[];
  image: string;
  pairsWith?: string[];
  spiceLevel?: 1 | 2 | 3;
  tags?: string[];
  /** If true, price is per spoon — customer picks how many spoons they want */
  pricePerSpoon?: true;
};

export const CATEGORIES: MenuCategory[] = ["Rice", "Swallow & Soup", "Protein", "Snacks", "Drinks"];

export const MENU: MenuItem[] = [
  // Rice
  {
    slug: "jollof-rice",
    name: "Jollof Rice",
    category: "Rice",
    priceNaira: 300,
    shortDescription: "Smoky, party-style Nigerian Jollof Rice.",
    description:
      "Our signature party-style Jollof Rice, slow-cooked in a rich tomato, onion, and red bell pepper base with traditional spices for that authentic smoky flavor.",
    ingredients: [
      "Long-grain rice",
      "Tomatoes",
      "Red bell peppers",
      "Onions",
      "Scotch bonnet",
      "Bay leaves",
      "Thyme",
      "Seasoning",
    ],
    image: jollof,
    pairsWith: ["chicken", "turkey-big", "beef", "coleslaw", "moimoi"],
    spiceLevel: 2,
    tags: ["Bestseller"],
    pricePerSpoon: true,
  },
  {
    slug: "fried-rice",
    name: "Fried Rice",
    category: "Rice",
    priceNaira: 300,
    shortDescription: "Savoury Nigerian Fried Rice with vegetables.",
    description:
      "Deliciously seasoned Nigerian Fried Rice, stir-fried with sweet corn, green peas, carrots, liver, and aromatic spices.",
    ingredients: [
      "Long-grain rice",
      "Carrots",
      "Green peas",
      "Sweet corn",
      "Beef liver",
      "Curry powder",
      "Thyme",
      "Seasoning",
    ],
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["chicken", "turkey-big", "beef", "coleslaw", "moimoi"],
    spiceLevel: 1,
    pricePerSpoon: true,
  },
  // Swallow & Soup
  {
    slug: "amala",
    name: "Amala",
    category: "Swallow & Soup",
    priceNaira: 300,
    shortDescription: "Soft, smooth yam flour swallow.",
    description:
      "A traditional Yoruba swallow made from dried yam flour (elubo), stirred in boiling water until smooth, light, and fluffy.",
    ingredients: ["Yam flour (elubo)", "Water"],
    image: abula,
    pairsWith: ["egusi", "efo-riro"],
  },
  {
    slug: "semo",
    name: "Semo",
    category: "Swallow & Soup",
    priceNaira: 300,
    shortDescription: "Smooth, firm semolina swallow.",
    description:
      "A popular Nigerian swallow made from high-quality semolina flour, cooked to a smooth, firm, and stretchy consistency.",
    ingredients: ["Semolina flour", "Water"],
    image: "https://i.pinimg.com/1200x/e6/c9/5b/e6c95b6abb2397423e61d05f004757c0.jpg",
    pairsWith: ["egusi", "efo-riro"],
  },
  {
    slug: "eba",
    name: "Eba",
    category: "Swallow & Soup",
    priceNaira: 300,
    shortDescription: "Classic cassava flour swallow.",
    description:
      "A staple Nigerian swallow made from pan-fried grated cassava (garri) mixed with hot water to form a firm, dough-like texture.",
    ingredients: ["Garri (cassava grains)", "Water"],
    image: "https://i.pinimg.com/vwebp/1200x/fa/8e/03/fa8e03bad48021d28a3181e5e2e4afb0.webp",
    pairsWith: ["egusi", "efo-riro"],
  },
  {
    slug: "fufu",
    name: "Fufu",
    category: "Swallow & Soup",
    priceNaira: 300,
    shortDescription: "Traditional fermented cassava swallow.",
    description:
      "A smooth, soft, and slightly sour swallow made from fermented cassava, cooked and pounded to perfection.",
    ingredients: ["Fermented cassava", "Water"],
    image: "https://i.pinimg.com/vwebp/736x/b1/a4/07/b1a4073f8761397dd9a3180b305b3bfa.webp",
    pairsWith: ["egusi", "efo-riro"],
  },
  {
    slug: "egusi",
    name: "Egusi Soup",
    category: "Swallow & Soup",
    priceNaira: 200,
    shortDescription: "Rich, textured melon seed soup.",
    description:
      "A classic Nigerian soup made from ground melon seeds, cooked with palm oil, leafy vegetables, and traditional spices.",
    ingredients: ["Melon seeds (egusi)", "Palm oil", "Ugu leaves", "Crayfish", "Seasoning"],
    image: egusi,
    pairsWith: ["amala", "semo", "eba", "fufu", "beef", "egg"],
    spiceLevel: 2,
  },
  {
    slug: "efo-riro",
    name: "Efo Riro",
    category: "Swallow & Soup",
    priceNaira: 200,
    shortDescription: "Rich, savoury Yoruba spinach stew.",
    description:
      "A highly nutritious and delicious Yoruba spinach stew cooked in a rich palm oil and pepper base with locust beans (iru).",
    ingredients: [
      "Spinach",
      "Palm oil",
      "Red bell pepper",
      "Locust beans (iru)",
      "Crayfish",
      "Seasoning",
    ],
    image: efoRiro,
    pairsWith: ["amala", "semo", "eba", "fufu", "beef", "egg"],
    spiceLevel: 2,
  },
  // Protein
  {
    slug: "egg",
    name: "Boiled Egg",
    category: "Protein",
    priceNaira: 300,
    shortDescription: "Perfectly hard-boiled egg.",
    description:
      "A single hard-boiled egg, seasoned lightly. A simple, protein-packed addition to any rice dish or swallow.",
    ingredients: ["Egg", "Salt"],
    image:
      "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice", "egusi", "efo-riro"],
  },
  {
    slug: "beef",
    name: "Beef",
    category: "Protein",
    priceNaira: 200,
    shortDescription: "Tender, well-seasoned fried beef.",
    description:
      "A single portion of tender, slow-cooked beef, seasoned with local spices and fried to perfection.",
    ingredients: ["Beef", "Onions", "Garlic", "Ginger", "Seasoning cubes", "Vegetable oil"],
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice", "egusi", "efo-riro"],
  },
  {
    slug: "chicken",
    name: "Fried Chicken",
    category: "Protein",
    priceNaira: 3500,
    shortDescription: "Crispy, juicy fried chicken portion.",
    description:
      "A large, succulent portion of chicken, marinated in rich spices, boiled until tender, and fried to a beautiful golden crisp.",
    ingredients: [
      "Chicken",
      "Onions",
      "Thyme",
      "Curry powder",
      "Garlic",
      "Ginger",
      "Vegetable oil",
    ],
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice"],
  },
  {
    slug: "turkey-big",
    name: "Turkey (Big)",
    category: "Protein",
    priceNaira: 5000,
    shortDescription: "Large, meaty portion of seasoned fried turkey.",
    description:
      "A premium, large cut of turkey, seasoned with our signature spice blend and fried until golden and juicy.",
    ingredients: ["Turkey", "Onions", "Garlic", "Ginger", "Curry", "Thyme", "Vegetable oil"],
    image:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice"],
  },
  {
    slug: "turkey-small",
    name: "Turkey (Small)",
    category: "Protein",
    priceNaira: 4000,
    shortDescription: "Medium portion of seasoned fried turkey.",
    description:
      "A medium cut of turkey, perfectly seasoned and fried to a delicious golden brown.",
    ingredients: ["Turkey", "Onions", "Garlic", "Ginger", "Curry", "Thyme", "Vegetable oil"],
    image: "https://i.pinimg.com/1200x/72/a0/e1/72a0e1e694a1d68c7a1cfe4e1263886d.jpg",
    pairsWith: ["jollof-rice", "fried-rice"],
  },
  {
    slug: "chicken-wings-small",
    name: "Chicken Wings (Small)",
    category: "Protein",
    priceNaira: 1500,
    shortDescription: "A small portion of crispy, seasoned chicken wings.",
    description:
      "A delicious portion of chicken wings, seasoned with local spices and fried to a perfect crisp.",
    ingredients: ["Chicken wings", "Spices", "Garlic", "Onions", "Vegetable oil"],
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice", "coke-pet"],
  },
  {
    slug: "chicken-wings-big",
    name: "Chicken Wings (Big)",
    category: "Protein",
    priceNaira: 2000,
    shortDescription: "A large portion of crispy, seasoned chicken wings.",
    description:
      "A generous portion of chicken wings, marinated in our special spice blend and fried to golden perfection.",
    ingredients: ["Chicken wings", "Spices", "Garlic", "Onions", "Vegetable oil"],
    image:
      "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice", "coke-pet"],
  },
  // Snacks
  {
    slug: "coleslaw",
    name: "Coleslaw",
    category: "Snacks",
    priceNaira: 300,
    shortDescription: "Creamy, crunchy cabbage and carrot salad.",
    description:
      "A fresh, crunchy mix of shredded cabbage and carrots tossed in a rich, creamy mayonnaise dressing.",
    ingredients: ["Cabbage", "Carrots", "Mayonnaise", "Sugar", "Vinegar"],
    image: "https://i.pinimg.com/vwebp/1200x/7c/ce/c2/7ccec2a35343f29a98714ce91d2ff01a.webp",
    pairsWith: ["jollof-rice", "fried-rice"],
  },
  {
    slug: "meat-pie",
    name: "Meat Pie",
    category: "Snacks",
    priceNaira: 900,
    shortDescription: "Flaky pastry filled with seasoned minced beef and potatoes.",
    description:
      "A classic Nigerian snack. Golden, flaky shortcrust pastry generously stuffed with a savoury filling of minced beef, potatoes, and carrots.",
    ingredients: [
      "Wheat flour",
      "Butter",
      "Minced beef",
      "Potatoes",
      "Carrots",
      "Onions",
      "Spices",
    ],
    image: "https://i.pinimg.com/vwebp/1200x/32/73/21/32732134fee2f05905366757ca0bd46c.webp",
    pairsWith: ["coke-pet", "fanta-pet", "sprite-pet"],
  },
  {
    slug: "moimoi",
    name: "Moi Moi",
    category: "Snacks",
    priceNaira: 700,
    shortDescription: "Steamed, savoury bean pudding.",
    description:
      "A classic Nigerian steamed bean pudding made from washed black-eyed beans, blended with peppers, onions, and spices.",
    ingredients: ["Black-eyed beans", "Red bell pepper", "Onions", "Vegetable oil", "Seasoning"],
    image: moiMoi,
    pairsWith: ["jollof-rice", "fried-rice"],
  },
  // Drinks
  {
    slug: "coke-pet",
    name: "Coke PET",
    category: "Drinks",
    priceNaira: 600,
    shortDescription: "Chilled 50cl PET bottle of Coca-Cola.",
    description:
      "A refreshing, ice-cold 50cl PET bottle of Coca-Cola, perfect for pairing with any of our delicious meals.",
    ingredients: [
      "Carbonated water",
      "Sugar",
      "Caramel color",
      "Phosphoric acid",
      "Natural flavors",
      "Caffeine",
    ],
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice", "meat-pie"],
  },
  {
    slug: "fanta-pet",
    name: "Fanta PET",
    category: "Drinks",
    priceNaira: 600,
    shortDescription: "Chilled 50cl PET bottle of Fanta Orange.",
    description:
      "Bright, bubbly, and instantly refreshing, our chilled 50cl PET bottle of Fanta Orange is packed with sweet citrus flavor.",
    ingredients: [
      "Carbonated water",
      "Sugar",
      "Orange juice from concentrate",
      "Citric acid",
      "Natural orange flavors",
    ],
    image: "https://i.pinimg.com/1200x/c5/aa/f4/c5aaf4af8bd893c135b7a68ba0177d4d.jpg",
    pairsWith: ["jollof-rice", "fried-rice", "meat-pie"],
  },
  {
    slug: "sprite-pet",
    name: "Sprite PET",
    category: "Drinks",
    priceNaira: 600,
    shortDescription: "Chilled 50cl PET bottle of Sprite.",
    description:
      "Crisp, clean, and refreshing, this chilled 50cl PET bottle of Sprite delivers a burst of lemon-lime flavor with every sip.",
    ingredients: [
      "Carbonated water",
      "Sugar",
      "Citric acid",
      "Natural lemon and lime flavors",
      "Sodium citrate",
    ],
    image: "https://i.pinimg.com/736x/50/66/27/506627f03926f817a7b4995dcc80cf6e.jpg",
    pairsWith: ["jollof-rice", "fried-rice", "meat-pie"],
  },
  {
    slug: "water",
    name: "Bottled Water",
    category: "Drinks",
    priceNaira: 300,
    shortDescription: "Chilled premium bottled spring water.",
    description:
      "Pure, clean, and refreshing premium bottled spring water, served ice-cold to keep you hydrated.",
    ingredients: ["Natural spring water"],
    image: "https://i.pinimg.com/736x/bc/1a/67/bc1a678485b072d2a383f7c598035d14.jpg",
    pairsWith: ["jollof-rice", "fried-rice", "amala", "semo", "eba", "fufu"],
  },
  {
    slug: "can-coke",
    name: "Can Coke",
    category: "Drinks",
    priceNaira: 700,
    shortDescription: "Chilled 33cl can of Coca-Cola.",
    description:
      "An ice-cold 33cl can of Coca-Cola, offering that classic, crisp taste to refresh your palate.",
    ingredients: [
      "Carbonated water",
      "Sugar",
      "Caramel color",
      "Phosphoric acid",
      "Natural flavors",
      "Caffeine",
    ],
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice", "meat-pie"],
  },
  {
    slug: "can-fanta",
    name: "Can Fanta",
    category: "Drinks",
    priceNaira: 700,
    shortDescription: "Chilled 33cl can of Fanta Orange.",
    description: "A chilled 33cl can of Fanta Orange, bursting with sweet, bubbly citrus flavor.",
    ingredients: [
      "Carbonated water",
      "Sugar",
      "Orange juice from concentrate",
      "Citric acid",
      "Natural orange flavors",
    ],
    image:
      "https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=800&q=80",
    pairsWith: ["jollof-rice", "fried-rice", "meat-pie"],
  },
  {
    slug: "can-sprite",
    name: "Can Sprite",
    category: "Drinks",
    priceNaira: 700,
    shortDescription: "Chilled 33cl can of Sprite.",
    description:
      "A chilled 33cl can of Sprite, delivering a crisp, clean, and refreshing lemon-lime taste.",
    ingredients: [
      "Carbonated water",
      "Sugar",
      "Citric acid",
      "Natural lemon and lime flavors",
      "Sodium citrate",
    ],
    image: "https://i.pinimg.com/736x/9b/da/90/9bda90d0af9e402db2fc6ed0ad29f09d.jpg",
    pairsWith: ["jollof-rice", "fried-rice", "meat-pie"],
  },
  {
    slug: "can-maltina",
    name: "Can Maltina",
    category: "Drinks",
    priceNaira: 800,
    shortDescription: "Chilled 33cl can of Maltina.",
    description:
      "A chilled 33cl can of Maltina, a rich, nourishing, and non-alcoholic malt drink packed with vitamins.",
    ingredients: [
      "Water",
      "Sucrose",
      "Malted barley",
      "Malted sorghum",
      "Caramel",
      "Hops",
      "Vitamins",
    ],
    image: "https://i.pinimg.com/736x/d1/5f/b2/d15fb299900cc5389e87cabd910f3fc6.jpg",
    pairsWith: ["jollof-rice", "fried-rice", "meat-pie"],
  },
  {
    slug: "can-schwepps",
    name: "Can Schweppes",
    category: "Drinks",
    priceNaira: 700,
    shortDescription: "Chilled 33cl can of Schweppes.",
    description:
      "A chilled 33cl can of Schweppes, perfect as a refreshing standalone drink or a premium mixer.",
    ingredients: ["Carbonated water", "Sugar", "Citric acid", "Natural flavorings", "Quinine"],
    image: "https://i.pinimg.com/1200x/cc/fb/b2/ccfbb2964d538316e6d0221ff767d8f3.jpg",
    pairsWith: ["jollof-rice", "fried-rice", "meat-pie"],
  },
];

export function getMenuItem(slug: string): MenuItem | undefined {
  return MENU.find((m) => m.slug === slug);
}
