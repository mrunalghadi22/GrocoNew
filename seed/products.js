const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../config/db");
const Product = require("../models/Product");
const Category = require("../models/Category");

const products = [
    {
      name: "Maggi 2-Minute Masala, Easy to Make Instant Noodles Vegetarian ",
      description: "Maggi is a popular instant noodle brand known for its quick preparation and flavorful taste. It is widely consumed as a convenient snack or meal, especially in India and other Asian countries.",
      keywords: "Maggi, Maggi noodles, instant noodles, 2-minute noodles, quick meal, easy snack, instant food, Maggi masala, fast cooking noodles, best instant noodles",
      price: 15.00,
      discount: 50,
      stock: 15,
      weight1: "70",
      weight2: "140",
      weight3: "280",
      weight4: "480",
      weight_unit: "gm",
      category_id: 2,
      status: "active",
      image1: "../../uploads/img_67bda931b3d640.83465269.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Nescafe Classic Coffee Powder, 100% Pure Instant Coffee",
      description: "Nescafé is a well-known brand of instant coffee, offering a wide variety of coffee blends. It is popular for its rich taste and convenience, making it a go-to beverage for many coffee lovers worldwide.",
      keywords: "Nescafé, Nescafé Classic, instant coffee, pure coffee powder, Nescafé instant, coffee powder, strong coffee, black coffee, caffeine boost, quick coffee, morning coffee, rich aroma coffee, Nescafé Classic jar, brewed coffee, best instant coffee, Nescafé pu",
      price: 387.00,
      discount: 45,
      stock: 21,
      weight1: "24",
      weight2: "45",
      weight3: "90",
      weight4: "",
      weight_unit: "gm",
      category_id: 1,
      status: "active",
      image1: "../../uploads/img_67b95f8c8780f3.71982452.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "B Natural Mango Juice, Goodness of fiber, Vit C & E",
      description: "B Natural Mango Juice is a refreshing beverage made from real mangoes, enriched with the goodness of fiber, Vitamin C, and Vitamin E. It offers a natural, healthy option for enjoying the sweet and tangy flavor of mangoes.",
      keywords: "juice, B Natural Mango Juice, mango juice, real mango drink, healthy fruit juice, vitamin C juice, fiber-rich juice, refreshing mango drink, packaged mango juice, nutritious beverage, summer drink, mango flavored juice, natural fruit juice, immunity-boost",
      price: 150.00,
      discount: 5,
      stock: 12,
      weight1: "1",
      weight2: "2",
      weight3: "",
      weight4: "",
      weight_unit: "ml",
      category_id: 1,
      status: "pending",
      image1: "../../uploads/img_679f467d78cdf0.10148672.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "FORTUNE Suji (Rawa)",
      description: "FORTUNE Suji (Rawa) is a high-quality semolina made from finely ground wheat, commonly used in Indian cooking. It is versatile, ideal for making dishes like upma, halwa, and dosa, providing a rich texture and flavor.",
      keywords: "Fortune Suji, Fortune Rawa, suji, rawa, semolina, wheat semolina, fine suji, coarse suji, cooking essentials, healthy grains, baking ingredient, upma suji, halwa suji, dosa rawa, Indian cooking, nutritious suji, best suji brand, premium semolina, Fortune ",
      price: 27.00,
      discount: 5,
      stock: 6,
      weight1: "50",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "gm",
      category_id: 4,
      status: "active",
      image1: "../../uploads/img_679f473de82ca1.43704398.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Amul Moti Toned Milk",
      description: "Amul Moti Toned Milk is a dairy product that offers a balanced, creamy taste with reduced fat content. It is enriched with essential nutrients, making it a healthy and popular choice for daily consumption.",
      keywords: "milk, Amul Moti, Amul toned milk, toned milk, Amul milk, dairy milk, healthy milk, low-fat milk, nutritious milk, fresh milk, daily milk, best toned milk, Amul dairy, calcium-rich milk, protein milk, packaged milk, Amul Moti pack, milk for tea, milk for c",
      price: 30.00,
      discount: 5,
      stock: 30,
      weight1: "1",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "lit",
      category_id: 5,
      status: "active",
      image1: "../../uploads/img_679f47db9708c8.10014096.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Parachute Pure Coconut Hair Oil (Naralache Tel)",
      description: "Parachute Pure Coconut Hair Oil (Naralache Tel) is a premium hair oil made from 100% pure coconut extract. It nourishes and strengthens the hair, promoting healthy growth and providing a natural shine.",
      keywords: " Personal & Baby Care,Parachute coconut oil, pure coconut hair oil, Parachute oil, Naralache tel, coconut hair oil, natural hair oil, hair nourishment, scalp care oil, hair strengthening oil, best coconut oil, Parachute blue bottle, deep conditioning oil,",
      price: 45.00,
      discount: 10,
      stock: 24,
      weight1: "100",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "ml",
      category_id: 3,
      status: "active",
      image1: "../../uploads/img_679f485c1ae096.88111356.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Bingo Chilli Sprinkled Chips",
      description: "Bingo Chilli Sprinkled Chips are crispy potato chips coated with a zesty and spicy chili seasoning. They offer a flavorful, tangy snack that's perfect for those who enjoy a bold and spicy taste.",
      keywords: "snacks, chips, Bingo chips, spicy chips, chilli sprinkled chips, Bingo snack, crispy chips, masala chips, potato chips, tangy chips, Indian snacks, crunchy chips, spicy namkeen, Bingo spicy flavor, best potato chips, tea-time snack, party snacks, chili-fl",
      price: 26.00,
      discount: 5,
      stock: 100,
      weight1: "90",
      weight2: "180",
      weight3: "360",
      weight4: "",
      weight_unit: "gm",
      category_id: 1,
      status: "active",
      image1: "../../uploads/img_679f491e0fe3b7.05827093.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Del Monte Tomato Classic Blend Ketchup",
      description: "Del Monte Tomato Classic Blend Ketchup is a rich, flavorful condiment made from ripe tomatoes, offering a perfect balance of sweetness and tanginess. It is a versatile sauce, ideal for pairing with snacks, fries, and various dishes.",
      keywords: "Del Monte ketchup, tomato ketchup, classic blend ketchup, Del Monte tomato sauce, rich tomato ketchup, tangy ketchup, best ketchup brand, tomato condiment, dipping sauce, burger ketchup, french fries ketchup, Del Monte sauce, sweet and tangy ketchup, fast",
      price: 45.00,
      discount: 15,
      stock: 20,
      weight1: "750",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "gm",
      category_id: 2,
      status: "active",
      image1: "../../uploads/img_679f498c5658a8.12816125.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Gowardhan Rich n Thick Plain Curd ",
      description: "Gowardhan Rich n Thick Plain Curd is a creamy and wholesome dairy product made from pure milk. It has a rich texture and probiotic benefits, making it perfect for daily consumption in meals and recipes.",
      keywords: "Gowardhan curd, rich and thick curd, plain curd, fresh curd, dairy curd, probiotic curd, creamy curd, natural curd, best curd brand, thick yogurt, healthy dairy product, Gowardhan dairy, homemade-style curd, calcium-rich curd, nutritious curd, curd for di",
      price: 70.00,
      discount: 5,
      stock: 12,
      weight1: "400",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "gm",
      category_id: 5,
      status: "active",
      image1: "../../uploads/img_67a03446046656.61374663.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Tide Extra Power Jasmine and Rose Detergent Powder 7 kg  (3 kg Extra in Pack)  (Jasmine & Rose)",
      description: "Tide Extra Power Jasmine & Rose Detergent Powder offers superior stain removal with a refreshing floral fragrance. This 7 kg pack includes 3 kg extra, ensuring long-lasting freshness and effective cleaning for bright and fresh clothes.",
      keywords: "Tide detergent, Tide Extra Power, jasmine and rose detergent, Tide washing powder, best detergent powder, stain removal detergent, laundry detergent, Tide 7 kg pack, extra power detergent, floral fragrance detergent, jasmine rose washing powder, deep clea",
      price: 838.00,
      discount: 5,
      stock: 5,
      weight1: "2",
      weight2: "4",
      weight3: "6",
      weight4: "7",
      weight_unit: "kg",
      category_id: 6,
      status: "active",
      image1: "../../uploads/img_67a08b50af8c78.38094433.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Smoodh Flavoured Milk  (Chocolate, 80 ml)",
      description: "Smoodh Chocolate Flavoured Milk is a rich and creamy dairy beverage with a delicious chocolate taste. Packed in a convenient 80 ml pack, it offers a perfect on-the-go refreshment with the goodness of milk.",
      keywords: "Smoodh chocolate milk, flavored milk, chocolate drink, dairy beverage, milkshake, chocolate flavored milk, small pack milk, on-the-go drink, healthy chocolate drink, creamy milk",
      price: 8.00,
      discount: 2,
      stock: 15,
      weight1: "80",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "ml",
      category_id: 5,
      status: "active",
      image1: "../../uploads/img_67b5696635c514.35122351.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Amul Kool Badam Milk",
      description: "Amul Kool Badam is a refreshing, flavored milk drink infused with the rich taste of almonds. Packed in a convenient 180 ml bottle, it offers a perfect blend of nutrition and taste, making it a delightful on-the-go beverage.",
      keywords: "Amul Kool Badam, almond flavored milk, Amul badam milk, Amul drink, Amul Kool 180ml, refreshing milk drink, badam shake, nutty milk drink, healthy milk drink, flavored dairy beverage",
      price: 25.00,
      discount: 5,
      stock: 12,
      weight1: "180",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "ml",
      category_id: 5,
      status: "active",
      image1: "../../uploads/img_67b56b38a86e10.16234738.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "Gowardhan Pure Cow Ghee 200 ml Plastic Bottle (Tup)",
      description: "Gowardhan Pure Cow Ghee is a premium-quality ghee made from 100% cow’s milk, offering a rich aroma and authentic taste. Packed in a convenient 200 ml plastic bottle (tup), it is perfect for daily cooking, enhancing flavors, and promoting good health.",
      keywords: "Gowardhan ghee, pure cow ghee, desi ghee, traditional ghee, cooking ghee, healthy ghee, 200ml ghee, best cow ghee, clarified butter, organic ghee",
      price: 173.00,
      discount: 20,
      stock: 6,
      weight1: "200",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "ml",
      category_id: 4,
      status: "active",
      image1: "../../uploads/img_67b56c8d34a926.84898066.webp",
      image2: "",
      image3: "",
      image4: ""
    },
    {
      name: "RiteBite Max Choco Almond Bars, Fiber, 2hr Energy Pouch  (50 g)",
      description: "RiteBite Max Choco Almond Bar is a nutritious energy bar packed with protein, fiber, and the goodness of almonds and chocolate. It provides up to 2 hours of sustained energy, making it a perfect healthy snack for active lifestyles.",
      keywords: "RiteBite Max, choco almond bar, energy bar, protein bar, fiber-rich bar, healthy snack, 2-hour energy bar, chocolate almond snack, nutrition bar, fitness snack, high-energy bar, meal replacement bar, RiteBite energy pouch, best protein bar, pre-workout sn",
      price: 75.00,
      discount: 16,
      stock: 15,
      weight1: "50",
      weight2: "",
      weight3: "",
      weight4: "",
      weight_unit: "gm",
      category_id: 2,
      status: "active",
      image1: "../../uploads/img_67bea242635b06.96679317.webp",
      image2: "",
      image3: "",
      image4: ""
    }
  ];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    for (const item of products) {
      const category = await Category.findOne({ sqlId: item.category_id });

      if (!category) {
        console.log(`Category not found for ${item.name}`);
        continue;
      }

      await Product.create({
        name: item.name,
        description: item.description,
        keywords: item.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),

        price: item.price,
        discount: item.discount,
        stock: item.stock,

        weights: [
          ...(item.weight1 ? [{ value: item.weight1 }] : []),
          ...(item.weight2 ? [{ value: item.weight2 }] : []),
          ...(item.weight3 ? [{ value: item.weight3 }] : []),
          ...(item.weight4 ? [{ value: item.weight4 }] : []),
        ],

        weight_unit: item.weight_unit,

        category: category._id,

        status: item.status,

        images: [
          ...(item.image1 ? [item.image1.replace("../../", "/")] : []),
          ...(item.image2 ? [item.image2.replace("../../", "/")] : []),
          ...(item.image3 ? [item.image3.replace("../../", "/")] : []),
          ...(item.image4 ? [item.image4.replace("../../", "/")] : []),
        ],
      });
    }

    console.log("✅ Products Seeded Successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProducts();