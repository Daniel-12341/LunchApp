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

export const MENU: MenuCategory[] = [
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
]
