const nameExtractor = {
  // Common name prefixes/titles
  titles: new Set(['mr', 'mrs', 'ms', 'dr', 'prof', 'sir', 'madam', 'miss']),
  
  // Common words that might appear around names
  nameIndicators: new Set([
    'name is', 'name\'s', 'called', 'im', 'i am', 'this is', 'i\'m',
    'known as', 'by', 'signed', 'regards', 'sincerely', 'from',
    'hi i\'m', 'hello i\'m', 'hi im', 'hello im', 'hi, i\'m', 'hello, i\'m'
  ]),

  // Location markers that might appear after names
  locationPrepositions: new Set([
    'from', 'in', 'at', 'of', 'living in', 'based in', 'residing in'
  ]),

  // Geographic and other exclusions
  exclusions: {
    countries: new Set([
      'afghanistan', 'albania', 'algeria', 'america', 'angola', 'argentina', 'australia', 'austria',
      'bangladesh', 'belgium', 'brazil', 'bulgaria', 'cambodia', 'canada', 'china', 'colombia',
      'denmark', 'egypt', 'england', 'ethiopia', 'france', 'germany', 'greece', 'hungary', 'india',
      'indonesia', 'iran', 'iraq', 'ireland', 'israel', 'italy', 'japan', 'jordan', 'korea',
      'kuwait', 'libya', 'malaysia', 'mexico', 'morocco', 'nepal', 'netherlands', 'nigeria',
      'norway', 'pakistan', 'peru', 'philippines', 'poland', 'portugal', 'romania', 'russia',
      'saudi', 'arabia', 'singapore', 'spain', 'sweden', 'switzerland', 'syria', 'taiwan',
      'thailand', 'turkey', 'ukraine', 'emirates', 'britain', 'america', 'uruguay', 'venezuela',
      'vietnam', 'wales', 'yemen','message','contact','living','based'
    ]),
    cities: new Set([
      'london', 'paris', 'tokyo', 'delhi', 'shanghai', 'moscow', 'beijing', 'sydney',
      'rome', 'athens', 'berlin', 'madrid', 'lisbon', 'vienna', 'prague', 'amsterdam'
    ]),
    other: new Set([
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
      'september', 'october', 'november', 'december',
      'the', 'and', 'or', 'hi', 'hello', 'dear', 'thanks', 'regard',
      'company', 'corporation', 'inc', 'ltd', 'limited','Contact'
    ])
  },

  // Check if a word is a location
  isLocation(word) {
    const wordLower = word.toLowerCase();
    return this.exclusions.countries.has(wordLower) ||
           this.exclusions.cities.has(wordLower);
  },

  // Check if a word is any kind of exclusion
  isExclusion(word) {
    const wordLower = word.toLowerCase();
    return this.exclusions.countries.has(wordLower) ||
           this.exclusions.cities.has(wordLower) ||
           this.exclusions.other.has(wordLower);
  },

  // Extract name from a phrase with location
  extractNameFromLocationPhrase(text) {
    // Remove common prefixes like "Hi, " or "Hello, "
    text = text.replace(/^(hi|hello),?\s+/i, '');
    
    // Look for patterns like "I'm [Name] from [Location]"
    const locationPatterns = Array.from(this.locationPrepositions)
      .map(prep => `(?:${prep}\\s+[A-Z][a-zA-Z]+)`).join('|');
    
    const namePattern = new RegExp(
      `(?:i(?:'m|m|\\s+am)\\s+)([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)?)\\s+(${locationPatterns})`,
      'i'
    );
    
    const match = text.match(namePattern);
    if (match && match[1]) {
      const potentialName = match[1];
      // Verify it's not a location itself
      if (!this.isLocation(potentialName)) {
        return potentialName;
      }
    }
    
    // Try title patterns (e.g., "Dr. Nina from Moscow")
    const titlePattern = new RegExp(
      `(?:${Array.from(this.titles).join('|')})\.?\\s+([A-Z][a-zA-Z]+)\\s+(?:${locationPatterns})`,
      'i'
    );
    
    const titleMatch = text.match(titlePattern);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1];
    }
    
    return null;
  },

  // Extract name using all available methods
  extractName(text) {
    // Standardize text
    text = text.replace(/\s+/g, ' ').trim();
    
    // Try location-based extraction first
    const nameFromLocation = this.extractNameFromLocationPhrase(text);
    if (nameFromLocation) return nameFromLocation;
    
    // Find all potential name candidates
    let candidates = [];
    
    // Method 1: Look for name indicators
    this.nameIndicators.forEach(indicator => {
      const pattern = new RegExp(`${indicator}\\s+([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)?)`, 'i');
      const match = text.match(pattern);
      if (match && match[1]) {
        candidates.push(match[1]);
      }
    });
    
    // Method 2: Look for titles
    this.titles.forEach(title => {
      const pattern = new RegExp(`${title}\\.?\\s+([A-Z][a-zA-Z]+(?:\\s+[A-Z][a-zA-Z]+)?)`, 'i');
      const match = text.match(pattern);
      if (match && match[1]) {
        candidates.push(match[1]);
      }
    });
    
    // Method 3: Look for capitalized words not followed by locations
    const capitalizedWords = text.match(/[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?/g) || [];
    capitalizedWords.forEach(word => {
      if (!this.isLocation(word)) {
        candidates.push(word);
      }
    });
    
    // Score and filter candidates
    candidates = [...new Set(candidates)]
      .filter(name => !this.isExclusion(name))
      .map(name => ({
        name,
        score: this.scoreName(name, text)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    return candidates.length > 0 ? candidates[0].name : null;
  },

  // Score a potential name
  scoreName(name, originalText) {
    let score = 0;
    const nameLower = name.toLowerCase();
    
    // Check if it's in exclusion list
    if (this.isExclusion(name)) return -1;
    
    // Basic name characteristics
    if (/^[A-Z][a-z]/.test(name)) score += 3;
    if (/^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(name)) score += 5;
    
    // Context scoring
    const textLower = originalText.toLowerCase();
    
    // Check for name indicators
    this.nameIndicators.forEach(indicator => {
      if (textLower.includes(`${indicator} ${nameLower}`)) {
        score += 5;
      }
    });
    
    // Check for titles
    this.titles.forEach(title => {
      if (textLower.includes(`${title} ${nameLower}`)) {
        score += 4;
      }
    });
    
    // Check for location patterns
    this.locationPrepositions.forEach(prep => {
      if (new RegExp(`${nameLower}\\s+${prep}\\s+[A-Z]`, 'i').test(originalText)) {
        score += 3;
      }
    });
    
    return score;
  }
};

// // Test cases
// const testCases = [
//   "Hi, I'm John from London",
//   "Hello, I'm Lina from Russia",
//   "Dr. Nina from Moscow",
//   "My name is Sarah from Paris",
//   "I am Alex living in Tokyo",
//   "This is Maria from Spain",
//   "Mr. James based in London",
//   "Professor Smith from Cambridge",
//   "Hi, I'm Dr. Lee from Seoul",
//   "Greetings, I'm Anna from Moscow",
//   "Hello from David in Paris",
//   "Message from London",  // Should not extract a name
//   "Hi from Russia",      // Should not extract a name
//   "Contact Mike in NYC",
//   "Based in Tokyo",      // Should not extract a name
// ];

// console.log("Test Results:");
// testCases.forEach(test => {
//   console.log(`\nInput: "${test}"`);
//   console.log(`Extracted Name: "${nameExtractor.extractName(test)}"`);
// });
