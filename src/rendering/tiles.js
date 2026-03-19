// Realistic terrain and natural objects

var WORLD_W = 4800;
var WORLD_H = 3600;

var ZONES = [
  // Main grass — stays within the playable world
  { type: "grass", points: [[200,200],[4200,200],[4200,2600],[200,2600]], color: "#4A6B38", color2: "#3E5E30" },
  // North beach and ocean
  { type: "sand", points: [[-2000,-200],[8000,-200],[8000,250],[-2000,250]], color: "#B8A47A", color2: "#A89468" },
  { type: "water", swimmable: true, points: [[-2000,-8000],[8000,-8000],[8000,-100],[-2000,-100]], color: "#2A5A78", color2: "#1E4E6A" },
  // West beach and ocean
  { type: "sand", points: [[-200,-2000],[250,-2000],[250,8000],[-200,8000]], color: "#B8A47A", color2: "#A89468" },
  { type: "water", swimmable: true, points: [[-8000,-8000],[-100,-8000],[-100,8000],[-8000,8000]], color: "#2A5A78", color2: "#1E4E6A" },
  // South beach and ocean
  { type: "sand", points: [[-2000,2550],[8000,2550],[8000,3100],[-2000,3100]], color: "#B8A47A", color2: "#A89468" },
  { type: "water", swimmable: true, points: [[-2000,2900],[8000,2900],[8000,8000],[-2000,8000]], color: "#2A5A78", color2: "#1E4E6A" },
  // East beach and ocean
  { type: "sand", points: [[4100,1600],[4800,1600],[4800,3100],[4100,2600]], color: "#B8A47A", color2: "#A89468" },
  { type: "water", swimmable: true, points: [[4400,-8000],[8000,-8000],[8000,8000],[4400,3100]], color: "#2A5A78", color2: "#1E4E6A" },
  // Original clearings
  { type: "clearing", points: [[400,400],[800,380],[820,750],[380,770]], color: "#527A42", color2: "#486E3A" },
  { type: "clearing", points: [[1400,200],[1750,210],[1740,500],[1380,490]], color: "#527A42", color2: "#486E3A" },
  // New clearings in expanded area
  { type: "clearing", points: [[2800,600],[3250,580],[3280,950],[2780,970]], color: "#527A42", color2: "#486E3A" },
  { type: "clearing", points: [[3500,1400],[3900,1380],[3920,1700],[3480,1720]], color: "#527A42", color2: "#486E3A" },
  { type: "clearing", points: [[1800,1800],[2200,1780],[2220,2100],[1780,2120]], color: "#527A42", color2: "#486E3A" },
  { type: "clearing", points: [[600,2000],[950,1980],[970,2300],[580,2320]], color: "#527A42", color2: "#486E3A" },
  // Original pond (shallow - walkable!)
  { type: "water", shallow: true, points: [[900,700],[1100,680],[1120,900],[880,910]], color: "#2E6A88", color2: "#265A78" },
  // New ponds/lakes (shallow - walkable!)
  { type: "water", shallow: true, points: [[2500,1200],[2750,1180],[2770,1420],[2480,1440]], color: "#2E6A88", color2: "#265A78" },
  { type: "water", shallow: true, points: [[3200,400],[3450,380],[3470,550],[3180,570]], color: "#2E6A88", color2: "#265A78" },
  { type: "water", shallow: true, points: [[1400,2200],[1700,2180],[1720,2450],[1380,2470]], color: "#2E6A88", color2: "#265A78" },
  // Original paths
  { type: "path", points: [[0,575],[2400,555],[2400,620],[0,640]], color: "#7A6848", color2: "#6E5E40" },
  { type: "path", points: [[585,0],[645,0],[625,2600],[565,2600]], color: "#7A6848", color2: "#6E5E40" },
  { type: "path", points: [[620,555],[2400,535],[2400,600],[620,620]], color: "#7A6848", color2: "#6E5E40" },
  // Extended paths into new area
  { type: "path", points: [[2400,555],[4000,535],[4000,620],[2400,640]], color: "#7A6848", color2: "#6E5E40" },
  { type: "path", points: [[2400,555],[2460,555],[2440,2600],[2380,2600]], color: "#7A6848", color2: "#6E5E40" },
  // Cross path in new area
  { type: "path", points: [[1200,1400],[3800,1380],[3800,1445],[1200,1465]], color: "#7A6848", color2: "#6E5E40" },
  // Dense forest zone (darker grass)
  { type: "grass", points: [[3000,1800],[4000,1800],[4000,2500],[3000,2500]], color: "#3A5A2A", color2: "#2E4E22" },

  // === ISLAND ARCHIPELAGO ===

  // Island 1: Tropical Beach (5800, 1600) 600x600
  { type: "sand", island: "tropical1", points: [[5500,1300],[6100,1300],[6100,1900],[5500,1900]], color: "#C8B88A", color2: "#B8A87A" },
  { type: "grass", island: "tropical1", points: [[5580,1380],[6020,1380],[6020,1820],[5580,1820]], color: "#5A8A3A", color2: "#4E7E30" },
  { type: "water", shallow: true, island: "tropical1", points: [[5700,1500],[5850,1480],[5870,1650],[5680,1670]], color: "#40A8D0", color2: "#30A0C8" },

  // Island 2: Tropical Beach (6500, 3200) 500x500
  { type: "sand", island: "tropical2", points: [[6250,2950],[6750,2950],[6750,3450],[6250,3450]], color: "#C8B88A", color2: "#B8A87A" },
  { type: "grass", island: "tropical2", points: [[6320,3020],[6680,3020],[6680,3380],[6320,3380]], color: "#5A8A3A", color2: "#4E7E30" },

  // Island 3: Volcanic (2200, 4500) 700x600
  { type: "sand", island: "volcanic1", points: [[1850,4200],[2550,4200],[2550,4800],[1850,4800]], color: "#6A5A4A", color2: "#5A4A3A" },
  { type: "grass", island: "volcanic1", points: [[1940,4290],[2460,4290],[2460,4710],[1940,4710]], color: "#3A3A38", color2: "#2E2E2C" },
  { type: "water", shallow: true, island: "volcanic1", points: [[2100,4400],[2280,4380],[2300,4550],[2080,4570]], color: "#D04020", color2: "#C03010" },

  // Island 4: Volcanic (5200, 5000) 500x500
  { type: "sand", island: "volcanic2", points: [[4950,4750],[5450,4750],[5450,5250],[4950,5250]], color: "#6A5A4A", color2: "#5A4A3A" },
  { type: "grass", island: "volcanic2", points: [[5020,4820],[5380,4820],[5380,5180],[5020,5180]], color: "#3A3A38", color2: "#2E2E2C" },

  // Island 5: Snowy (1200, -800) 600x600
  { type: "sand", island: "snowy1", points: [[900,-1100],[1500,-1100],[1500,-500],[900,-500]], color: "#D8D8E0", color2: "#C8C8D0" },
  { type: "grass", island: "snowy1", points: [[980,-1020],[1420,-1020],[1420,-580],[980,-580]], color: "#E8E8F0", color2: "#D8D8E8" },
  { type: "water", shallow: true, island: "snowy1", points: [[1080,-880],[1250,-900],[1270,-740],[1060,-720]], color: "#80C0E0", color2: "#70B0D8" },

  // Island 6: Snowy (-600, 1800) 500x500
  { type: "sand", island: "snowy2", points: [[-850,1550],[-350,1550],[-350,2050],[-850,2050]], color: "#D8D8E0", color2: "#C8C8D0" },
  { type: "grass", island: "snowy2", points: [[-780,1620],[-420,1620],[-420,1980],[-780,1980]], color: "#E8E8F0", color2: "#D8D8E8" },

  // Island 7: Mushroom (6200, -400) 500x500
  { type: "sand", island: "mushroom1", points: [[5950,-650],[6450,-650],[6450,-150],[5950,-150]], color: "#8A7A6A", color2: "#7A6A5A" },
  { type: "grass", island: "mushroom1", points: [[6020,-580],[6380,-580],[6380,-220],[6020,-220]], color: "#4A5A4A", color2: "#3E4E3E" },

  // Island 8: Mushroom (-800, 3200) 500x500
  { type: "sand", island: "mushroom2", points: [[-1050,2950],[-550,2950],[-550,3450],[-1050,3450]], color: "#8A7A6A", color2: "#7A6A5A" },
  { type: "grass", island: "mushroom2", points: [[-980,3020],[-620,3020],[-620,3380],[-980,3380]], color: "#4A5A4A", color2: "#3E4E3E" },
  { type: "water", shallow: true, island: "mushroom2", points: [[-880,3100],[-720,3080],[-700,3250],[-900,3270]], color: "#60DD60", color2: "#50CC50" },

  // Island 9: Alien/Strange (3800, 5800) 700x600
  { type: "sand", island: "alien1", points: [[3450,5500],[4150,5500],[4150,6100],[3450,6100]], color: "#8A6A8A", color2: "#7A5A7A" },
  { type: "grass", island: "alien1", points: [[3540,5590],[4060,5590],[4060,6010],[3540,6010]], color: "#5A3A6A", color2: "#4E2E5E" },
  { type: "water", shallow: true, island: "alien1", points: [[3650,5700],[3850,5680],[3870,5870],[3630,5890]], color: "#C060FF", color2: "#B050EE" },

  // Island 10: Alien/Strange (7200, 800) 500x500
  { type: "sand", island: "alien2", points: [[6950,550],[7450,550],[7450,1050],[6950,1050]], color: "#8A6A8A", color2: "#7A5A7A" },
  { type: "grass", island: "alien2", points: [[7020,620],[7380,620],[7380,980],[7020,980]], color: "#5A3A6A", color2: "#4E2E5E" },
];

var TREES = [];
var treeSeeds = [
  // Original trees
  [60,50],[180,30],[320,70],[100,180],[250,200],[50,320],[200,340],[350,320],
  [480,60],[150,470],[30,550],[300,500],[450,470],
  [700,50],[850,100],[950,40],[1050,80],[1150,30],[700,200],[850,250],[1000,190],
  [1250,60],[1350,100],[1500,50],[1600,30],[1800,60],[1900,80],[2000,50],
  [1250,200],[1850,200],[1950,180],[2050,150],
  [30,700],[160,750],[80,900],[200,880],[50,1050],[180,1020],[300,1080],
  [100,1180],[250,1150],
  [900,350],[950,500],[880,550],[1050,380],[1100,500],
  [830,650],[1150,680],[1130,920],[860,940],[780,800],
  [700,850],[750,1000],[850,1100],[1000,1050],[1100,1100],
  [1200,850],[1300,900],[1400,1000],[1500,1100],[1350,1150],
  [1600,600],[1700,550],[1800,650],[1900,600],[1650,750],
  [1700,850],[1800,800],[1600,950],[1750,1000],[1900,900],
  [400,1200],[550,1230],[700,1180],[900,1200],[1100,1220],
  [1300,1180],[1500,1230],[1700,1150],[1850,1100],
  // New trees - north expanded area
  [2500,80],[2650,120],[2800,50],[2950,150],[3100,70],[3250,100],[3400,40],
  [3550,130],[3700,60],[3850,110],[4000,80],[4150,50],[4300,120],
  [2500,250],[2700,300],[2900,220],[3100,280],[3300,200],[3500,320],[3700,250],
  [2550,450],[2750,500],[2950,380],[3150,470],[3600,500],[3800,420],
  // New trees - middle expanded area
  [2500,650],[2650,720],[2850,680],[3050,750],[3450,700],[3650,650],[3850,730],
  [2500,900],[2700,950],[2900,880],[3100,960],[3300,900],[3500,850],[3700,930],
  [2500,1100],[2700,1050],[2900,1150],[3100,1080],[3300,1120],[3700,1100],
  [2600,1300],[2800,1350],[3050,1280],[3250,1350],[3500,1300],[3700,1280],
  // New trees - south expanded area
  [200,1400],[400,1450],[650,1380],[850,1430],[1050,1400],[1250,1500],
  [1500,1400],[1700,1480],[1900,1350],[2100,1450],[2300,1380],
  [100,1600],[350,1650],[550,1580],[800,1630],[1050,1600],[1300,1680],
  [1550,1600],[1750,1550],[1950,1650],[2150,1580],[2350,1630],
  [150,1850],[400,1900],[650,1830],[900,1880],[1150,1850],[1400,1930],
  [2500,1600],[2700,1650],[2900,1580],[3100,1630],
  [2550,1850],[2750,1900],[2950,1830],[3150,1880],
  // Dense forest zone
  [3050,1850],[3200,1900],[3350,1870],[3500,1920],[3650,1860],[3800,1910],[3950,1850],
  [3100,2050],[3250,2000],[3400,2070],[3550,2020],[3700,2060],[3850,2000],
  [3050,2200],[3200,2250],[3350,2180],[3500,2230],[3650,2200],[3800,2270],[3950,2200],
  [3100,2380],[3250,2420],[3400,2350],[3550,2400],[3700,2380],[3850,2350],
  // Trees near south beach
  [200,2400],[500,2350],[800,2420],[1100,2380],[1400,2450],[1700,2350],
  [2000,2420],[2300,2380],[2600,2450],[2900,2380],
  // === Island trees ===
  // Tropical 1 (5800, 1600)
  [5620,1420],[5750,1500],[5900,1400],[5650,1700],[5850,1750],[5980,1600],
  // Tropical 2 (6500, 3200)
  [6350,3060],[6500,3100],[6620,3050],[6400,3300],[6550,3340],
  // Volcanic 1 (2200, 4500) - sparse, dark
  [1980,4330],[2150,4650],[2400,4350],[2350,4680],
  // Volcanic 2 (5200, 5000) - sparse
  [5060,4860],[5300,4900],[5100,5120],[5340,5100],
  // Snowy 1 (1200, -800) - frosted trees
  [1020,-980],[1180,-950],[1350,-1000],[1050,-650],[1250,-620],[1400,-680],
  // Snowy 2 (-600, 1800)
  [-740,1660],[-580,1700],[-700,1900],[-500,1880],[-650,1780],
  // Mushroom 1 (6200, -400) - mushroom "trees"
  [6060,-540],[6200,-480],[6340,-560],[6100,-280],[6280,-250],[6380,-380],
  // Mushroom 2 (-800, 3200)
  [-940,3060],[-780,3100],[-940,3320],[-680,3280],[-850,3200],
  // Alien 1 (3800, 5800) - crystal trees
  [3580,5630],[3750,5700],[3920,5620],[3600,5950],[3800,5970],[3980,5900],
  // Alien 2 (7200, 800)
  [7060,660],[7200,700],[7340,650],[7100,920],[7280,900],
];
for (var ti = 0; ti < treeSeeds.length; ti++) {
  var ts = treeSeeds[ti];
  var v = (ts[0] * 7 + ts[1] * 3) % 5;
  TREES.push({ x: ts[0], y: ts[1], h: 75 + v * 15, w: 55 + v * 10, trunk: 5 + v, seed: v });
}

// Island definitions for fruit/treasure assignment
// Each island has a treasure chest at a specific location
var ISLANDS = [
  { name: "tropical1", theme: "tropical", cx: 5800, cy: 1600, hw: 300, hh: 300, treasure: { x: 5800, y: 1600 } },
  { name: "tropical2", theme: "tropical", cx: 6500, cy: 3200, hw: 250, hh: 250, treasure: { x: 6500, y: 3200 } },
  { name: "volcanic1", theme: "volcanic", cx: 2200, cy: 4500, hw: 350, hh: 300, treasure: { x: 2200, y: 4500 } },
  { name: "volcanic2", theme: "volcanic", cx: 5200, cy: 5000, hw: 250, hh: 250, treasure: { x: 5200, y: 5000 } },
  { name: "snowy1", theme: "snowy", cx: 1200, cy: -800, hw: 300, hh: 300, treasure: { x: 1200, y: -800 } },
  { name: "snowy2", theme: "snowy", cx: -600, cy: 1800, hw: 250, hh: 250, treasure: { x: -600, y: 1800 } },
  { name: "mushroom1", theme: "mushroom", cx: 6200, cy: -400, hw: 250, hh: 250, treasure: { x: 6200, y: -400 } },
  { name: "mushroom2", theme: "mushroom", cx: -800, cy: 3200, hw: 250, hh: 250, treasure: { x: -800, y: 3200 } },
  { name: "alien1", theme: "alien", cx: 3800, cy: 5800, hw: 350, hh: 300, treasure: { x: 3800, y: 5800 } },
  { name: "alien2", theme: "alien", cx: 7200, cy: 800, hw: 250, hh: 250, treasure: { x: 7200, y: 800 } },
];

var ROCKS = [
  // Original rocks
  { x: 500, y: 420, size: 22 }, { x: 780, y: 700, size: 18 },
  { x: 1050, y: 350, size: 16 }, { x: 300, y: 850, size: 20 },
  { x: 1400, y: 750, size: 24 }, { x: 1700, y: 400, size: 18 },
  { x: 200, y: 1100, size: 16 }, { x: 1000, y: 1150, size: 20 },
  { x: 1900, y: 1050, size: 22 }, { x: 650, y: 300, size: 14 },
  // New rocks in expanded area
  { x: 2600, y: 350, size: 20 }, { x: 3000, y: 550, size: 26 },
  { x: 3400, y: 250, size: 18 }, { x: 3800, y: 600, size: 22 },
  { x: 2700, y: 900, size: 16 }, { x: 3200, y: 1100, size: 24 },
  { x: 3600, y: 800, size: 20 }, { x: 2800, y: 1500, size: 18 },
  { x: 3400, y: 1600, size: 22 }, { x: 3900, y: 1400, size: 16 },
  { x: 500, y: 1600, size: 20 }, { x: 1100, y: 1800, size: 18 },
  { x: 1700, y: 2000, size: 24 }, { x: 2200, y: 1700, size: 16 },
  { x: 3300, y: 2100, size: 28 }, { x: 3700, y: 2300, size: 20 },
  { x: 800, y: 2200, size: 22 }, { x: 1500, y: 2400, size: 18 },
  { x: 2100, y: 2300, size: 20 }, { x: 2900, y: 2500, size: 16 },
  // Island rocks
  { x: 5560, y: 1350, size: 18 }, { x: 6050, y: 1850, size: 20 }, // Tropical 1
  { x: 6300, y: 3000, size: 16 }, { x: 6700, y: 3400, size: 18 }, // Tropical 2
  { x: 1900, y: 4260, size: 24 }, { x: 2480, y: 4740, size: 22 }, { x: 2300, y: 4500, size: 28 }, // Volcanic 1
  { x: 5000, y: 4800, size: 20 }, { x: 5400, y: 5200, size: 22 }, // Volcanic 2
  { x: 950, y: -1050, size: 18 }, { x: 1450, y: -550, size: 16 }, // Snowy 1
  { x: -800, y: 1600, size: 16 }, { x: -400, y: 2000, size: 18 }, // Snowy 2
  { x: 6000, y: -600, size: 16 }, { x: 6400, y: -200, size: 14 }, // Mushroom 1
  { x: -1000, y: 3000, size: 18 }, { x: -600, y: 3400, size: 16 }, // Mushroom 2
  { x: 3500, y: 5550, size: 22 }, { x: 4100, y: 6050, size: 20 }, // Alien 1
  { x: 7000, y: 600, size: 18 }, { x: 7400, y: 1000, size: 16 }, // Alien 2
];

var BUSHES = [
  // Original bushes
  { x: 430, y: 500 }, { x: 750, y: 350 }, { x: 1100, y: 600 },
  { x: 300, y: 700 }, { x: 1500, y: 400 }, { x: 1650, y: 300 },
  { x: 150, y: 600 }, { x: 900, y: 1000 }, { x: 1200, y: 1100 },
  { x: 1800, y: 750 }, { x: 50, y: 450 }, { x: 1350, y: 600 },
  // New bushes in expanded area
  { x: 2550, y: 300 }, { x: 2800, y: 450 }, { x: 3100, y: 350 },
  { x: 3350, y: 550 }, { x: 3600, y: 300 }, { x: 3850, y: 480 },
  { x: 2600, y: 750 }, { x: 2900, y: 680 }, { x: 3200, y: 820 },
  { x: 3500, y: 950 }, { x: 3800, y: 700 }, { x: 2700, y: 1200 },
  { x: 3100, y: 1350 }, { x: 3500, y: 1250 }, { x: 3800, y: 1100 },
  { x: 400, y: 1500 }, { x: 700, y: 1650 }, { x: 1000, y: 1550 },
  { x: 1300, y: 1700 }, { x: 1600, y: 1500 }, { x: 1900, y: 1650 },
  { x: 2200, y: 1550 }, { x: 2500, y: 1700 }, { x: 2800, y: 1650 },
  { x: 500, y: 2100 }, { x: 1000, y: 2050 }, { x: 1500, y: 2150 },
  { x: 2000, y: 2050 }, { x: 2500, y: 2200 }, { x: 3000, y: 2100 },
  { x: 3300, y: 2350 }, { x: 3600, y: 2200 }, { x: 3900, y: 2100 },
];

// Fish spawn positions - each fish has a starting x,y and which water zone index it belongs to
// Water zones: 2=south ocean, 4=east ocean, 11=original pond, 12=lake, 13=north pond, 14=south lake
var FISH = [
  // South ocean (zone 6) - 5 fish
  { x: 800, y: 3200, zone: 6 }, { x: 1600, y: 3350, zone: 6 },
  { x: 2400, y: 3150, zone: 6 }, { x: 3200, y: 3300, zone: 6 },
  { x: 4000, y: 3250, zone: 6 },
  // East ocean (zone 8) - 3 fish
  { x: 4550, y: 1900, zone: 8 }, { x: 4650, y: 2400, zone: 8 },
  { x: 4500, y: 2800, zone: 8 },
  // Original pond (zone 15) - 3 fish
  { x: 950, y: 750, zone: 15 }, { x: 1050, y: 830, zone: 15 },
  { x: 980, y: 870, zone: 15 },
  // Lake (zone 16) - 3 fish
  { x: 2580, y: 1260, zone: 16 }, { x: 2680, y: 1350, zone: 16 },
  { x: 2620, y: 1400, zone: 16 },
  // North pond (zone 17) - 2 fish
  { x: 3300, y: 450, zone: 17 }, { x: 3400, y: 500, zone: 17 },
  // South lake (zone 18) - 3 fish
  { x: 1480, y: 2280, zone: 18 }, { x: 1600, y: 2380, zone: 18 },
  { x: 1550, y: 2420, zone: 18 },
];

// Crabs on the beaches
var CRABS = [
  // South beach
  { x: 300, y: 2620 }, { x: 700, y: 2680 }, { x: 1100, y: 2640 },
  { x: 1500, y: 2700 }, { x: 1900, y: 2630 }, { x: 2300, y: 2680 },
  { x: 2700, y: 2650 }, { x: 3100, y: 2710 }, { x: 3500, y: 2640 },
  { x: 3900, y: 2690 },
  // North beach
  { x: 500, y: 100 }, { x: 1200, y: 60 }, { x: 2000, y: 120 },
  { x: 2800, y: 80 }, { x: 3600, y: 110 },
  // West beach
  { x: 80, y: 500 }, { x: 60, y: 1100 }, { x: 100, y: 1700 },
  { x: 70, y: 2200 },
  // East beach (near sand area)
  { x: 4200, y: 1800 }, { x: 4250, y: 2100 }, { x: 4180, y: 2400 },
];

var HOUSES = [
  {
    x: 1000, y: 2750,
    w: 200, d: 160,
    wallH: 50, roofH: 30,
    doorW: 40,
    wallColor: "#CC3333",
    roofColor: "#8B1A1A",
    doorFrameColor: "#5A3A1A",
    floorColor: "#A08060",
  },
];

var SHOP_HOUSE = {
  x: 2000, y: 1950,
  w: 180, d: 140,
  wallH: 50, roofH: 30,
  doorW: 40,
  wallColor: "#7B3FA0",
  roofColor: "#3A1A50",
  doorFrameColor: "#D0A0FF",
  floorColor: "#4A3260",
  isShop: true,
};

function drawZone(ctx, zone, frame) {
  var pts = zone.points;
  ctx.fillStyle = zone.color;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();

  // Ground texture - scattered noise dots
  var minX = pts[0][0], maxX = pts[0][0], minY = pts[0][1], maxY = pts[0][1];
  for (var k = 1; k < pts.length; k++) {
    if (pts[k][0] < minX) minX = pts[k][0];
    if (pts[k][0] > maxX) maxX = pts[k][0];
    if (pts[k][1] < minY) minY = pts[k][1];
    if (pts[k][1] > maxY) maxY = pts[k][1];
  }

  if (zone.type === "grass" || zone.type === "clearing") {
    // Subtle ground variation
    ctx.fillStyle = zone.color2;
    for (var gi = 0; gi < 80; gi++) {
      var gx = minX + ((gi * 173 + 51) % (maxX - minX));
      var gy = minY + ((gi * 97 + 23) % (maxY - minY));
      ctx.fillRect(gx, gy, 8 + gi % 6, 4 + gi % 3);
    }
    // Small grass blades
    ctx.strokeStyle = "#3A5A2E";
    ctx.lineWidth = 1;
    for (var bi = 0; bi < 120; bi++) {
      var bx = minX + ((bi * 211 + 37) % (maxX - minX));
      var by = minY + ((bi * 131 + 67) % (maxY - minY));
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + (bi % 5 - 2), by - 4 - bi % 4);
      ctx.stroke();
    }
  }

  if (zone.type === "water") {
    ctx.fillStyle = zone.color2;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1] + 40);
    for (var j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1] + 40);
    ctx.closePath();
    ctx.fill();
    // Realistic ripples
    ctx.strokeStyle = "rgba(180,210,230,0.07)";
    ctx.lineWidth = 1;
    for (var wy = minY + 10; wy < maxY; wy += 18) {
      ctx.beginPath();
      for (var wx = minX; wx < maxX; wx += 3) {
        var wvy = wy + Math.sin((frame * 0.012) + wx * 0.012 + wy * 0.008) * 3;
        if (wx === minX) ctx.moveTo(wx, wvy); else ctx.lineTo(wx, wvy);
      }
      ctx.stroke();
    }
    // Light reflections
    ctx.fillStyle = "rgba(200,230,255,0.04)";
    for (var ri = 0; ri < 20; ri++) {
      var rx = minX + ((ri * 199 + frame * 0.3) % (maxX - minX));
      var ry = minY + ((ri * 127) % (maxY - minY));
      ctx.fillRect(rx, ry + Math.sin(frame * 0.02 + ri) * 2, 15 + ri % 10, 2);
    }
  }

  if (zone.type === "sand") {
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    for (var si = 0; si < 60; si++) {
      var sx = minX + ((si * 157) % (maxX - minX));
      var sy = minY + ((si * 89) % (maxY - minY));
      ctx.fillRect(sx, sy, 2 + si % 3, 1);
    }
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (var si2 = 0; si2 < 30; si2++) {
      var sx2 = minX + ((si2 * 199) % (maxX - minX));
      var sy2 = minY + ((si2 * 113) % (maxY - minY));
      ctx.fillRect(sx2, sy2, 3, 1);
    }
  }

  if (zone.type === "path") {
    // Dirt texture
    ctx.fillStyle = zone.color2;
    for (var pi = 0; pi < 30; pi++) {
      var ppx = minX + ((pi * 151) % (maxX - minX));
      var ppy = minY + ((pi * 97) % (maxY - minY));
      ctx.fillRect(ppx, ppy, 4 + pi % 4, 2 + pi % 2);
    }
    // Small pebbles
    ctx.fillStyle = "#8A7A5A";
    for (var pb = 0; pb < 15; pb++) {
      var pbx = minX + ((pb * 181) % (maxX - minX));
      var pby = minY + ((pb * 71) % (maxY - minY));
      ctx.beginPath(); ctx.ellipse(pbx, pby, 2, 1.5, pb * 0.5, 0, Math.PI * 2); ctx.fill();
    }
  }
}

function drawTree(ctx, tree) {
  var x = tree.x, y = tree.y, h = tree.h, w = tree.w, tw = tree.trunk, s = tree.seed;

  // Ground shadow - soft and natural
  ctx.fillStyle = "rgba(0,0,0,0.20)";
  ctx.beginPath(); ctx.ellipse(x + 10, y + 8, w * 0.4, 8, 0.3, 0, Math.PI * 2); ctx.fill();

  // Trunk - bark texture
  ctx.fillStyle = "#4A3828";
  ctx.fillRect(x - tw - 1, y - h * 0.32, tw * 2 + 2, h * 0.42);
  ctx.fillStyle = "#5A4838";
  ctx.fillRect(x - tw, y - h * 0.32, tw * 2, h * 0.42);
  // Bark highlights
  ctx.fillStyle = "#6A5848";
  ctx.fillRect(x - tw + 1, y - h * 0.3, 2, h * 0.38);
  ctx.fillRect(x - tw + 4, y - h * 0.28, 1, h * 0.3);
  // Bark dark lines
  ctx.fillStyle = "#3A2818";
  ctx.fillRect(x + tw - 2, y - h * 0.3, 1, h * 0.35);
  ctx.fillRect(x - 1, y - h * 0.25, 1, h * 0.2);

  // Canopy - multiple overlapping leaf clusters for realism
  var cx = x, cy = y - h * 0.58;

  // Shadow layer (behind)
  ctx.fillStyle = "#1A3A18";
  drawLeafCluster(ctx, cx + 5, cy + 10, w * 0.5, h * 0.4);

  // Main dark mass
  ctx.fillStyle = "#264A24";
  drawLeafCluster(ctx, cx, cy, w * 0.5, h * 0.4);

  // Mid tones - several overlapping clusters
  ctx.fillStyle = "#2E5A2A";
  drawLeafCluster(ctx, cx - 8, cy + 5, w * 0.35, h * 0.28);
  drawLeafCluster(ctx, cx + 10, cy - 2, w * 0.3, h * 0.25);

  ctx.fillStyle = "#386832";
  drawLeafCluster(ctx, cx - 5, cy - 5, w * 0.38, h * 0.3);
  drawLeafCluster(ctx, cx + 6, cy + 8, w * 0.28, h * 0.22);

  // Lighter patches (where sunlight hits)
  ctx.fillStyle = "#447A3A";
  drawLeafCluster(ctx, cx - 10, cy - 10, w * 0.2, h * 0.15);
  drawLeafCluster(ctx, cx + 2, cy - 12, w * 0.18, h * 0.14);

  // Bright highlight spots
  ctx.fillStyle = "#508A44";
  drawLeafCluster(ctx, cx - 12, cy - 14, w * 0.12, h * 0.1);

  // Leaf edge details
  ctx.fillStyle = "#2A4E26";
  for (var li = 0; li < 8; li++) {
    var la = (li / 8) * Math.PI * 2 + s * 1.5;
    var lr = w * 0.42;
    var lx = cx + Math.cos(la) * lr;
    var ly = cy + Math.sin(la) * lr * 0.65;
    drawLeafCluster(ctx, lx, ly, 10 + li % 4 * 2, 8 + li % 3);
  }
}

function drawLeafCluster(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawRock(ctx, rock) {
  var x = rock.x, y = rock.y, s = rock.size;
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath(); ctx.ellipse(x + 3, y + s * 0.2, s * 0.6, 5, 0, 0, Math.PI * 2); ctx.fill();
  // Dark base
  ctx.fillStyle = "#505050";
  ctx.beginPath();
  ctx.moveTo(x - s * 0.55, y + s * 0.15);
  ctx.quadraticCurveTo(x - s * 0.48, y - s * 0.55, x + s * 0.1, y - s * 0.62);
  ctx.quadraticCurveTo(x + s * 0.58, y - s * 0.38, x + s * 0.52, y + s * 0.15);
  ctx.closePath();
  ctx.fill();
  // Mid face
  ctx.fillStyle = "#686868";
  ctx.beginPath();
  ctx.moveTo(x - s * 0.42, y + s * 0.08);
  ctx.quadraticCurveTo(x - s * 0.36, y - s * 0.45, x + s * 0.05, y - s * 0.52);
  ctx.quadraticCurveTo(x + s * 0.38, y - s * 0.32, x + s * 0.28, y + s * 0.08);
  ctx.closePath();
  ctx.fill();
  // Light face
  ctx.fillStyle = "#787878";
  ctx.beginPath();
  ctx.moveTo(x - s * 0.32, y - s * 0.05);
  ctx.quadraticCurveTo(x - s * 0.25, y - s * 0.42, x, y - s * 0.48);
  ctx.quadraticCurveTo(x + s * 0.1, y - s * 0.2, x - s * 0.1, y);
  ctx.closePath();
  ctx.fill();
  // Subtle highlight
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.moveTo(x - s * 0.2, y - s * 0.2);
  ctx.quadraticCurveTo(x - s * 0.1, y - s * 0.45, x + s * 0.05, y - s * 0.42);
  ctx.quadraticCurveTo(x - s * 0.05, y - s * 0.15, x - s * 0.15, y - s * 0.1);
  ctx.closePath();
  ctx.fill();
  // Moss hint
  ctx.fillStyle = "rgba(60,90,50,0.25)";
  ctx.beginPath(); ctx.ellipse(x - s * 0.2, y - s * 0.1, s * 0.15, s * 0.08, -0.3, 0, Math.PI * 2); ctx.fill();
}

function drawBush(ctx, bush) {
  var x = bush.x, y = bush.y;
  ctx.fillStyle = "rgba(0,0,0,0.14)";
  ctx.beginPath(); ctx.ellipse(x + 2, y + 10, 18, 4, 0, 0, Math.PI * 2); ctx.fill();
  // Layers of leaf mass
  ctx.fillStyle = "#1E3E1A";
  ctx.beginPath(); ctx.ellipse(x + 2, y + 3, 22, 15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#264A22";
  ctx.beginPath(); ctx.ellipse(x, y, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#2E5828";
  ctx.beginPath(); ctx.ellipse(x - 5, y - 2, 15, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#386830";
  ctx.beginPath(); ctx.ellipse(x - 3, y - 4, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#447A3A";
  ctx.beginPath(); ctx.ellipse(x - 6, y - 6, 6, 4, -0.3, 0, Math.PI * 2); ctx.fill();
}

function isBlocked(px, py, playerR) {
  for (var i = 0; i < ZONES.length; i++) {
    if (ZONES[i].type === "water" && !ZONES[i].shallow && !ZONES[i].swimmable && pointInPoly(px, py, ZONES[i].points)) return true;
  }
  for (var t = 0; t < TREES.length; t++) {
    var tr = TREES[t];
    var dx = px - tr.x, dy = py - tr.y;
    if (Math.abs(dx) < tr.trunk + playerR && Math.abs(dy) < 10 + playerR) return true;
  }
  for (var r = 0; r < ROCKS.length; r++) {
    var rk = ROCKS[r];
    var dx2 = px - rk.x, dy2 = py - rk.y;
    if (dx2 * dx2 + dy2 * dy2 < (rk.size + playerR) * (rk.size + playerR) * 0.3) return true;
  }
  if (px < 10 || px > WORLD_W - 10 || py < 10 || py > WORLD_H - 10) return true;
  return false;
}

function pointInPoly(px, py, pts) {
  var inside = false;
  for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export { WORLD_W, WORLD_H, ZONES, TREES, ROCKS, BUSHES, FISH, CRABS, HOUSES, SHOP_HOUSE, ISLANDS, drawZone, drawTree, drawRock, drawBush, isBlocked };
