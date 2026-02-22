// Main cities in each district of Sri Lanka

export const citiesByDistrict: Record<string, string[]> = {
  Ampara: ["Ampara", "Kalmunai", "Samanturai", "Akkaraipattu"],
  Anuradhapura: [
    "Anuradhapura",
    "Kekirawa",
    "Medawachchiya",
    "Nuwaragam Palatha East",
  ],
  Badulla: ["Badulla", "Bandarawela", "Haputale", "Welimada"],
  Batticaloa: ["Batticaloa", "Eravur", "Valaichchenai", "Arayampathy"],
  Colombo: [
    "Colombo",
    "Kolonnawa",
    "Hanwella",
    "Kaduwela",
    "Thimbirigasyaya",
    "Sri Jayawardanapura Kotte",
    "Maharagama",
    "Dehiwala-Mount Lavinia",
    "Padukka",
    "Homagama",
    "Kesbewa",
    "Moratuwa",
  ],
  Galle: ["Galle", "Hikkaduwa", "Unawatuna", "Mirissa"],
  Gampaha: ["Gampaha", "Negombo", "Seeduwa", "Wattala"],
  Hambantota: ["Hambantota", "Tangalle", "Matara (nearby)", "Mirissa"],
  Jaffna: ["Jaffna", "Nallur", "Point Pedro", "Mullaitivu (nearby)"],
  Kalutara: ["Kalutara", "Beruwala", "Panadura", "Wadduwa"],
  Kandy: ["Kandy", "Peradeniya", "Gampola", "Nawalapitiya"],
  Kegalle: ["Kegalle", "Dehiowita", "Rambukkana", "Warakapola"],
  Kilinochchi: ["Kilinochchi", "Kandavil", "Pongalawella", "Pallai"],
  Kurunegala: ["Kurunegala", "Kuliyapitiya", "Wariyapola", "Polgahawela"],
  Mannar: ["Mannar", "Madhu", "Medawachchiya", "Nanattan"],
  Matale: ["Matale", "Dambulla", "Sigiriya", "Nalanda"],
  Matara: ["Matara", "Weligama", "Mirissa", "Dikwella"],
  Monaragala: ["Monaragala", "Wellawaya", "Buttala", "Madulsima"],
  Mullaitivu: [
    "Mullaitivu",
    "Kalmunai (nearby)",
    "Akkaraipattu",
    "Batticaloa (nearby)",
  ],
  "Nuwara Eliya": ["Nuwara Eliya", "Kandy (nearby)", "Peradeniya", "Ambewela"],
  Polonnaruwa: ["Polonnaruwa", "Medirigiriya", "Habarana", "Minneriya"],
  Puttalam: ["Puttalam", "Chilaw", "Madampe", "Alankuda"],
  Ratnapura: ["Ratnapura", "Embilipitiya", "Kalawana", "Eheliyagoda"],
  Trincomalee: ["Trincomalee", "Kinniya", "Nilaveli", "Uppuveli"],
  Vavuniya: ["Vavuniya", "Anuradhapura (nearby)", "Madawachchiya", "Nedunkeni"],
};

export function getCitiesByDistrict(district: string): string[] {
  if (!district || district === "all") return [];
  return citiesByDistrict[district] || [];
}
