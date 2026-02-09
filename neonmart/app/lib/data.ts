export type Product = {
    id: string;
    name: string;
    price: number;
    desc: string;
    image: string;
  };
  
  export const products: Product[] = [
    { id: "hoodie", name: "Neon Hoodie", price: 89, desc: "Heavyweight, reflective piping.", image: "/p1.png" },
    { id: "sneakers", name: "Flux Sneakers", price: 129, desc: "Glow sole, street-ready.", image: "/p2.png" },
    { id: "backpack", name: "Arc Backpack", price: 74, desc: "Waterproof + laptop sleeve.", image: "/p3.png" },
  ];
  
  export const fmt = (n: number) => `$${n.toFixed(2)}`;
  