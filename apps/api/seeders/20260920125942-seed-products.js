"use strict";

export default {
  async up(queryInterface) {
    const now = new Date();

    const products = [
      {
        id: "10000000-0000-0000-0000-000000000001",
        title: "Chanel Coco Mademoiselle Eau de Parfum",
        slug: "chanel-coco-mademoiselle-eau-de-parfum",
        description:
          "An elegant and sophisticated fragrance with fresh citrus notes, a floral heart, and a warm patchouli base.",
        price: 154.0,
        stock: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000002",
        title: "Chanel Chance Eau de Parfum",
        slug: "chanel-chance-eau-de-parfum",
        description:
          "A floral fragrance with a delicate balance of pink pepper, jasmine, and warm vanilla notes.",
        price: 154.0,
        stock: 12,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000003",
        title: "Dior Sauvage Eau de Toilette",
        slug: "dior-sauvage-eau-de-toilette",
        description:
          "A fresh and powerful men's fragrance combining bergamot, pepper, aromatic lavender, and woody notes.",
        price: 115.0,
        stock: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000004",
        title: "Dior Sauvage Eau de Parfum",
        slug: "dior-sauvage-eau-de-parfum",
        description:
          "A richer interpretation of Sauvage with bergamot, vanilla, spices, and woody accords.",
        price: 135.0,
        stock: 10,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000005",
        title: "Dior J'adore Eau de Parfum",
        slug: "dior-jadore-eau-de-parfum",
        description:
          "A luminous floral fragrance built around elegant jasmine, rose, and ylang-ylang notes.",
        price: 145.0,
        stock: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000006",
        title: "Yves Saint Laurent Libre Eau de Parfum",
        slug: "ysl-libre-eau-de-parfum",
        description:
          "A modern floral fragrance combining orange blossom and lavender with a warm vanilla base.",
        price: 135.0,
        stock: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000007",
        title: "Yves Saint Laurent Black Opium Eau de Parfum",
        slug: "ysl-black-opium-eau-de-parfum",
        description:
          "A warm and addictive fragrance blending coffee, white flowers, vanilla, and woody notes.",
        price: 130.0,
        stock: 14,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000008",
        title: "Yves Saint Laurent Y Eau de Parfum",
        slug: "ysl-y-eau-de-parfum",
        description:
          "A fresh woody fragrance combining bergamot, sage, apple, geranium, and warm woods.",
        price: 125.0,
        stock: 11,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000009",
        title: "Giorgio Armani Acqua di Giò Eau de Toilette",
        slug: "giorgio-armani-acqua-di-gio-eau-de-toilette",
        description:
          "A fresh aquatic fragrance inspired by the Mediterranean, with citrus, marine, and woody notes.",
        price: 110.0,
        stock: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000010",
        title: "Giorgio Armani My Way Eau de Parfum",
        slug: "giorgio-armani-my-way-eau-de-parfum",
        description:
          "A feminine floral fragrance featuring bergamot, orange blossom, tuberose, jasmine, and vanilla.",
        price: 125.0,
        stock: 9,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000011",
        title: "Lancôme La Vie Est Belle Eau de Parfum",
        slug: "lancome-la-vie-est-belle-eau-de-parfum",
        description:
          "A sweet and elegant floral gourmand fragrance with iris, jasmine, praline, vanilla, and patchouli.",
        price: 120.0,
        stock: 13,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000012",
        title: "Carolina Herrera Good Girl Eau de Parfum",
        slug: "carolina-herrera-good-girl-eau-de-parfum",
        description:
          "A contrasting fragrance combining luminous jasmine with rich cocoa, tonka bean, and coffee notes.",
        price: 130.0,
        stock: 8,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000013",
        title: "Jean Paul Gaultier Le Male Eau de Toilette",
        slug: "jean-paul-gaultier-le-male-eau-de-toilette",
        description:
          "A classic masculine fragrance combining fresh mint and lavender with vanilla and warm woods.",
        price: 105.0,
        stock: 15,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000014",
        title: "Maison Margiela Replica By the Fireplace",
        slug: "maison-margiela-replica-by-the-fireplace",
        description:
          "A warm woody fragrance evoking a cozy fireplace with chestnut, clove, vanilla, and smoky woods.",
        price: 145.0,
        stock: 7,
        created_at: now,
        updated_at: now,
      },
      {
        id: "10000000-0000-0000-0000-000000000015",
        title: "Jo Malone Wood Sage & Sea Salt Cologne",
        slug: "jo-malone-wood-sage-sea-salt-cologne",
        description:
          "A fresh woody fragrance inspired by the British coast, combining ambrette seeds, sea salt, and sage.",
        price: 175.0,
        stock: null,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert("products", products);

    const variants = [
      // Coco Mademoiselle
      {
        id: "20000000-0000-0000-0000-000000000001",
        product_id: "10000000-0000-0000-0000-000000000001",
        name: "Size",
        value: "50ml",
        price: 120.0,
        stock: 10,
        created_at: now,
        updated_at: now,
      },
      {
        id: "20000000-0000-0000-0000-000000000002",
        product_id: "10000000-0000-0000-0000-000000000001",
        name: "Size",
        value: "100ml",
        price: 154.0,
        stock: 7,
        created_at: now,
        updated_at: now,
      },
      {
        id: "20000000-0000-0000-0000-000000000003",
        product_id: "10000000-0000-0000-0000-000000000001",
        name: "Size",
        value: "200ml",
        price: 205.0,
        stock: 4,
        created_at: now,
        updated_at: now,
      },

      // Dior Sauvage EDT
      {
        id: "20000000-0000-0000-0000-000000000004",
        product_id: "10000000-0000-0000-0000-000000000003",
        name: "Size",
        value: "60ml",
        price: 95.0,
        stock: 12,
        created_at: now,
        updated_at: now,
      },
      {
        id: "20000000-0000-0000-0000-000000000005",
        product_id: "10000000-0000-0000-0000-000000000003",
        name: "Size",
        value: "100ml",
        price: 115.0,
        stock: 8,
        created_at: now,
        updated_at: now,
      },

      // YSL Libre
      {
        id: "20000000-0000-0000-0000-000000000006",
        product_id: "10000000-0000-0000-0000-000000000006",
        name: "Size",
        value: "30ml",
        price: 95.0,
        stock: 9,
        created_at: now,
        updated_at: now,
      },
      {
        id: "20000000-0000-0000-0000-000000000007",
        product_id: "10000000-0000-0000-0000-000000000006",
        name: "Size",
        value: "50ml",
        price: 135.0,
        stock: 6,
        created_at: now,
        updated_at: now,
      },
      {
        id: "20000000-0000-0000-0000-000000000008",
        product_id: "10000000-0000-0000-0000-000000000006",
        name: "Size",
        value: "90ml",
        price: 170.0,
        stock: 4,
        created_at: now,
        updated_at: now,
      },

      // Dior J'adore
      {
        id: "20000000-0000-0000-0000-000000000009",
        product_id: "10000000-0000-0000-0000-000000000005",
        name: "Size",
        value: "50ml",
        price: 115.0,
        stock: 8,
        created_at: now,
        updated_at: now,
      },
      {
        id: "20000000-0000-0000-0000-000000000010",
        product_id: "10000000-0000-0000-0000-000000000005",
        name: "Size",
        value: "100ml",
        price: 145.0,
        stock: 5,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert("variants", variants);

    const images = [
      {
        id: "30000000-0000-0000-0000-000000000001",
        product_id: "10000000-0000-0000-0000-000000000001",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000002",
        product_id: "10000000-0000-0000-0000-000000000002",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000003",
        product_id: "10000000-0000-0000-0000-000000000003",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000004",
        product_id: "10000000-0000-0000-0000-000000000004",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000005",
        product_id: "10000000-0000-0000-0000-000000000005",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000006",
        product_id: "10000000-0000-0000-0000-000000000006",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000007",
        product_id: "10000000-0000-0000-0000-000000000007",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000008",
        product_id: "10000000-0000-0000-0000-000000000008",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1595535373192-fc8935bacd89?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000009",
        product_id: "10000000-0000-0000-0000-000000000009",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000010",
        product_id: "10000000-0000-0000-0000-000000000010",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1523293836415-4f2f2e0d3f52?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000011",
        product_id: "10000000-0000-0000-0000-000000000011",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1566977776052-6e61e35bf9f5?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000012",
        product_id: "10000000-0000-0000-0000-000000000012",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1595425964078-5f3e8c6c1c4f?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000013",
        product_id: "10000000-0000-0000-0000-000000000013",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000014",
        product_id: "10000000-0000-0000-0000-000000000014",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1619994403073-2f6c1b7a4d3e?w=800",
        is_primary: true,
        created_at: now,
      },
      {
        id: "30000000-0000-0000-0000-000000000015",
        product_id: "10000000-0000-0000-0000-000000000015",
        variant_id: null,
        image_url:
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800",
        is_primary: true,
        created_at: now,
      },
    ];

    await queryInterface.bulkInsert("product_images", images);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("product_images", null, {});
    await queryInterface.bulkDelete("variants", null, {});
    await queryInterface.bulkDelete("products", null, {});
  },
};