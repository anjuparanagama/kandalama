
import i18n from '@/lib/i18n';

export function getDistrictsByLanguage(lang?: string): string[] {
	// Use provided lang or current i18n language
	const lng = lang || (i18n.language || 'en');
	// Try to get from translation file
	const t = i18n.getResource(lng, 'districts', 'districts');
	if (Array.isArray(t) && t.length > 0) {
		return t;
	}
	// fallback to English
	const tEn = i18n.getResource('en', 'districts', 'districts');
	if (Array.isArray(tEn) && tEn.length > 0) {
		return tEn;
	}
	// fallback to hardcoded English list
	return [
		"Ampara",
		"Anuradhapura",
		"Badulla",
		"Batticaloa",
		"Colombo",
		"Galle",
		"Gampaha",
		"Hambantota",
		"Jaffna",
		"Kalutara",
		"Kandy",
		"Kegalle",
		"Kilinochchi",
		"Kurunegala",
		"Mannar",
		"Matale",
		"Matara",
		"Monaragala",
		"Mullaitivu",
		"Nuwara Eliya",
		"Polonnaruwa",
		"Puttalam",
		"Ratnapura",
		"Trincomalee",
		"Vavuniya"
	];
}
