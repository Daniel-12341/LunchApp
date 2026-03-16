export interface MenuItem {
  name: string
  description: string
  price: number
  priceAlt?: number
  priceAltLabel?: string
}

export interface MenuCategory {
  name: string
  emoji: string
  items: MenuItem[]
}

export type RestaurantId = 'posticino' | 'tadka' | 'prashad'

export interface Restaurant {
  id: RestaurantId
  name: string
  emoji: string
  tagline: string
  menu: MenuCategory[]
  /** Whether curry items require a spice level selection */
  hasSpiceLevel?: boolean
}

export const SPICE_LEVELS = ['Mild', 'Medium', 'Hot', 'Extra Hot'] as const
export type SpiceLevel = (typeof SPICE_LEVELS)[number]

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'posticino',
    name: 'Posticino',
    emoji: '🍕',
    tagline: 'Italian classics — pizza, pasta & panini',
    menu: [
      {
        name: 'Pizza',
        emoji: '🍕',
        items: [
          { name: 'Foccaccia', description: 'Crispy pizza base with garlic, olive oil, salt and herbs', price: 64 },
          { name: 'Margherita', description: 'Tomato base, mozzarella, and herbs', price: 89 },
          { name: 'Regina', description: 'Ham and mushrooms', price: 122 },
          { name: 'Capricciosa', description: 'Salami, mushrooms, olives, and asparagus', price: 139 },
          { name: 'Foccaccia Caprese', description: 'Foccaccia base with sliced tomato, mozzarella and basil pesto', price: 89 },
          { name: 'Hawaiian', description: 'Ham and pineapple', price: 122 },
          { name: 'Funghineri', description: 'Black mushrooms and garlic', price: 122 },
          { name: 'Quattro Stagioni', description: 'Ham, mushrooms, olives, and artichokes', price: 139 },
          { name: 'Siciliana', description: 'Anchovies, olives, and garlic', price: 134 },
          { name: 'Asparagi', description: 'Asparagus, olives, and mushrooms', price: 128 },
          { name: 'Posticino', description: 'Mushrooms, olives, green peppers, asparagus', price: 144 },
          { name: 'Mexicana', description: 'Beef mince, green peppers, onion, chili, and garlic', price: 146 },
          { name: 'Panna', description: 'Smoked salmon, caviar, and cream cheese', price: 170 },
          { name: 'Strega', description: 'Pan-fried chicken livers, onion, and chili', price: 140 },
          { name: 'Carabinieri', description: 'Mushrooms, olives, green peppers, chili, and garlic', price: 130 },
          { name: 'Capo', description: 'Gorgonzola, provolone, and Parmigiano cheese', price: 142 },
          { name: 'Al Greco', description: 'Spinach, olives, and feta', price: 122 },
          { name: 'Marinara', description: 'Calamari, mussels, and shrimps', price: 170 },
          { name: 'Contadina', description: 'Brinjals, zucchini, red peppers, and sundried tomatoes', price: 130 },
          { name: 'Porchetta', description: 'Bacon and avocado', price: 122 },
        ],
      },
      {
        name: 'Pasta',
        emoji: '🍝',
        items: [
          { name: 'Burro e Salvia', description: 'Butter & sage', price: 90 },
          { name: 'Aglio Olio', description: 'Olive oil & garlic', price: 89 },
          { name: 'Alla Ingrid', description: 'Aglio olio, calamari, chili & white wine', price: 165 },
          { name: 'Basil Pesto', description: 'Basil, pine nuts, olive oil, garlic & Parmigiano', price: 125 },
          { name: 'Primavera', description: 'Napoletana with mushrooms, green peppers, brinjals & zucchini', price: 142 },
          { name: 'Polpette', description: 'Napoletana with homemade beef meatballs', price: 150 },
          { name: 'Arrabbiata', description: 'Napoletana with chili', price: 99 },
          { name: 'Alla Gracie', description: 'Aglio olio with peppers, bacon, chicken, mushrooms & fresh feta on top', price: 154 },
          { name: 'Bolognese', description: 'Napoletana with slow-cooked beef mince, carrots & onion', price: 145 },
          { name: 'Napoletana', description: 'Tomato & herbs', price: 94 },
          { name: 'Fresco', description: 'Aglio olio with sliced tomato, black mushrooms & basil pesto', price: 142 },
          { name: 'Amatriciana', description: 'Napoletana with bacon, onion & chili', price: 142 },
          { name: 'Forestiera', description: 'Napoletana with black mushrooms & olives', price: 142 },
          { name: 'Puttanesca', description: 'Napoletana with anchovies, olives & capers', price: 142 },
          { name: 'Aurora', description: 'Napoletana with cream & Parmigiano', price: 118 },
          { name: 'Alla Nor', description: 'Cream with chicken, bacon, mushrooms, onions & sundried tomatoes', price: 154 },
          { name: 'Chicken Pasta', description: 'Chicken pasta', price: 136 },
          { name: 'Veal Pasta', description: 'Veal pasta', price: 160 },
          { name: 'Al Tonno', description: 'Napoletana with tuna & onions', price: 145 },
          { name: 'Al Fredo', description: 'Cream with ham & mushrooms', price: 142 },
          { name: 'Carbonara', description: '(With or without cream) bacon, egg & black pepper', price: 140, priceAlt: 142, priceAltLabel: 'with cream' },
          { name: 'Salmone', description: 'Cream with smoked salmon, capers & onions', price: 154 },
          { name: 'Quattro Formaggi', description: 'Cream with mozzarella, gorgonzola, provolone & Parmigiano', price: 158 },
          { name: 'Tuna Salad', description: 'Lettuce, cucumber, tomato, onion, tuna, capers, boiled eggs', price: 115 },
        ],
      },
      {
        name: 'Panini',
        emoji: '🥖',
        items: [
          { name: 'The Chicken Parm', description: 'Chicken parmigiana, mozzarella, parmesan', price: 98 },
          { name: 'The Polpette', description: 'Meatballs with ragu, wilted spinach, peppers, and parmesan', price: 99 },
          { name: 'The Chicken & Avo', description: "Lettuce, grilled chicken, avocado, onion, Posti's special dressing", price: 85 },
          { name: 'The Melanzane', description: 'Olive oil, melanzane parmigiana, rocket, parmesan, melted mozzarella', price: 90 },
          { name: 'The Prosciutto', description: 'Olive oil, Parma ham, rocket, parmesan shavings, tomato', price: 99 },
          { name: 'The Grigliato (Chicken)', description: 'Grilled chicken, rocket, tomato, balsamic caramelized onion', price: 85 },
          { name: 'The Grigliato (Veal)', description: 'Grilled veal, rocket, tomato, balsamic caramelized onion', price: 99 },
        ],
      },
      {
        name: 'Salad',
        emoji: '🥗',
        items: [
          { name: 'Greek', description: 'Lettuce, cucumber, tomato, onion, feta, oregano', price: 89 },
          { name: 'Chicken and Avo', description: 'Lettuce, cucumber, tomato, chicken, avocado, onion', price: 125 },
          { name: 'Calamari', description: 'Lettuce, cucumber, tomato, onion, grilled calamari', price: 140 },
          { name: 'Italian', description: 'Lettuce, tomato, cucumber, bocconcini', price: 89 },
          { name: 'Caprese', description: 'Tomato, bocconcini, basil pesto', price: 85 },
        ],
      },
    ],
  },
  {
    id: 'tadka',
    name: 'Tadka',
    emoji: '🍛',
    tagline: 'Indian curries, biryani & rice dishes',
    hasSpiceLevel: true,
    menu: [
      {
        name: 'Veg Curries',
        emoji: '🥬',
        items: [
          { name: 'Vegetable Makhani', description: 'Mixed vegetables in creamy tomato sauce', price: 99 },
          { name: 'Aloo Gobi', description: 'Potato and cauliflower curry', price: 90 },
          { name: 'Aloo Jeera', description: 'Potato with cumin seeds', price: 90 },
          { name: 'Bombay Aloo', description: 'Spiced Bombay-style potatoes', price: 90 },
          { name: 'Channa Pindi', description: 'Chickpea curry Pindi-style', price: 90 },
          { name: 'Navratan Korma', description: 'Nine-gem mixed veg korma (no chilli)', price: 110 },
          { name: 'Veg Kadai', description: 'Mixed vegetables in kadai spices', price: 99 },
          { name: 'Veg Jalfrezie', description: 'Mixed vegetables stir-fried with peppers', price: 99 },
          { name: 'Veg Jaipuri', description: 'Mixed vegetables Jaipur-style', price: 99 },
          { name: 'Aloo Mutter', description: 'Potato and peas curry', price: 95 },
        ],
      },
      {
        name: 'Paneer Curries',
        emoji: '🧀',
        items: [
          { name: 'Paneer Lababdar', description: 'Paneer in rich tomato-cream gravy', price: 120 },
          { name: 'Paneer Korma', description: 'Paneer in mild cashew korma (no chilli)', price: 120 },
          { name: 'Paneer Makhani', description: 'Paneer in creamy butter sauce', price: 120 },
          { name: 'Paneer Tikka Masala', description: 'Grilled paneer in tikka masala sauce', price: 120 },
          { name: 'Paneer Mushroom', description: 'Paneer and mushroom curry', price: 120 },
          { name: 'Paneer Palak', description: 'Paneer in spinach gravy', price: 120 },
          { name: 'Paneer Kadhai', description: 'Paneer in kadai spices with peppers', price: 115 },
        ],
      },
      {
        name: 'Dhal & Mushroom',
        emoji: '🫘',
        items: [
          { name: 'Dahi Pakodi Kadhi', description: 'Yoghurt-based curry with fried dumplings', price: 90 },
          { name: 'Dal Makhani', description: 'Black lentils in creamy butter sauce', price: 99 },
          { name: 'Dal Tadka', description: 'Yellow lentils tempered with spices', price: 89 },
          { name: 'Dhal Chef', description: "Chef's special lentil preparation", price: 90 },
          { name: 'Mushroom Kadhai', description: 'Mushrooms in kadai spices', price: 99 },
          { name: 'Mushroom & Corn Curry', description: 'Mushrooms and corn in spiced gravy', price: 99 },
        ],
      },
      {
        name: 'Chicken Curry',
        emoji: '🍗',
        items: [
          { name: 'Chicken Makhani', description: 'Butter chicken in creamy tomato sauce', price: 145 },
          { name: 'Chicken Tikka Masala', description: 'Grilled chicken in tikka masala sauce', price: 145 },
          { name: 'Chicken Korma', description: 'Chicken in mild cashew korma (no chilli)', price: 145 },
          { name: 'Chicken Saagwala', description: 'Chicken with spinach', price: 145 },
          { name: 'Chicken Chettinad', description: 'Tamil Nadu speciality — aromatic pepper curry', price: 145 },
          { name: 'Chicken Bhuna', description: 'Chicken in thick spiced onion-tomato gravy', price: 145 },
          { name: 'Chicken Kadhai', description: 'Chicken in kadai spices with peppers', price: 145 },
          { name: 'Chicken Jalfrezy', description: 'Chicken stir-fried with peppers and onions', price: 145 },
          { name: 'Chicken Pepper Fry', description: 'Chicken tossed with cracked pepper', price: 145 },
          { name: 'Chicken Vindaloo', description: 'Fiery Goan-style chicken curry', price: 145 },
          { name: 'Chicken Madras', description: 'South Indian-style chicken curry', price: 145 },
          { name: 'Chicken Lababdar', description: 'Chicken in rich tomato-cream gravy', price: 145 },
        ],
      },
      {
        name: 'Lamb Curry',
        emoji: '🐑',
        items: [
          { name: 'Lamb Rogan Josh', description: 'Kashmiri-style aromatic lamb curry', price: 179 },
          { name: 'Lamb Vindaloo', description: 'Fiery Goan-style lamb curry', price: 179 },
          { name: 'Lamb Korma', description: 'Lamb in mild cashew korma (no chilli)', price: 179 },
          { name: 'Lamb Do Piazza', description: 'Lamb with double onion preparation', price: 179 },
          { name: 'Lamb Bhuna', description: 'Lamb in thick spiced onion-tomato gravy', price: 179 },
          { name: 'Lamb Saagwala', description: 'Lamb with spinach', price: 179 },
          { name: 'Dhal Gosh', description: 'Lamb cooked with lentils', price: 179 },
          { name: 'Lamb Pepper Fry', description: 'Lamb tossed with cracked pepper', price: 179 },
          { name: 'Lamb Lababdar', description: 'Lamb in rich tomato-cream gravy', price: 179 },
          { name: 'Lamb Madras', description: 'South Indian-style lamb curry', price: 179 },
          { name: 'Lamb Chops Masala Curry', description: 'Lamb chops in aromatic masala gravy', price: 199 },
          { name: 'Lamb Boti Masala', description: 'Lamb pieces in spiced boti masala', price: 210 },
        ],
      },
      {
        name: 'Seafood Curry',
        emoji: '🐟',
        items: [
          { name: 'Fish Malabar Curry', description: 'Fish in coconut Malabar curry', price: 165 },
          { name: 'Kadhai Fish', description: 'Fish in kadai spices with peppers', price: 165 },
          { name: 'Fish Chettinad', description: 'Tamil Nadu speciality — aromatic pepper fish', price: 165 },
          { name: 'Madras Prawns', description: 'Prawns in South Indian Madras sauce', price: 190 },
          { name: 'Kadhai Prawns', description: 'Prawns in kadai spices with peppers', price: 190 },
          { name: 'Prawns Chettinad', description: 'Tamil Nadu speciality — aromatic pepper prawns', price: 190 },
          { name: 'Prawns Pepper Fry', description: 'Prawns tossed with cracked pepper', price: 190 },
        ],
      },
      {
        name: 'Rice',
        emoji: '🍚',
        items: [
          { name: 'Plain Steamed Rice', description: 'Steamed basmati rice', price: 40 },
          { name: 'Pulao Rice', description: 'Lightly spiced basmati rice', price: 55 },
          { name: 'Mushroom Pulao', description: 'Basmati rice with mushrooms', price: 55 },
          { name: 'Jeera Rice', description: 'Basmati rice with cumin seeds', price: 50 },
          { name: 'Veg Biryani', description: 'Layered vegetable biryani', price: 95 },
          { name: 'Chicken Biryani', description: 'Layered chicken biryani', price: 120 },
          { name: 'Lamb Biryani', description: 'Layered lamb biryani', price: 179 },
          { name: 'Prawn Biryani', description: 'Layered prawn biryani', price: 190 },
        ],
      },
    ],
  },
  {
    id: 'prashad',
    name: 'Prashad',
    emoji: '🙏',
    tagline: 'Vegetarian Indian cafe — curries, biryani & dosas',
    menu: [
      {
        name: 'Spinach Curries',
        emoji: '🥬',
        items: [
          { name: 'Aloo Sag', description: 'Potato in spinach curry', price: 135 },
          { name: 'Palak Paneer', description: 'Paneer in spinach gravy', price: 135 },
        ],
      },
      {
        name: 'Tomato Curries',
        emoji: '🍅',
        items: [
          { name: 'Punjabi Mushroom Masala', description: 'Mushrooms in Punjabi tomato masala', price: 130 },
          { name: 'Paneer Matar Masala', description: 'Paneer and peas in tomato masala', price: 130 },
        ],
      },
      {
        name: 'Korma',
        emoji: '🥥',
        items: [
          { name: 'Paneer Korma', description: 'Paneer in mild cashew-cream korma', price: 130 },
          { name: 'Chicken Korma', description: 'Soya chicken in mild cashew-cream korma', price: 135 },
        ],
      },
      {
        name: 'South Indian',
        emoji: '🌴',
        items: [
          { name: 'Chicken Chettinad', description: 'Soya chicken in aromatic Chettinad spices', price: 130 },
          { name: 'Paneer Chettinad', description: 'Paneer in aromatic Chettinad spices', price: 130 },
          { name: 'Baigan Ke Salan', description: 'Aubergine in tangy peanut-sesame gravy', price: 130 },
        ],
      },
      {
        name: 'North Indian',
        emoji: '🏔️',
        items: [
          { name: 'Paneer Butter Masala', description: 'Paneer in rich butter tomato sauce', price: 130 },
          { name: 'Paneer Tikka Masala Curry', description: 'Grilled paneer in tikka masala sauce', price: 130 },
          { name: 'Aloo Gobi', description: 'Potato and cauliflower curry', price: 130 },
          { name: 'Paneer Lababdar', description: 'Paneer in rich tomato-cream gravy', price: 135 },
        ],
      },
      {
        name: 'Kadai',
        emoji: '🍳',
        items: [
          { name: 'Mushroom Kadai', description: 'Mushrooms in kadai spices with peppers', price: 130 },
          { name: 'Paneer Kadai', description: 'Paneer in kadai spices with peppers', price: 130 },
        ],
      },
      {
        name: 'Durban Curries',
        emoji: '🇿🇦',
        items: [
          { name: 'Chicken Curry', description: 'Soya chicken in Durban-style curry', price: 135 },
          { name: 'Mixed Vegetable Curry', description: 'Mixed vegetables in Durban-style curry', price: 125 },
        ],
      },
      {
        name: 'Lentil Dishes',
        emoji: '🫘',
        items: [
          { name: 'Saag Lentil Dhall', description: 'Lentils cooked with spinach', price: 110 },
          { name: 'Dhall Fry', description: 'Yellow lentils tempered with spices', price: 105 },
          { name: 'Dhall Makhani', description: 'Black lentils in creamy butter sauce', price: 135 },
        ],
      },
      {
        name: 'Biryani',
        emoji: '🍚',
        items: [
          { name: 'Paneer Tikka Biryani', description: 'Layered biryani with grilled paneer tikka', price: 140 },
          { name: 'Durban Spiced Chicken Biryani', description: 'Soya chicken biryani with Durban spices', price: 140 },
          { name: 'Vegetable Biryani', description: 'Layered vegetable biryani', price: 135 },
        ],
      },
      {
        name: 'Roti Wraps',
        emoji: '🌯',
        items: [
          { name: 'Butter Bean Wrap', description: 'Roti wrap with butter bean filling', price: 95 },
          { name: 'Mix Veg Wrap', description: 'Roti wrap with mixed vegetables', price: 95 },
          { name: 'Butter Chicken Wrap', description: 'Roti wrap with butter chicken filling', price: 105 },
          { name: 'Punjabi Chole Wrap', description: 'Roti wrap with Punjabi chickpeas', price: 95 },
          { name: 'Soya Chicken Curry Wrap', description: 'Roti wrap with soya chicken curry', price: 95 },
          { name: 'Veg Korma Wrap', description: 'Roti wrap with vegetable korma', price: 105 },
        ],
      },
      {
        name: 'Street Food',
        emoji: '🥘',
        items: [
          { name: 'Plain Dosa', description: 'Crispy rice and lentil crepe', price: 55 },
          { name: 'Masala Dosa', description: 'Dosa filled with spiced potato masala', price: 95 },
          { name: 'Cheese Dosa', description: 'Dosa with melted cheese filling', price: 95 },
          { name: 'Mysore Dosa', description: 'Dosa with spicy Mysore chutney and potato', price: 100 },
        ],
      },
    ],
  },
]

/** Backward-compatible export — defaults to Posticino */
export const MENU: MenuCategory[] = RESTAURANTS[0].menu

/** Look up a restaurant by id */
export function getRestaurant(id: string): Restaurant | undefined {
  return RESTAURANTS.find(r => r.id === id)
}
