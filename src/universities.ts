import type { DistrictAbbreviation, ProvinceCode, University, UniversitySearchOptions, UniversityType } from './types';

type Row = [
  id: string,
  short_name: string,
  name: string,
  type: UniversityType,
  address: string,
  city: string,
  postal_code: string,
  district_code: DistrictAbbreviation
];

const PROVINCE_OF: Record<string, [string, string, ProvinceCode]> = {
  CO: ['Colombo', 'Western', 'WP'],
  GQ: ['Gampaha', 'Western', 'WP'],
  KY: ['Kandy', 'Central', 'CP'],
  JA: ['Jaffna', 'Northern', 'NP'],
  MH: ['Matara', 'Southern', 'SP'],
  BC: ['Batticaloa', 'Eastern', 'EP'],
  AR: ['Ampara', 'Eastern', 'EP'],
  AD: ['Anuradhapura', 'North Central', 'NCP'],
  RN: ['Ratnapura', 'Sabaragamuwa', 'SGP'],
  KG: ['Kurunegala', 'North Western', 'NWP'],
  BD: ['Badulla', 'Uva', 'UP'],
  VA: ['Vavuniya', 'Northern', 'NP'],
  KE: ['Kegalle', 'Sabaragamuwa', 'SGP'],
  HB: ['Hambantota', 'Southern', 'SP'],
};

const ROWS: Row[] = [
  ['university-of-colombo', 'UoC', 'University of Colombo', 'government', 'No. 94, Cumaratunga Munidasa Mawatha', 'Colombo 03', '00300', 'CO'],
  ['university-of-peradeniya', 'UoP', 'University of Peradeniya', 'government', 'Peradeniya', 'Peradeniya', '20400', 'KY'],
  ['university-of-sri-jayewardenepura', 'USJP', 'University of Sri Jayewardenepura', 'government', 'Gangodawila', 'Nugegoda', '10250', 'CO'],
  ['university-of-kelaniya', 'UoK', 'University of Kelaniya', 'government', 'Dalugama', 'Kelaniya', '11600', 'GQ'],
  ['university-of-moratuwa', 'UoM', 'University of Moratuwa', 'government', 'Katubedda', 'Moratuwa', '10400', 'CO'],
  ['university-of-jaffna', 'UoJ', 'University of Jaffna', 'government', 'Thirunelvely', 'Jaffna', '40000', 'JA'],
  ['university-of-ruhuna', 'UoR', 'University of Ruhuna', 'government', 'Wellamadama', 'Matara', '81000', 'MH'],
  ['eastern-university-sri-lanka', 'EUSL', 'Eastern University, Sri Lanka', 'government', 'Vantharumoolai', 'Chenkalady', '30350', 'BC'],
  ['south-eastern-university-of-sri-lanka', 'SEUSL', 'South Eastern University of Sri Lanka', 'government', 'University Park', 'Oluvil', '32360', 'AR'],
  ['rajarata-university-of-sri-lanka', 'RUSL', 'Rajarata University of Sri Lanka', 'government', 'Mihintale', 'Mihintale', '50300', 'AD'],
  ['sabaragamuwa-university-of-sri-lanka', 'SUSL', 'Sabaragamuwa University of Sri Lanka', 'government', 'Belihuloya', 'Belihuloya', '70140', 'RN'],
  ['wayamba-university-of-sri-lanka', 'WUSL', 'Wayamba University of Sri Lanka', 'government', 'Kuliyapitiya', 'Kuliyapitiya', '60200', 'KG'],
  ['uva-wellassa-university', 'UWU', 'Uva Wellassa University', 'government', 'Passara Road', 'Badulla', '90000', 'BD'],
  ['university-of-the-visual-and-performing-arts', 'UVPA', 'University of the Visual & Performing Arts', 'government', 'No. 21, Albert Crescent', 'Colombo 07', '00700', 'CO'],
  ['gampaha-wickramarachchi-university-of-indigenous-medicine', 'GWUIM', 'Gampaha Wickramarachchi University of Indigenous Medicine', 'government', 'Yakkala', 'Yakkala', '11870', 'GQ'],
  ['university-of-vavuniya', 'UoV', 'University of Vavuniya', 'government', 'Pambaimadu', 'Vavuniya', '43000', 'VA'],
  ['open-university-of-sri-lanka', 'OUSL', 'Open University of Sri Lanka', 'government', 'Nawala Road', 'Nugegoda', '10250', 'CO'],
  ['buddhist-and-pali-university-of-sri-lanka', 'BPU', 'Buddhist and Pali University of Sri Lanka', 'government', 'Pitipana', 'Homagama', '10200', 'CO'],
  ['ocean-university-of-sri-lanka', 'OUSL-OCEAN', 'Ocean University of Sri Lanka', 'government', 'Mahawela Road', 'Tangalle', '82200', 'HB'],
  ['general-sir-john-kotelawala-defence-university', 'KDU', 'General Sir John Kotelawala Defence University', 'government', 'Kandawala Estate, Werahera', 'Ratmalana', '10390', 'CO'],
  ['sliit', 'SLIIT', 'Sri Lanka Institute of Information Technology', 'private', 'New Kandy Road', 'Malabe', '10115', 'CO'],
  ['nsbm-green-university', 'NSBM', 'NSBM Green University', 'private', 'Mahenwatta, Pitipana', 'Homagama', '10200', 'CO'],
  ['cinec-campus', 'CINEC', 'CINEC Campus', 'private', 'Millennium Drive, IT Park', 'Malabe', '10115', 'CO'],
  ['horizon-campus', 'HORIZON', 'Horizon College of Business & Technology', 'private', 'Malabe-Kaduwela Road', 'Malabe', '10115', 'CO'],
  ['sltc-research-university', 'SLTC', 'SLTC Research University', 'private', 'Meepe', 'Padukka', '10500', 'CO'],
  ['buddhasravaka-bhiksu-university', 'BUSL', 'Buddhasravaka Bhiksu University', 'government', 'New Elkatuwa Road', 'Anuradhapura', '50000', 'AD'],
  ['university-of-vocational-technology', 'UNIVOTEC', 'University of Vocational Technology', 'government', 'Ratmalana', 'Ratmalana', '10390', 'CO'],
  ['institute-of-surveying-and-mapping', 'ISM', 'Institute of Surveying and Mapping', 'government', 'Diyatalawa', 'Diyatalawa', '90350', 'BD'],
  ['sri-lanka-institute-of-development-administration', 'SLIDA', 'Sri Lanka Institute of Development Administration', 'government', 'No. 28/10, Malalasekera Mawatha', 'Colombo 07', '00700', 'CO'],
  ['national-institute-of-social-development', 'NISD', 'National Institute of Social Development', 'government', 'Liyanagemulla', 'Seeduwa', '11410', 'GQ'],
  ['sri-lanka-institute-of-tourism-and-hotel-management', 'SLITHM', 'Sri Lanka Institute of Tourism and Hotel Management', 'government', 'No. 78, Galle Road', 'Colombo 03', '00300', 'CO'],
  ['sri-lanka-institute-of-textile-and-apparel', 'SLITA', 'Sri Lanka Institute of Textile and Apparel', 'government', 'Kandawala Estate, No. 2, General Sir John Kotelawala Road', 'Ratmalana', '10390', 'CO'],
  ['institute-of-chartered-accountants-of-sri-lanka', 'CA-SL', 'Institute of Chartered Accountants of Sri Lanka', 'private', 'No. 30A, Malalasekera Mawatha', 'Colombo 07', '00700', 'CO'],
  ['south-asian-institute-of-technology-and-medicine', 'SAITM', 'South Asian Institute of Technology and Medicine', 'private', 'Millennium Drive, off Chandrika Kumaratunga Mawatha', 'Malabe', '10115', 'CO'],
  ['sri-lanka-institute-of-nanotechnology', 'SLINTEC', 'Sri Lanka Institute of Nanotechnology', 'private', 'Nanotechnology & Science Park, Mahenwatta, Pitipana', 'Homagama', '10200', 'CO'],
  ['aquinas-college-of-higher-studies', 'AQUINAS', 'Aquinas College of Higher Studies', 'private', 'No. 30, Gnanartha Pradeepa Mawatha', 'Colombo 08', '00800', 'CO'],
  ['kiu', 'KIU', 'KAATSU International University', 'private', 'No. 249/1, Malabe Road, Thalangama North', 'Battaramulla', '10120', 'CO'],
  ['esoft-uni', 'ESOFT', 'ESOFT Uni', 'private', 'No. 3, De Fonseka Place', 'Colombo 04', '00400', 'CO'],
  ['sanasa-campus', 'SANASA', 'SANASA Campus', 'private', 'Paragammana, Hettimulla', 'Kegalle', '71210', 'KE'],
  ['saegis-campus', 'SAEGIS', 'Saegis Campus', 'private', 'No. 135, S. De S. Jayasinghe Mawatha, Kohuwala', 'Nugegoda', '10250', 'CO'],
  ['gateway-college', 'GATEWAY', 'Gateway College', 'private', 'No. 185, Koswatta Road, off Royal Gardens', 'Rajagiriya', '10100', 'CO'],
  ['british-school-of-commerce', 'BSC', 'British School of Commerce', 'private', 'No. 19, Mcleod Road', 'Colombo 04', '00400', 'CO'],
  ['informatics-institute-of-technology', 'IIT', 'Informatics Institute of Technology', 'private', 'No. 57, Ramakrishna Road', 'Colombo 06', '00600', 'CO'],
  ['apiit-lanka', 'APIIT', 'Asia Pacific Institute of Information Technology', 'private', 'No. 388, Union Place', 'Colombo 02', '00200', 'CO'],
  ['nagananda-international-institute-for-buddhist-studies', 'NIIBS', 'Nagananda International Institute for Buddhist Studies', 'private', 'Manelwatta, Bollegala', 'Kelaniya', '11600', 'GQ'],
  ['sri-lanka-international-buddhist-academy', 'SIBA', 'Sri Lanka International Buddhist Academy', 'private', 'Pallekele, Kundasale', 'Kundasale', '20168', 'KY'],
];

const NAMES: Record<string, [si: string, ta: string]> = {
  'university-of-colombo': ['කොළඹ විශ්වවිද්‍යාලය', 'கொழும்புப் பல்கலைக்கழகம்'],
  'university-of-peradeniya': ['පේරාදෙණිය විශ්වවිද්‍යාලය', 'பேராதனைப் பல்கலைக்கழகம்'],
  'university-of-sri-jayewardenepura': ['ශ්‍රී ජයවර්ධනපුර විශ්වවිද්‍යාලය', 'ஸ்ரீ ஜயவர்த்தனபுரப் பல்கலைக்கழகம்'],
  'university-of-kelaniya': ['කැලණිය විශ්වවිද්‍යාලය', 'களனிப் பல்கலைக்கழகம்'],
  'university-of-moratuwa': ['මොරටුව විශ්වවිද්‍යාලය', 'மொறட்டுவைப் பல்கலைக்கழகம்'],
  'university-of-jaffna': ['යාපනය විශ්වවිද්‍යාලය', 'யாழ்ப்பாணப் பல்கலைக்கழகம்'],
  'university-of-ruhuna': ['රුහුණ විශ්වවිද්‍යාලය', 'றுகுணுப் பல்கலைக்கழகம்'],
  'eastern-university-sri-lanka': ['නැගෙනහිර විශ්වවිද්‍යාලය, ශ්‍රී ලංකාව', 'கிழக்குப் பல்கலைக்கழகம், இலங்கை'],
  'south-eastern-university-of-sri-lanka': ['ශ්‍රී ලංකා ගිනිකොණ විශ්වවිද්‍යාලය', 'இலங்கை தென்கிழக்குப் பல்கலைக்கழகம்'],
  'rajarata-university-of-sri-lanka': ['ශ්‍රී ලංකා රජරට විශ්වවිද්‍යාලය', 'இலங்கை ரஜரட்டப் பல்கலைக்கழகம்'],
  'sabaragamuwa-university-of-sri-lanka': ['ශ්‍රී ලංකා සබරගමුව විශ්වවිද්‍යාලය', 'இலங்கை சப்ரகமுவப் பல்கலைக்கழகம்'],
  'wayamba-university-of-sri-lanka': ['ශ්‍රී ලංකා වයඹ විශ්වවිද්‍යාලය', 'இலங்கை வயம்பப் பல்கலைக்கழகம்'],
  'uva-wellassa-university': ['ඌව වෙල්ලස්ස විශ්වවිද්‍යාලය', 'ஊவா வெல்லஸ்ஸப் பல்கலைக்கழகம்'],
  'university-of-the-visual-and-performing-arts': ['දෘශ්‍ය හා රංගකලා විශ්වවිද්‍යාලය', 'காட்சி மற்றும் அரங்கேற்றக் கலைகள் பல்கலைக்கழகம்'],
  'gampaha-wickramarachchi-university-of-indigenous-medicine': ['ගම්පහ වික්‍රමාරච්චි ස්වදේශීය වෛද්‍ය විශ්වවිද්‍යාලය', 'கம்பஹா விக்கிரமாராச்சி சுதேச மருத்துவப் பல்கலைக்கழகம்'],
  'university-of-vavuniya': ['වවුනියා විශ්වවිද්‍යාලය', 'வவுனியாப் பல்கலைக்கழகம்'],
  'open-university-of-sri-lanka': ['ශ්‍රී ලංකා විවෘත විශ්වවිද්‍යාලය', 'இலங்கை திறந்த பல்கலைக்கழகம்'],
  'buddhist-and-pali-university-of-sri-lanka': ['ශ්‍රී ලංකා බෞද්ධ හා පාලි විශ්වවිද්‍යාලය', 'இலங்கை பௌத்த மற்றும் பாளிப் பல்கலைக்கழகம்'],
  'ocean-university-of-sri-lanka': ['ශ්‍රී ලංකා සාගර විශ්වවිද්‍යාලය', 'இலங்கை கடல்சார் பல்கலைக்கழகம்'],
  'general-sir-john-kotelawala-defence-university': ['ජෙනරල් ශ්‍රී ජෝන් කොතලාවල ආරක්ෂක විශ්වවිද්‍යාලය', 'ஜெனரல் சேர் ஜோன் கொத்தலாவல பாதுகாப்புப் பல்கலைக்கழகம்'],
  'sliit': ['ශ්‍රී ලංකා තොරතුරු තාක්ෂණ ආයතනය', 'இலங்கை தகவல் தொழில்நுட்ப நிறுவனம்'],
  'nsbm-green-university': ['NSBM හරිත විශ්වවිද්‍යාලය', 'NSBM பசுமைப் பல்கலைக்கழகம்'],
  'cinec-campus': ['සිනෙක් කැම්පස්', 'சினெக் வளாகம்'],
  'horizon-campus': ['හොරයිසන් වාණිජ හා තාක්ෂණ විද්‍යාලය', 'ஹொரைசன் வணிக மற்றும் தொழில்நுட்பக் கல்லூரி'],
  'sltc-research-university': ['SLTC පර්යේෂණ විශ්වවිද්‍යාලය', 'SLTC ஆராய்ச்சிப் பல்கலைக்கழகம்'],
  'buddhasravaka-bhiksu-university': ['බුද්ධ ශ්‍රාවක භික්ෂු විශ්වවිද්‍යාලය', 'புத்த சிராவக பிக்கு பல்கலைக்கழகம்'],
  'university-of-vocational-technology': ['වෘත්තීය තාක්ෂණ විශ්වවිද්‍යාලය', 'தொழில்சார் தொழில்நுட்பப் பல்கலைக்கழகம்'],
  'institute-of-surveying-and-mapping': ['මිනින්දෝරු හා සිතියම්කරණ ආයතනය', 'நில அளவை மற்றும் வரைபடவியல் நிறுவனம்'],
  'sri-lanka-institute-of-development-administration': ['ශ්‍රී ලංකා සංවර්ධන පරිපාලන ආයතනය', 'இலங்கை அபிவிருத்தி நிர்வாக நிறுவகம்'],
  'national-institute-of-social-development': ['ජාතික සමාජ සංවර්ධන ආයතනය', 'தேசிய சமூக அபிவிருத்தி நிறுவனம்'],
  'sri-lanka-institute-of-tourism-and-hotel-management': ['ශ්‍රී ලංකා සංචාරක හා හෝටල් කළමනාකරණ ආයතනය', 'இலங்கை சுற்றுலா மற்றும் விடுதி முகாமைத்துவ நிறுவனம்'],
  'sri-lanka-institute-of-textile-and-apparel': ['ශ්‍රී ලංකා රෙදිපිළි හා ඇඟලුම් ආයතනය', 'இலங்கை நெசவு மற்றும் ஆடைத் தொழில் நிறுவனம்'],
  'institute-of-chartered-accountants-of-sri-lanka': ['ශ්‍රී ලංකා වරලත් ගණකාධිකාරී ආයතනය', 'இலங்கை பட்டயக் கணக்காளர் நிறுவனம்'],
  'south-asian-institute-of-technology-and-medicine': ['දකුණු ආසියානු තාක්ෂණ හා වෛද්‍ය ආයතනය', 'தெற்காசிய தொழில்நுட்ப மற்றும் மருத்துவ நிறுவனம்'],
  'sri-lanka-institute-of-nanotechnology': ['ශ්‍රී ලංකා නැනෝ තාක්ෂණ ආයතනය', 'இலங்கை நானோ தொழில்நுட்ப நிறுவனம்'],
  'aquinas-college-of-higher-studies': ['ඇක්වයිනාස් උසස් අධ්‍යයන විද්‍යාලය', 'அக்குவைனாஸ் உயர் கல்விக் கல்லூரி'],
  'kiu': ['කාට්සු ජාත්‍යන්තර විශ්වවිද්‍යාලය', 'காட்சு சர்வதேசப் பல்கலைக்கழகம்'],
  'esoft-uni': ['ඊසොෆ්ට් යුනි', 'ஈசாஃப்ட் யுனி'],
  'sanasa-campus': ['සනස කැම්පස්', 'சணச வளாகம்'],
  'saegis-campus': ['සේජිස් කැම්පස්', 'சேஜிஸ் வளாகம்'],
  'gateway-college': ['ගේට්වේ විද්‍යාලය', 'கேட்வே கல்லூரி'],
  'british-school-of-commerce': ['බ්‍රිතාන්‍ය වාණිජ විද්‍යාලය', 'பிரித்தானிய வணிகக் கல்லூரி'],
  'informatics-institute-of-technology': ['ඉන්ෆොමැටික්ස් තාක්ෂණ ආයතනය', 'இன்ஃபர்மேட்டிக்ஸ் தொழில்நுட்ப நிறுவனம்'],
  'apiit-lanka': ['ආසියා පැසිෆික් තොරතුරු තාක්ෂණ ආයතනය', 'ஆசிய பசிபிக் தகவல் தொழில்நுட்ப நிறுவனம்'],
  'nagananda-international-institute-for-buddhist-studies': ['නාගානන්ද ජාත්‍යන්තර බෞද්ධ අධ්‍යයන ආයතනය', 'நாகானந்த சர்வதேச பௌத்த ஆய்வு நிறுவனம்'],
  'sri-lanka-international-buddhist-academy': ['ශ්‍රී ලංකා ජාත්‍යන්තර බෞද්ධ ඇකඩමිය', 'இலங்கை சர்வதேச பௌத்த அகாடமி'],
};

export const UNIVERSITIES: readonly University[] = Object.freeze(
  ROWS.map(([id, short_name, name, type, address, city, postal_code, district_code]) => {
    const [district, province, province_code] = PROVINCE_OF[district_code];
    const [name_si, name_ta] = NAMES[id];
    return Object.freeze({
      id,
      name,
      name_en: name,
      name_si,
      name_ta,
      short_name,
      type,
      address,
      city,
      postal_code,
      district,
      district_code,
      province,
      province_code
    });
  })
);

const ID_MAP = new Map<string, University>();
for (const u of UNIVERSITIES) {
  ID_MAP.set(u.id, u);
  ID_MAP.set(u.name.toLowerCase(), u);
  ID_MAP.set(u.name_si, u);
  ID_MAP.set(u.name_ta, u);
  ID_MAP.set(u.short_name.toLowerCase(), u);
}

function matches(value: string, filter: string): boolean {
  return value.toLowerCase() === filter.trim().toLowerCase();
}

/**
 * Returns all universities, optionally filtered by type ('government' | 'private').
 */
export function getUniversities(type?: UniversityType): readonly University[] {
  return type ? UNIVERSITIES.filter((u) => u.type === type) : UNIVERSITIES;
}

/**
 * Finds a university by id, full name (English, Sinhala or Tamil), or short name (case-insensitive).
 *
 * @example
 * getUniversity('UoC') // => University of Colombo
 */
export function getUniversity(idOrName: string): University | undefined {
  if (!idOrName) return undefined;
  return ID_MAP.get(idOrName.trim().toLowerCase());
}

/**
 * Returns universities located in a district (name or abbreviation, e.g. 'Colombo' or 'CO').
 */
export function getUniversitiesByDistrict(district: string): University[] {
  if (!district) return [];
  return UNIVERSITIES.filter((u) => matches(u.district, district) || matches(u.district_code, district));
}

/**
 * Returns universities located in a province (name or code, e.g. 'Western' or 'WP').
 */
export function getUniversitiesByProvince(province: string): University[] {
  if (!province) return [];
  return UNIVERSITIES.filter((u) => matches(u.province, province) || matches(u.province_code, province));
}

/**
 * Searches universities by name (English, Sinhala or Tamil), short name, city, or address.
 */
export function searchUniversities(query: string, options?: UniversitySearchOptions): University[] {
  const q = (query || '').trim().toLowerCase();
  let result = UNIVERSITIES.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.name_si.includes(q) ||
      u.name_ta.includes(q) ||
      u.short_name.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q) ||
      u.address.toLowerCase().includes(q)
  );
  if (options?.type) result = result.filter((u) => u.type === options.type);
  if (options?.district) result = result.filter((u) => matches(u.district, options.district!) || matches(u.district_code, options.district!));
  if (options?.province) result = result.filter((u) => matches(u.province, options.province!) || matches(u.province_code, options.province!));
  return options?.limit ? result.slice(0, options.limit) : result;
}
