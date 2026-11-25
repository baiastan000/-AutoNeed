// ── category helpers ──
export const categories = ["all","brakes","electrical","consumables","suspension","engine"];
export const categoryKey = { all:0,brakes:1,electrical:2,consumables:3,suspension:4,engine:5 };
export const photo = (id,w=900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const initialProducts = [
  { id:"p8",name:{ru:"Тормозной диск Brembo",kg:"Brembo тормоздук диски",en:"Brembo Brake Disc"},sku:"BR-2246",category:"brakes",price:5340,rating:4.9,baseReviews:124,image:photo("photo-1619642751034-765dfdf7c58e"),description:{ru:"Равномерное рассеивание тепла и стабильная эффективность торможения.",kg:"Жылуулукту бирдей бөлүштүрүп, туруктуу тормоздоону камсыздайт.",en:"Even heat distribution and consistent braking."},compatibility:"Toyota Corolla, Camry",inStock:true },
  { id:"p4",name:{ru:"Свечи зажигания NGK Laser",kg:"NGK Laser от алдыруу шамдары",en:"NGK Laser Iridium Spark Plugs"},sku:"EL-7710",category:"electrical",price:2150,rating:5,baseReviews:98,image:photo("photo-1600661653561-629509216228"),description:{ru:"Иридиевые свечи обеспечивают стабильное зажигание.",kg:"Иридий шамдары туруктуу от алдырууну камсыздайт.",en:"Iridium plugs deliver consistent ignition."},compatibility:"Hyundai Solaris, Kia Rio",inStock:true },
  { id:"p1",name:{ru:"Масляный фильтр Bosch Premium",kg:"Bosch Premium май чыпкасы",en:"Bosch Premium Oil Filter"},sku:"OF-2048",category:"consumables",price:890,rating:4.8,baseReviews:76,image:photo("photo-1486262715619-67b85e0b08d3"),description:{ru:"Очищает моторное масло и продлевает ресурс двигателя.",kg:"Мотор майын тазалап, кыймылдаткычтын мөөнөтүн узартат.",en:"Keeps engine oil clean and helps extend engine life."},compatibility:"Toyota Camry, Corolla, RAV4",inStock:true },
  { id:"p3",name:{ru:"Амортизатор передний KYB",kg:"KYB алдыңкы амортизатору",en:"KYB Front Shock Absorber"},sku:"SU-3041",category:"suspension",price:6890,rating:4.9,baseReviews:112,image:photo("photo-1618843479313-40f8afb4b4d8"),description:{ru:"Газомасляный амортизатор обеспечивает устойчивость.",kg:"Газ-май амортизатору жолдо туруктуулукту камсыздайт.",en:"Gas-oil shock absorber provides stability."},compatibility:"Toyota Camry 2012–2017",inStock:true },
  { id:"p2",name:{ru:"Тормозные колодки Akebono",kg:"Akebono тормоздук колодкалары",en:"Akebono Brake Pads"},sku:"BR-1182",category:"brakes",price:4250,rating:4.8,baseReviews:67,image:photo("photo-1486262715619-67b85e0b08d3"),description:{ru:"Тихое и уверенное торможение.",kg:"Ар кандай шартта ишенимдүү тормоздоо.",en:"Quiet, confident braking."},compatibility:"Honda Accord, CR-V, Civic",inStock:true },
  { id:"p9",name:{ru:"Аккумулятор Varta Blue",kg:"Varta Blue аккумулятору",en:"Varta Blue Battery"},sku:"EL-8821",category:"electrical",price:9200,rating:4.9,baseReviews:143,image:photo("photo-1619642751034-765dfdf7c58e"),description:{ru:"Надёжный запуск двигателя в любую погоду.",kg:"Ар кандай аба ырайында ишенимдүү от алдыруу.",en:"Reliable starts in every season."},compatibility:"Большинство легковых автомобилей",inStock:true },
  { id:"p5",name:{ru:"Воздушный фильтр Mann-Filter",kg:"Mann-Filter аба чыпкасы",en:"Mann-Filter Air Filter"},sku:"OF-3529",category:"consumables",price:1350,rating:4.7,baseReviews:54,image:photo("photo-1600661653561-629509216228"),description:{ru:"Высокая фильтрация защищает двигатель от пыли.",kg:"Жогорку тазалоо деңгээли кыймылдаткычты коргойт.",en:"High-efficiency filtration protects your engine."},compatibility:"Volkswagen Polo, Golf",inStock:true },
  { id:"p6",name:{ru:"Комплект ремня ГРМ Gates",kg:"Gates ГРМ курунун топтому",en:"Gates Timing Belt Kit"},sku:"EN-4107",category:"engine",price:7980,rating:4.9,baseReviews:83,image:photo("photo-1486262715619-67b85e0b08d3"),description:{ru:"Комплект для точной синхронизации двигателя.",kg:"Кыймылдаткычты так синхрондоштуруучу топтом.",en:"A dependable kit for precise engine timing."},compatibility:"Hyundai Tucson, Elantra",inStock:true },
];

export function read(key,fb){try{const s=localStorage.getItem(`autoneed-${key}`);return s?JSON.parse(s):fb;}catch{return fb;}}
export function save(key,val){try{localStorage.setItem(`autoneed-${key}`,JSON.stringify(val));}catch{}}

export function loadAdminProducts(){
  try{
    const saved=JSON.parse(localStorage.getItem("autoneed-admin-products")||"[]");
    if(!Array.isArray(saved))return[];
    return saved.map(p=>({
      id:p.id,name:{ru:p.name,kg:p.name,en:p.name},sku:p.sku||"",
      category:p.category||"consumables",price:Number(p.price)||0,
      rating:0,baseReviews:0,image:p.image||photo("photo-1486262715619-67b85e0b08d3"),
      description:{ru:p.description||"",kg:p.description||"",en:p.description||""},
      compatibility:p.compatibility||"—",inStock:true,
    }));
  }catch{return[];}
}
