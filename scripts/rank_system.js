// UPDATED RANK SYSTEM (100k+)

const RANKS = [
  { id:1, min:0, max:100 },
  { id:2, min:100, max:300 },
  { id:3, min:300, max:700 },
  { id:4, min:700, max:1500 },
  { id:5, min:1500, max:3000 },

  { id:6, min:3000, max:6000 },
  { id:7, min:6000, max:10000 },
  { id:8, min:10000, max:18000 },
  { id:9, min:18000, max:30000 },
  { id:10, min:30000, max:45000 },

  { id:11, min:45000, max:60000 },
  { id:12, min:60000, max:75000 },
  { id:13, min:75000, max:90000 },
  { id:14, min:90000, max:100000 },
  { id:15, min:100000, max:Infinity }
];

function getRank(xp){
  return RANKS.find(r => xp >= r.min && xp < r.max);
}

function getProgress(xp){
  const rank = getRank(xp);
  if(!rank || rank.max === Infinity) return 1;

  const range = rank.max - rank.min;
  const current = xp - rank.min;

  return current / range;
}

function formatXP(xp){
  if (xp >= 1000) return (xp/1000).toFixed(1)+'k';
  return xp;
}

// example usage
function updateUI(xp){
  const rank = getRank(xp);
  const progress = getProgress(xp);

  console.log("Rank:", rank.id);
  console.log("Progress:", (progress*100).toFixed(1)+"%");
}
