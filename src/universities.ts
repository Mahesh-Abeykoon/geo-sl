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

export const UNIVERSITIES: readonly University[] = Object.freeze(
  ROWS.map(([id, short_name, name, type, address, city, postal_code, district_code]) => {
    const [district, province, province_code] = PROVINCE_OF[district_code];
    return Object.freeze({
      id,
      name,
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
 * Finds a university by id, full name, or short name (case-insensitive).
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
 * Searches universities by name, short name, city, or address.
 */
export function searchUniversities(query: string, options?: UniversitySearchOptions): University[] {
  const q = (query || '').trim().toLowerCase();
  let result = UNIVERSITIES.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.short_name.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q) ||
      u.address.toLowerCase().includes(q)
  );
  if (options?.type) result = result.filter((u) => u.type === options.type);
  if (options?.district) result = result.filter((u) => matches(u.district, options.district!) || matches(u.district_code, options.district!));
  if (options?.province) result = result.filter((u) => matches(u.province, options.province!) || matches(u.province_code, options.province!));
  return options?.limit ? result.slice(0, options.limit) : result;
}
