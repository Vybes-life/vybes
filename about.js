
  const paragraph = document.getElementById('animated-paragraph');
  const text = "Vybes creates personalized, exclusive style reports tailored just for you. Every detail is crafted to elevate your appearance and make you stand out. From head to toe, Vybes transforms your look with precision and style.";
  const words = text.split(' ');

  const custom_width= document.body.clientWidth;
  const design_width= 1440;
  let ratio= custom_width/design_width;
  
  const specialWords = {
    'Vybes': { 
      glowStyle: `font-size: ${26*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`,
      index: 0 
    },
    'personalized,': { 
      glowStyle: `font-size: ${26*ratio}px;color: purple; margin-right: ${8*ratio}px`, 
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`,
      index: 2 
    },
    'exclusive': { 
      glowStyle: `font-size: ${26*ratio}px;color: purple; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 3 
    },
    'style': { 
      glowStyle: `font-size: ${26*ratio}px;color: blue; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 4 
    },
    'reports': { 
      glowStyle: `font-size: ${26*ratio}px;color: blue; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 5 
    },
    'you.': { 
      glowStyle: `font-size: ${26*ratio}px; margin-right: ${8*ratio}px; color: black`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 8,
      transformText: 'you 🫵'
    },
    'your': { 
      glowStyle: `font-size: ${26*ratio}px;color: yellow; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 15 
    },
    'appearance': { 
      glowStyle: `font-size: ${26*ratio}px;color: yellow; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 16 
    },
    'and': { 
      glowStyle: `font-size: ${26*ratio}px;color: yellow; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 17 
    },
    'make': { 
      glowStyle: `font-size: ${26*ratio}px;color: gold; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: gold;`, 
      permanent: true, 
      index: 18 
    },
    'you': { 
      glowStyle: `font-size: ${26*ratio}px;color: gold; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: gold;`, 
      permanent: true, 
      index: 19 
    },
    'stand': { 
      glowStyle: `font-size: ${26*ratio}px;color: gold; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: gold;`, 
      permanent: true, 
      index: 20 
    },
    'out.': { 
      glowStyle: `font-size: ${26*ratio}px;color: gold; margin-right: ${8*ratio}px`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: gold;`, 
      permanent: true,
      index: 21 
    },
    'from': { 
      glowStyle: `font-size: ${26*ratio}px;margin-right: ${8*ratio}px; color: black;`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 22
    },
    'head': { 
      glowStyle: `font-size: ${26*ratio}px;margin-right: ${8*ratio}px; color: black;`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      transformText: 'head 👦',
      index: 23
    },
    'to': { 
      glowStyle: `font-size: ${26*ratio}px;margin-right: ${8*ratio}px; color: black;`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 24
    },
    'toe,': { 
      glowStyle: `font-size: ${26*ratio}px;margin-right: ${8*ratio}px; color: black;`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      transformText: 'toe 🥾',
      index: 25
    },
    'transforms': { 
      glowStyle: `font-size: ${26*ratio}px;color: green; margin-right: ${8*ratio}px;`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 26 
    },
    'precision': { 
      glowStyle: `font-size: ${26*ratio}px;margin-right: ${8*ratio}px; color: black;`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`, 
      index: 29 
    },
    'style.': { 
      glowStyle: `font-size: ${26*ratio}px;margin-right: ${8*ratio}px; color: black;`,
      shrinkStyle: `font-size: ${22*ratio}px; margin-right: ${8*ratio}px; color: black;`,
      transformText: `style 😉`,
      index: 31
    }
  };

  let html = '';
  let wordIndex = 0;
  
  words.forEach((word, i) => {
    const special = specialWords[word];
    if (special) {
      html += `<span id="word-${wordIndex}" 
                    data-glow-style="${special.glowStyle || ''}"
                    data-shrink-style="${special.shrinkStyle || ''}" 
                    data-permanent="${special.permanent || false}"
                    data-special="true"
                    data-transform-text="${special.transformText || ''}">${word}</span>`;
    } else {
      html += `<span id="word-${wordIndex}">${word}</span>`;
    }
    wordIndex++;
  });
  
  paragraph.innerHTML = html;

  const spans = paragraph.getElementsByTagName('span');
  
  const animateWord = (span, index) => {
    const isSpecial = span.getAttribute('data-special') === 'true';
    const glowStyle = span.getAttribute('data-glow-style');
    const shrinkStyle = span.getAttribute('data-shrink-style');
    const transformText = span.getAttribute('data-transform-text');
    
    setTimeout(() => {
      // Glow up
      if (isSpecial) {
        span.setAttribute('style', glowStyle);
        if (transformText) {
          const [text, emoji] = transformText.split(' ');
          span.innerHTML = `${text} <span style="font-style: normal;">${emoji}</span>`;
        }
      } else {
        span.style.fontSize = `${26*ratio}px`;
        span.style.color = 'black';
      }
      
      // Shrink after 300ms
      setTimeout(() => {
        if (isSpecial) {
          span.setAttribute('style', shrinkStyle);
        } else {
          span.style.fontSize = `${22*ratio}px`;
          span.style.color = 'black';
          span.style.marginRight = `${8*ratio}px`;
        }
      }, 300);
      
    }, index * 1000);
  };

  Array.from(spans).forEach((span, index) => {
    animateWord(span, index);
  });
