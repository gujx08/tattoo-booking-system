import { Artist } from '../types';

export const ARTISTS_DATA: Artist[] = [
  {
    id: 'jing',
    name: 'Jingxi Gu',
    displayName: 'Jing',
    category: 'Lead Artist',
    experience: '9 years',
    deposit: 300,
    specialties: ['Asian Traditional', 'Chinese brush painting style', 'Freehand tattoos'],
    description: 'Jing mainly does big cohesive tattoos in Asian Traditional style, such as full sleeves. She also does small colorful tattoos in semi realism or Chinese brush painting style. Jing specializes in making the tattoo perfectly fit with the body. She prefers to use subtle colors that fit with the skin tone instead of using vibrant colors. She also uses a lot of freehand techniques to allow the tattoo fit with the body the best.',
    instagram: '@tattooartist_jing',
    avatar: 'https://res.cloudinary.com/dkzykupcc/image/upload/artists/jing',
    video: 'https://res.cloudinary.com/dkzykupcc/video/upload/f_auto,q_auto/artists/videos/intro_jing.mp4',
    portfolio: [
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/jing/work_1.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/jing/work_2.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/jing/work_3.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/jing/work_4.jpg'
    ],
    pricing: {
      dayRate: 2500,
      halfDay: 'N/A',
      minimum: 'N/A',
      touchUp: 'Free',
      coverUpExtra: '500-1000',
      flashDiscount: '70% of full price'
    },
    specialNote: 'Jing specializes in large, complex tattoos that require extensive design time. After confirming your design requirements, Jing will collect an additional $500-1000 design deposit (which will be deducted from the final price along with your $300 booking deposit).',
    reviews: [
      {
        name: 'Marcus L.',
        rating: 5,
        text: 'Jing created an incredible full sleeve dragon in traditional Asian style. Her freehand technique is amazing - she drew directly on my arm to make it flow perfectly with my body. The subtle color choices complement my skin tone beautifully. Worth every penny for such masterful work!'
      },
      {
        name: 'Sarah K.',
        rating: 5,
        text: 'I got a large koi fish and cherry blossom piece from Jing. Her understanding of traditional Asian symbolism and brush painting techniques is unmatched. She spent hours perfecting the design to fit my back perfectly. The healing process was smooth and the final result is breathtaking.'
      }
    ]
  },
  {
    id: 'rachel',
    name: 'Rachel Hong',
    displayName: 'Rachel',
    category: 'Senior Artist',
    experience: '3 years',
    deposit: 100,
    specialties: ['Small color realism', 'Manga tattoos', 'Watercolor tattoos'],
    description: "Rachel specializes in bold, colorful tattoos that are built to last. She often works with panel-style compositions and watercolor-inspired designs, blending structure with fluidity. Rachel's artistry shines through her use of vibrant palettes, with a strong focus on floral, nature, and Asian-inspired themes. Known for her excellent saturation and clean execution, her work maintains vibrancy and longevity over time.",
    instagram: '@rachel_tattooartist',
    avatar: 'https://res.cloudinary.com/dkzykupcc/image/upload/artists/rachel',
    video: 'https://res.cloudinary.com/dkzykupcc/video/upload/f_auto,q_auto/artists/videos/intro_rachel.mp4',
    portfolio: [
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/rachel/work_1.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/rachel/work_2.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/rachel/work_3.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/rachel/work_4.jpg'
    ],
    pricing: {
      dayRate: 800,
      halfDay: 600,
      minimum: 300,
      touchUp: 'Free',
      coverUpExtra: '100-500',
      flashDiscount: '70% of full price'
    },
    reviews: [
      {
        name: 'Emma T.',
        rating: 5,
        text: 'Rachel did the most vibrant strawberry tattoo on my wrist! The colors are so saturated and beautiful. She perfectly captured the anime style I wanted. Even after 6 months, the colors are still as bright as day one. Her attention to detail in small pieces is incredible!'
      },
      {
        name: 'Jake M.',
        rating: 5,
        text: 'Got a watercolor gaming controller from Rachel and it\'s absolutely perfect! The color blending technique she uses is phenomenal. She really understands how to make small tattoos pop with vibrant colors. The healing was great and it looks exactly like the reference art I showed her.'
      }
    ]
  },
  {
    id: 'jasmine',
    name: 'Jasmine Hsueh',
    displayName: 'Jas',
    category: 'Senior Artist',
    experience: '3 years',
    deposit: 100,
    specialties: ['Fine line', 'Asian topic tattoos', 'Ink wash'],
    description: 'Jasmine mainly does fine line tattoos, sometimes with a little bit color, or some shading. She works a lot with Asian topics such as koi fish and Yin Yang symbols. Jasmine is a great communicator and always satisfies her clients with good designs. She has very clean lines, and pays great attention to the details.',
    instagram: '@jascreates.tattoo',
    avatar: 'https://res.cloudinary.com/dkzykupcc/image/upload/artists/jasmine',
    video: 'https://res.cloudinary.com/dkzykupcc/video/upload/f_auto,q_auto/artists/videos/intro_jasmine.mp4',
    portfolio: [
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/jasmine/work_1.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/jasmine/work_2.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/jasmine/work_3.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/jasmine/work_4.jpg'
    ],
    pricing: {
      dayRate: 800,
      halfDay: 600,
      minimum: 300,
      touchUp: 'Free',
      coverUpExtra: '100-500',
      flashDiscount: '70% of full price'
    },
    reviews: [
      {
        name: 'Lily C.',
        rating: 5,
        text: 'Jasmine created the most delicate fine line koi fish on my ankle. Her linework is incredibly precise and clean. She explained the symbolism behind the design and made sure every detail was perfect. The communication throughout the process was excellent - she really listens to what you want.'
      },
      {
        name: 'David R.',
        rating: 5,
        text: 'Got a minimalist yin yang with subtle shading from Jas. Her fine line technique is flawless - every line is perfectly straight and consistent. She has such a gentle touch and the healing was incredibly smooth. The attention to detail in such a small piece is remarkable!'
      }
    ]
  },
  {
    id: 'lauren',
    name: 'Lauren Hacaga',
    displayName: 'Lauren',
    category: 'Junior Artist',
    experience: '1 year',
    deposit: 100,
    specialties: ['Black n grey', 'Nature tattoos', 'Anime/manga'],
    description: 'Lauren mainly does tattoos in black and gray, sometimes with a hint of color. She works a lot with pet portraits and all types of bugs. Lauren is very caring for her clients, and she pays great attention to the details. Lauren also loves manga and would like to work more with manga or anime themes.',
    instagram: '@laurtattoos',
    avatar: 'https://res.cloudinary.com/dkzykupcc/image/upload/artists/lauren',
    video: 'https://res.cloudinary.com/dkzykupcc/video/upload/f_auto,q_auto/artists/videos/intro_lauren.mp4',
    portfolio: [
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/lauren/work_1.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/lauren/work_2.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/lauren/work_3.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/lauren/work_4.jpg'
    ],
    pricing: {
      dayRate: 400,
      halfDay: 250,
      minimum: 100,
      touchUp: 'Free',
      coverUpExtra: '100-500',
      flashDiscount: '70% of full price'
    },
    reviews: [
      {
        name: 'Michelle P.',
        rating: 5,
        text: 'Lauren did an amazing black and gray portrait of my dog who passed away. The realism is incredible - she captured every detail of his expression perfectly. She was so caring and understanding throughout the emotional process. The shading work is phenomenal for someone with just 1 year of experience!'
      },
      {
        name: 'Alex B.',
        rating: 5,
        text: 'Got a detailed beetle tattoo from Lauren and I\'m blown away! Her knowledge of insect anatomy is impressive and the black work is so crisp. She added just a tiny hint of color that makes it pop. Lauren is super sweet and made me feel comfortable during my first tattoo experience.'
      }
    ]
  },
  {
    id: 'annika',
    name: 'Annika Riggins',
    displayName: 'Annika',
    category: 'Junior Artist',
    experience: '1 year',
    deposit: 100,
    specialties: ['Line work', 'Vintage tattoos', 'Black tattoos'],
    description: 'Annika has unique designer background and her tattoos are one of a kind. Her designs have a blend of traditional antique look with a modern touch. She mainly does line work, sometimes with a little bit shading.',
    instagram: '@annikatattoos',
    avatar: 'https://res.cloudinary.com/dkzykupcc/image/upload/artists/annika',
    video: 'https://res.cloudinary.com/dkzykupcc/video/upload/f_auto,q_auto/artists/videos/intro_annika.mp4',
    hidden: true, // 隐藏此艺术家卡片
    portfolio: [
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/annika/work_1.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/annika/work_2.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/annika/work_3.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/annika/work_4.jpg'
    ],
    pricing: {
      dayRate: 400,
      halfDay: 250,
      minimum: 100,
      touchUp: 'Free',
      coverUpExtra: '100-500',
      flashDiscount: '70% of full price'
    },
    reviews: [
      {
        name: 'Sophie W.',
        rating: 5,
        text: 'Annika designed the most unique vintage-inspired piece for me! Her designer background really shows - the composition is perfect and unlike anything I\'ve seen before. The antique aesthetic with modern elements is exactly what I was looking for. Her artistic vision is incredible!'
      },
      {
        name: 'Ryan H.',
        rating: 5,
        text: 'Got a vintage pocket watch design from Annika and it\'s absolutely one of a kind! Her line work is so clean and the traditional style with modern touches is perfect. She really took time to understand my vision and created something completely custom. Her design skills are top-notch!'
      }
    ]
  },
  {
    id: 'maili',
    name: 'Maili Cohen',
    displayName: 'Maili',
    category: 'Apprentice',
    deposit: 50,
    priceRange: '$50-100',
    description: 'Maili is currently under apprenticeship training and developing her artistic skills.',
    avatar: 'https://res.cloudinary.com/dkzykupcc/image/upload/artists/maili',
    video: 'https://res.cloudinary.com/dkzykupcc/video/upload/f_auto,q_auto/artists/videos/intro_maili.mp4',
    portfolio: [
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/maili/work_1.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/maili/work_2.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/maili/work_3.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/maili/work_4.jpg'
    ],
    reviews: [
      {
        name: 'Taylor M.',
        rating: 5,
        text: 'Maili did my first tattoo and made the experience so comfortable! Even as an apprentice, her attention to detail is amazing. She took her time to make sure everything was perfect and the line work came out clean. Great value and she\'s definitely going to be an incredible artist!'
      },
      {
        name: 'Jordan K.',
        rating: 5,
        text: 'Really impressed with Maili\'s work! She may be an apprentice but her dedication shows. She was super careful with every line and asked for feedback throughout. The final result exceeded my expectations for the price point. Can\'t wait to see how her skills develop!'
      }
    ]
  },
  {
    id: 'keani',
    name: 'Keani Chavez',
    displayName: 'Keani',
    category: 'Apprentice',
    deposit: 50,
    priceRange: '$50-100',
    description: 'Keani is currently under apprenticeship training and developing her artistic skills.',
    avatar: 'https://res.cloudinary.com/dkzykupcc/image/upload/artists/keani',
    video: 'https://res.cloudinary.com/dkzykupcc/video/upload/f_auto,q_auto/artists/videos/intro_keani.mp4',
    portfolio: [
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/keani/work_1.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/keani/work_2.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/keani/work_3.jpg',
      'https://res.cloudinary.com/dkzykupcc/image/upload/portfolio/keani/work_4.jpg'
    ],
    reviews: [
      {
        name: 'Casey L.',
        rating: 5,
        text: 'Keani was so sweet and professional during my session! She\'s still learning but her passion for tattooing really shows. She took extra care with the stencil placement and made sure I was happy with every step. The simple design came out exactly how I wanted it!'
      },
      {
        name: 'Morgan D.',
        rating: 5,
        text: 'Had a great experience with Keani for a small script tattoo. She was nervous but so focused on doing her best work. Her mentor was nearby for guidance which made me feel confident. The lettering is clean and straight. Excited to watch her grow as an artist!'
      }
    ]
  }
];