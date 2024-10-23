function updateColors(input) {
  // Comprehensive list of positive and negative keywords
  const positiveWords = [
    'like', 'love', 'prefer', 'want', 'favorite', 'amazing', 'great',
    'good', 'nice', 'beautiful', 'wonderful', 'fantastic', 'awesome',
    'perfect', 'excellent', 'enjoy', 'adore', 'appreciate', 'fond of',
    'into', 'pleased with', 'attracted to', 'drawn to', 'cherish',
    'admire', 'fancy', 'dig', 'lovely', 'cool', 'sweet', 'best',
    'superb', 'outstanding', 'magnificent', 'ideal', 'superior'
  ];

  const negativeWords = [
    'dont like', "don't like", 'didnt like', "didn't like",
    'do not like', 'did not like', 'hate', 'dislike',
    'dont love', "don't love", 'didnt love', "didn't love",
    'do not love', 'did not love',
    'terrible', 'awful', 'horrible', 'disgusting', 'ugly',
    'bad', 'worse', 'worst', 'poor', 'inferior', 'unpleasant',
    'disagreeable', 'offensive', 'repulsive', 'distasteful',
    'unattractive', 'repellent', 'revolting', 'gross', 'yuck',
    'nah', 'meh', 'unsuitable', 'inappropriate', 'unfavorable',
    'cannot stand', "can't stand", 'despise', 'detest', 'loathe',
    'abhor', 'never', 'reject', 'refuse', 'avoid'
  ];

  // Updated color map with more vibrant colors
  const colorMap = {
    // Reds
    red: '#FF0000',
    crimson: '#DC143C',
    maroon: '#800000',
    burgundy: '#800020',
    scarlet: '#FF2400',
    ruby: '#E0115F',
    cardinal: '#C41E3A',

    // Pinks
    pink: '#FF69B4',  // More vibrant pink
    hotpink: '#FF1493',
    deeppink: '#FF1493',
    rose: '#FF007F',
    magenta: '#FF00FF',
    fuchsia: '#FF00FF',
    salmon: '#FF4D4D',  // More vibrant salmon

    // Oranges
    orange: '#FF7F00',  // More vibrant orange
    coral: '#FF4D4D',
    peach: '#FFB366',  // More vibrant peach
    tangerine: '#FF8C00',
    amber: '#FFBF00',

    // Yellows
    yellow: '#FFD700',  // More vibrant yellow
    gold: '#FFD700',
    goldenrod: '#DAA520',
    khaki: '#BDB76B',  // Darker khaki
      // Slightly more saturated cream
    lemon: '#FFF700',

    // Greens
    green: '#00AA00',  // More vibrant green
    lime: '#32CD32',   // More balanced lime
    olive: '#808000',
    forest: '#228B22',
    emerald: '#50C878',
    sage: '#9CAF88',   // More saturated sage
    seafoam: '#98FF98',
    mint: '#00FF7F',   // More vibrant mint
    teal: '#008B8B',
    jade: '#00A86B',

    // Blues
    blue: '#0000FF',
    navy: '#000080',
    royal: '#4169E1',
    skyblue: '#00BFFF',  // Deeper sky blue
    turquoise: '#00CED1',
    azure: '#007FFF',
    cerulean: '#007BA7',
    cobalt: '#0047AB',
    indigo: '#4B0082',

    // Purples
    purple: '#800080',
    violet: '#8A2BE2',  // More vibrant violet
    plum: '#8B008B',   // Darker plum
    lavender: '#9370DB',  // More vibrant lavender
    mauve: '#BA55D3',  // More vibrant mauve
    lilac: '#9932CC',  // More vibrant lilac
    amethyst: '#9966CC',

    // Browns
    brown: '#8B4513',
    chocolate: '#D2691E',
    coffee: '#6F4E37',
    tan: '#D2B48C',
    beige: '#F5F5DC',
    taupe: '#483C32',
    sienna: '#A0522D',

    // Neutrals
    black: '#000000',
    gray: '#808080',
    silver: '#C0C0C0',
    charcoal: '#36454F',
    ivory: '#FFFFF0',
    offwhite: '#FAF9F6',

    // Metallics
    bronze: '#CD7F32',
    copper: '#B87333',
    platinum: '#E5E4E2',

    // Modern Color Names
    millennial: '#98B2D1',
    rose_gold: '#B76E79',
    champagne: '#F7E7CE',
    blush: '#DE5D83',
    slate: '#708090',
    graphite: '#383838',
    pewter: '#899499'
  };

  const inputLower = input.toLowerCase().trim();
  let foundColor = null;
  const words = inputLower.split(/[,\s]+/);
  const isOnlyColors = words.every(word => Object.keys(colorMap).includes(word));
  
  if (isOnlyColors && words.length > 0) {
    // Use the first color in the list
    foundColor = colorMap[words[0]];
  }
  // Check if input is just a single color name
  else{
    if (Object.keys(colorMap).includes(inputLower)) {
    foundColor = colorMap[inputLower];
  } else {
    // Check for negative words first
    let isNegative = false;
    let isPositive = false;

    negativeWords.forEach(word => {
      if (inputLower.includes(word)) {
        // Make sure the negative word is complete (not part of another word)
        const wordIndex = inputLower.indexOf(word);
        const beforeChar = wordIndex > 0 ? inputLower[wordIndex - 1] : ' ';
        const afterChar = wordIndex + word.length < inputLower.length ? 
                         inputLower[wordIndex + word.length] : ' ';
        
        if (beforeChar === ' ' && (afterChar === ' ' || afterChar === '.' || afterChar === '!' || afterChar === '?')) {
          isNegative = true;
        }
      }
    });

    positiveWords.forEach(word => {
      if (inputLower.includes(word)) {
        isPositive = true;
      }
    });

    // Only proceed if there's either no negative sentiment or there's also a positive sentiment
    if (!isNegative || isPositive) {
      Object.keys(colorMap).forEach(color => {
        if (inputLower.includes(color)) {
          const colorIndex = inputLower.indexOf(color);
          
          // Find the closest sentiment to this color mention
          let closestPositive = Number.MAX_VALUE;
          let closestNegative = Number.MAX_VALUE;
          
          positiveWords.forEach(word => {
            const wordIndex = inputLower.indexOf(word);
            if (wordIndex !== -1) {
              closestPositive = Math.min(closestPositive, Math.abs(colorIndex - wordIndex));
            }
          });
          
          negativeWords.forEach(word => {
            const wordIndex = inputLower.indexOf(word);
            if (wordIndex !== -1) {
              closestNegative = Math.min(closestNegative, Math.abs(colorIndex - wordIndex));
            }
          });
          
          // If positive sentiment is closer to this color than negative
          if (closestPositive < closestNegative) {
            foundColor = colorMap[color];
          }
        }
      });
    }
  }
}

  if (foundColor) {
    const r = parseInt(foundColor.slice(1, 3), 16);
    const g = parseInt(foundColor.slice(3, 5), 16);
    const b = parseInt(foundColor.slice(5, 7), 16);
    
    const lightR = Math.round(r + (255 - r) * 0.85);
    const lightG = Math.round(g + (255 - g) * 0.85);
    const lightB = Math.round(b + (255 - b) * 0.85);
    
    const lightColor = `#${lightR.toString(16).padStart(2, '0')}${lightG.toString(16).padStart(2, '0')}${lightB.toString(16).padStart(2, '0')}`;

    document.documentElement.style.setProperty('--primary', foundColor);
    document.documentElement.style.setProperty('--primary-light', lightColor);
  }
}
