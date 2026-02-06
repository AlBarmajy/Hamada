import { Category, MenuItem } from '../types';

export const categories: Category[] = [
  { id: 'koshary', name: 'قسم الكشري' },
  { id: 'casseroles', name: 'قسم الطواجن' },
  { id: 'grill', name: 'قسم المشويات' },
  { id: 'trays', name: 'صواني حمادة' },
  { id: 'meals', name: 'وجبات فردية' },
  { id: 'crepe_syrian', name: 'كريب وسوري' },
  { id: 'desserts', name: 'الحلو والمشروبات' },
];

export const initialMenu: MenuItem[] = [
  // 1. قسم الكشري
  {
    id: 'k1', categoryId: 'koshary', name: 'كشري سادة', isAvailable: true,
    variants: [
      { name: 'حمادة', price: 20 }, { name: 'سوبر', price: 25 }, { name: 'صاروخ', price: 30 },
      { name: 'الأكيل', price: 35 }, { name: 'حمادة الأكيل', price: 40 }, { name: 'عائلي', price: 50 }, { name: 'ملوكي', price: 70 }
    ]
  },
  {
    id: 'k2', categoryId: 'koshary', name: 'كشري لحوم', isAvailable: true,
    variants: [
      { name: 'صغير', price: 40 }, { name: 'وسط', price: 45 }, { name: 'كبير', price: 50 },
      { name: 'سوبر', price: 55 }, { name: 'جامبو', price: 60 }, { name: 'ملوكي', price: 70 }
    ]
  },
  {
    id: 'k3', categoryId: 'koshary', name: 'كشري فراخ', isAvailable: true,
    variants: [
      { name: 'صغير', price: 50 }, { name: 'وسط', price: 60 }, { name: 'كبير', price: 70 }
    ]
  },

  // 2. قسم الطواجن
  {
    id: 't1', categoryId: 'casseroles', name: 'طاجن لحمة/كبدة/سجق', isAvailable: true,
    variants: [{ name: 'عادي', price: 30 }, { name: 'سوبر', price: 40 }, { name: 'جامبو', price: 55 }]
  },
  {
    id: 't2', categoryId: 'casseroles', name: 'طاجن فراخ', isAvailable: true,
    variants: [{ name: 'عادي', price: 35 }, { name: 'سوبر', price: 45 }, { name: 'جامبو', price: 55 }]
  },
  {
    id: 't3', categoryId: 'casseroles', name: 'طاجن موتزاريللا لحوم', isAvailable: true,
    variants: [{ name: 'سوبر', price: 45 }, { name: 'جامبو', price: 60 }]
  },
  {
    id: 't4', categoryId: 'casseroles', name: 'طاجن موتزاريللا فراخ', isAvailable: true,
    variants: [{ name: 'سوبر', price: 50 }, { name: 'جامبو', price: 70 }]
  },
  {
    id: 't5', categoryId: 'casseroles', name: 'طاجن ميكس كشري لحوم', isAvailable: true,
    variants: [{ name: 'سوبر', price: 45 }, { name: 'جامبو', price: 55 }]
  },
  {
    id: 't6', categoryId: 'casseroles', name: 'طاجن ميكس كشري فراخ', isAvailable: true,
    variants: [{ name: 'سوبر', price: 50 }, { name: 'جامبو', price: 60 }]
  },
  {
    id: 't7', categoryId: 'casseroles', name: 'طاجن مشكل لحوم', isAvailable: true,
    variants: [{ name: 'عادي', price: 80 }, { name: 'ميكس', price: 100 }]
  },
  {
    id: 't8', categoryId: 'casseroles', name: 'طاجن سادة', isAvailable: true,
    variants: [
      { name: 'عادي', price: 25 }, { name: 'موتزاريللا صغير', price: 40 }, 
      { name: 'موتزاريللا كبير', price: 55 }, { name: 'ميكس صغير', price: 40 }, { name: 'ميكس كبير', price: 50 }
    ]
  },

  // 3. قسم المشويات
  {
    id: 'g1', categoryId: 'grill', name: 'فراخ مشوية (على الفحم)', isAvailable: true,
    description: 'تأتي مع أرز بسمتي وسلطة وطحينة وعيش ومخلل وويسكي حلال',
    variants: [
      { name: 'كاملة', price: 280 }, { name: 'نص', price: 140 }, 
      { name: 'ربع صدر', price: 80 }, { name: 'ربع ورك', price: 70 }
    ]
  },
  {
    id: 'g2', categoryId: 'grill', name: 'كفتة مشوية (على الفحم)', isAvailable: true,
    description: 'تأتي مع أرز بسمتي وسلطة وطحينة وعيش ومخلل وويسكي حلال',
    variants: [{ name: 'كيلو', price: 280 }, { name: 'نص', price: 140 }, { name: 'ربع', price: 70 }]
  },
  {
    id: 'g3', categoryId: 'grill', name: 'كبدة / سجق', isAvailable: true,
    variants: [{ name: 'كيلو', price: 240 }, { name: 'ورقة', price: 70 }]
  },
  {
    id: 'g4', categoryId: 'grill', name: 'أرز بسمتي', isAvailable: true,
    variants: [{ name: 'سادة صغير', price: 30 }, { name: 'سادة كبير', price: 50 }, { name: 'بالكبدة', price: 50 }]
  },

  // 4. صواني حمادة
  {
    id: 'tr1', categoryId: 'trays', name: 'صواني العزومات', isAvailable: true,
    description: 'تأتي مع أرز بسمتي وعيش وسلطة وطحينة ومخلل وويسكي حلال بعدد الأفراد',
    variants: [
      { name: 'المفترية', price: 300 }, { name: 'الحبايب', price: 400 }, 
      { name: 'حمادة', price: 550 }, { name: 'اللمة', price: 700 }
    ]
  },
  {
    id: 'tr2', categoryId: 'trays', name: 'صينية العروسة', isAvailable: true,
    description: 'تأتي مع أرز بسمتي وعيش وسلطة وطحينة ومخلل وويسكي حلال',
    variants: [{ name: 'حسب الطلب', price: 0 }]
  },

  // 5. وجبات فردية
  {
    id: 'm1', categoryId: 'meals', name: 'وجبات فراخ وكفتة', isAvailable: true,
    description: 'تأتي مع أرز وسلطة وطحينة وعيش ومخلل',
    variants: [
      { name: 'ربع فرخة', price: 80 }, { name: 'ربع كفتة', price: 80 },
      { name: 'ربع فرخة + كفتة', price: 90 }, { name: 'ربع صدر + كفتة', price: 100 },
      { name: 'حمادة الأكيل', price: 140 }
    ]
  },
  {
    id: 'm2', categoryId: 'meals', name: 'ميكس جريل', isAvailable: true,
    description: 'أرز وسلطة وتومية وعيش سوري',
    variants: [{ name: 'وجبة', price: 115 }]
  },
  {
    id: 'm3', categoryId: 'meals', name: 'شاورما عربي', isAvailable: true,
    description: 'بطاطس وتومية',
    variants: [{ name: 'وجبة', price: 80 }]
  },
  {
    id: 'm4', categoryId: 'meals', name: 'وجبة شاورما', isAvailable: true,
    description: 'أرز وسلطة وتومية وعيش سوري',
    variants: [{ name: 'وجبة', price: 100 }]
  },

  // 6. كريب وسوري
  {
    id: 'c1', categoryId: 'crepe_syrian', name: 'كريب', isAvailable: true,
    variants: [
      { name: 'شاورما صغير', price: 70 }, { name: 'شاورما كبير', price: 100 },
      { name: 'لحوم صغير', price: 60 }, { name: 'لحوم كبير', price: 90 },
      { name: 'بطاطس صغير', price: 35 }, { name: 'بطاطس كبير', price: 50 },
      { name: 'مشكل', price: 100 }
    ]
  },
  {
    id: 'c2', categoryId: 'crepe_syrian', name: 'سوري', isAvailable: true,
    variants: [
      { name: 'شاورما صغير', price: 60 }, { name: 'شاورما كبير', price: 90 },
      { name: 'لحوم صغير', price: 50 }, { name: 'لحوم كبير', price: 80 },
      { name: 'بطاطس صغير', price: 25 }, { name: 'بطاطس كبير', price: 40 },
      { name: 'مشكل', price: 90 }
    ]
  },
  {
    id: 'c3', categoryId: 'crepe_syrian', name: 'فتة شاورما', isAvailable: true,
    variants: [{ name: 'طبق', price: 90 }]
  },
  {
    id: 'c4', categoryId: 'crepe_syrian', name: 'طبق بطاطس', isAvailable: true,
    variants: [{ name: 'صغير', price: 25 }, { name: 'كبير', price: 50 }]
  },
  {
    id: 'c5', categoryId: 'crepe_syrian', name: 'سندوتشات', isAvailable: true,
    variants: [
      { name: 'كفتة/كبدة صغير', price: 20 }, { name: 'كفتة/كبدة وسط', price: 25 }, { name: 'كفتة/كبدة كبير', price: 30 }
    ]
  },
  {
    id: 'c6', categoryId: 'crepe_syrian', name: 'حواوشي', isAvailable: true,
    variants: [
      { name: 'عادي', price: 20 }, { name: 'وسط', price: 25 }, { name: 'مخصوص', price: 30 },
      { name: 'ملوكي', price: 50 }, { name: 'موتزاريللا صغير', price: 35 }, { name: 'موتزاريللا كبير', price: 50 }
    ]
  },

  // 7. الحلو والمشروبات
  {
    id: 'd1', categoryId: 'desserts', name: 'أرز بلبن', isAvailable: true,
    variants: [{ name: 'سادة', price: 15 }, { name: 'مكسرات', price: 23 }, { name: 'لوتس', price: 30 }]
  },
  {
    id: 'd2', categoryId: 'desserts', name: 'حلويات شرقية', isAvailable: true,
    variants: [
      { name: 'بسبوسة', price: 35 }, { name: 'كنافة صغير', price: 35 }, { name: 'كنافة كبير', price: 50 },
      { name: 'قشطوطة صغير', price: 35 }, { name: 'قشطوطة كبير', price: 50 }
    ]
  },
  {
    id: 'd3', categoryId: 'desserts', name: 'طواجن حلو', isAvailable: true,
    variants: [
      { name: 'نوتيلا صغير', price: 30 }, { name: 'نوتيلا كبير', price: 50 },
      { name: 'أم علي', price: 20 }, { name: 'مولتن', price: 55 }
    ]
  },
  {
    id: 'd4', categoryId: 'desserts', name: 'مشروبات', isAvailable: true,
    variants: [
      { name: 'كانز', price: 15 }, { name: 'مياه صغيرة', price: 5 }, { name: 'مياه كبيرة', price: 10 }
    ]
  }
];
