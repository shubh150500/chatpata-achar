import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Royal Aam ka Achaar",
    slug: "royal-aam-ka-achaar",
    weight: "500g",
    price: 349,
    mrp: 449,
    description:
      "Sun-ripened raw mango chunks slow-cured in cold-pressed mustard oil with hand-pounded spices. A heritage recipe passed down four generations.",
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    category: "Mango",
    featured: true,
    spiceLevel: 4,
  },
  {
    name: "Fiery Nimbu Achaar",
    slug: "fiery-nimbu-achaar",
    weight: "400g",
    price: 299,
    mrp: 379,
    description:
      "Whole Indian lemons matured in their own juices with rock salt and a warm blend of roasted spices. Tangy, bright, unforgettable.",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    category: "Lemon",
    featured: true,
    spiceLevel: 5,
  },
  {
    name: "Punjabi Mirch Achaar",
    slug: "punjabi-mirch-achaar",
    weight: "350g",
    price: 279,
    mrp: 329,
    description:
      "Plump green chillies stuffed with fennel and mustard, the way Punjab's grandmothers have made it for a century.",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80",
    category: "Chilli",
    featured: false,
    spiceLevel: 5,
  },
  {
    name: "Garlic Lehsun Achaar",
    slug: "garlic-lehsun-achaar",
    weight: "300g",
    price: 319,
    mrp: 399,
    description:
      "Whole garlic cloves slow-pickled until tender, rich with mustard oil and a deep, savoury spice base.",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    category: "Garlic",
    featured: true,
    spiceLevel: 3,
  },
  {
    name: "Mixed Vegetable Achaar",
    slug: "mixed-vegetable-achaar",
    weight: "500g",
    price: 359,
    mrp: 459,
    description:
      "Carrot, cauliflower, turnip and chilli cured together in a fragrant mustard-oil masala. A festive jar of colour and crunch.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    category: "Mixed",
    featured: false,
    spiceLevel: 4,
  },
  {
    name: "Sweet Aam Chunda",
    slug: "sweet-aam-chunda",
    weight: "450g",
    price: 329,
    mrp: 399,
    description:
      "Grated raw mango sun-cooked with jaggery and cardamom into a luscious sweet-and-spicy preserve. Gujarat's golden treasure.",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    category: "Mango",
    featured: true,
    spiceLevel: 2,
  },
];

async function main() {
  console.log("🌶️  Seeding Chatpata Achaar...");

  // Admin user
  const email = process.env.ADMIN_EMAIL || "admin@chatpata.com";
  const password = process.env.ADMIN_PASSWORD || "achaar123";
  const hash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash, name: "Store Admin" },
  });
  console.log(`✅ Admin ready: ${email}`);

  // Settings
  await prisma.setting.upsert({
    where: { key: "whatsapp_number" },
    update: {},
    create: {
      key: "whatsapp_number",
      value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999",
    },
  });

  // Products
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log(`✅ Seeded ${products.length} products`);
  console.log("🎉 Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
