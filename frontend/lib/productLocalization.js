const KEY_LT = {
  Material: 'Medžiaga',
  Finish: 'Apdaila',
  Width: 'Plotis',
  'Inner diameter': 'Vidinis skersmuo',
  Weight: 'Svoris',
  Care: 'Priežiūra',
  Origin: 'Kilmė',
  Length: 'Ilgis',
  'Link width': 'Grandinėlės plotis',
  Clasp: 'Užsegimas',
  'Number of pieces': 'Dalių skaičius',
  Stones: 'Akmenys',
  'Wrist size': 'Riešo dydis',
  Diameter: 'Skersmuo',
  'Chain detail': 'Grandinėlės detalė',
  Chain: 'Grandinėlė',
  Pendant: 'Pakabukas',
  'Chain length': 'Grandinėlės ilgis',
  Setting: 'Įstatymas',
  Closure: 'Užsegimas',
  'Gold layer': 'Aukso sluoksnis',
  Pearls: 'Perlai',
  'Pearl tone': 'Perlų atspalvis',
  Thread: 'Siūlas',
  Layers: 'Sluoksniai',
  'Link type': 'Grandinėlės tipas',
  Extension: 'Prailginimas',
  Interior: 'Vidus',
  'Pearl size': 'Perlų dydis',
  'Drop length': 'Pakabos ilgis',
};

const VALUE_LT = {
  'Handcrafted in Lithuania': 'Rankų darbo Lietuvoje',
  'Hand-burnished': 'Rankomis poliruota',
  'High polish': 'Aukšto blizgesio',
  'Lobster clasp': 'Karabino tipo užsegimas',
  'Spring ring clasp': 'Žiedinis užsegimas',
  'Avoid contact with water and perfume': 'Venkite kontakto su vandeniu ir kvepalais',
  'Polish with a dry cloth; store in pouch': 'Poliruokite sausa šluoste; laikykite maišelyje',
  'Remove before swimming; wipe dry after wear': 'Prieš maudynes nuimkite; po nešiojimo nusausinkite',
  'Wipe after wear with soft cloth': 'Po nešiojimo valykite minkšta šluoste',
  'Avoid water, lotions, and chemicals': 'Venkite vandens, kremų ir chemikalų',
  'Avoid prolonged sun exposure; wipe clean with soft cloth': 'Venkite ilgo saulės poveikio; valykite minkšta šluoste',
  'Avoid water, chemicals, and perfume': 'Venkite vandens, chemikalų ir kvepalų',
  'Last on, first off; wipe with soft cloth after wear': 'Užsidėkite paskutinį, nuimkite pirmą; po nešiojimo valykite minkšta šluoste',
  'Store in pouch and avoid moisture': 'Laikykite maišelyje ir saugokite nuo drėgmės',
  'Avoid perfumes and water exposure': 'Venkite kvepalų ir vandens',
  'Last on, first off; wipe after wear': 'Užsidėkite paskutinį, nuimkite pirmą; po nešiojimo nuvalykite',
  'Brass with 18k gold plating': 'Žalvaris su 18k aukso padengimu',
  'Brass with 14k rose gold plating': 'Žalvaris su 14k rožinio aukso padengimu',
  '925 sterling silver': '925 prabos sidabras',
  'Gold-plated sterling silver': 'Auksu dengtas sidabras',
  'Gold vermeil over sterling silver': 'Aukso vermeilis ant sidabro',
  'Rose gold vermeil over sterling silver': 'Rožinio aukso vermeilis ant sidabro',
  'Sterling silver with freshwater pearls': 'Sidabras su gėlavandeniais perlais',
};

const MATERIAL_LT = {
  'Gold-plated brass': 'Auksu dengtas žalvaris',
  'Sterling silver': 'Sidabras',
  '14k rose finish': '14k rožinio aukso apdaila',
  'Gold vermeil': 'Aukso vermeilis',
  'Sterling silver and opal': 'Sidabras ir opalas',
  'Gold-plated silver': 'Auksu dengtas sidabras',
  'Silver and moonstone': 'Sidabras ir mėnulio akmuo',
  'Freshwater pearl': 'Gėlavandenis perlas',
  'Rose gold vermeil': 'Rožinio aukso vermeilis',
  'Freshwater pearl and silver': 'Gėlavandenis perlas ir sidabras',
};

const LT_DESCRIPTION = {
  'starlit-cuff': 'Starlit Cuff įkvėpta ramaus šiaurės dangaus švytėjimo. Atvira apyrankė pagaminta iš auksu dengto žalvario ir rankomis poliruota, todėl patogiai gula ant riešo ir tinka tiek dienai, tiek vakarui.',
  'velvet-chain-bracelet': 'Rafinuota sidabrinė grandinėlė apyrankė su subalansuotomis narelių proporcijomis, kurios dailiai priglunda prie odos. Patikimas karabino tipo užsegimas leidžia ją patogiai nešioti visą dieną.',
  'northern-charm-stack': 'Trys kruopščiai suderintos apyrankės viename rinkinyje: kalta juosta, subtili virvutės tipo grandinėlė ir juostelė su akcentiniu akmeniu. Galite nešioti kartu arba atskirai.',
  'luna-braid-bangle': 'Pintos formos bangle tipo apyrankė su švelniu blizgesiu, sukurta kasdieniam sluoksniavimui. Dailiai pagauna šviesą ir puikiai dera tiek viena, tiek su kitomis apyrankėmis.',
  'opal-link-bracelet': 'Subtili grandininė apyrankė su opalo akcentu, suteikiančiu švelnų iridescencijos efektą. Sukurta patogiam kasdieniam nešiojimui ir moderniam įvaizdžiui.',
  'eclipse-chain-cuff': 'Skulptūriška atvira apyrankė su plona grandinėlės detale - atpažįstamas SAIREN siluetas. Išskirtinė forma ir patogus nešiojimas tiek ypatingoms progoms, tiek kasdienai.',
  'moonline-pendant': 'Moonline pakabukas derina poliruotą sidabrinę grandinėlę ir rankomis įstatytą mėnulio akmenį, švelniai atspindintį šviesą. Tai kasdienis talismanas su subtilia prasme.',
  'aurora-drop-chain': 'Plona aukso vermeilio grandinėlė su minimalistiniu geometriniu pakabuku. Modernus ir universalus papuošalas, puikiai tinkantis tiek vienas, tiek sluoksniuojant.',
  'halo-pearl-thread': 'Vientisa gėlavandenių perlų gija su aukso vermeilio užsegimu. Klasikinis papuošalas, kuris dera ir su šiuolaikiniu, ir su elegantišku stiliumi.',
  'solstice-layer-chain': 'Dviguba grandinėlė su subalansuotais ilgiais, kad sluoksniavimo efektas būtų iškart viename papuošale. Švarus modernus siluetas kasdieniam nešiojimui.',
  'stella-locket-necklace': 'Plonas ovalus medalionas smulkiam prisiminimui, kabantis ant poliruotos rožinio aukso grandinėlės. Sentimentalus akcentas su šiuolaikiška forma.',
  'cascade-pearl-drop': 'Modernus kaklo papuošalas su vertikalia perlų kompozicija ir subtilia sidabrine grandinėle. Suteikia švelnaus judėjimo ir elegantiško užbaigtumo dienos ar vakaro įvaizdžiui.',
};

const LT_NAME = {
  'starlit-cuff': 'Starlit Cuff',
  'velvet-chain-bracelet': 'Velvet Chain apyrankė',
  'northern-charm-stack': 'Northern Charm rinkinys',
  'luna-braid-bangle': 'Luna Braid bangle',
  'opal-link-bracelet': 'Opal Link apyrankė',
  'eclipse-chain-cuff': 'Eclipse Chain Cuff',
  'moonline-pendant': 'Moonline pakabukas',
  'aurora-drop-chain': 'Aurora Drop grandinėlė',
  'halo-pearl-thread': 'Halo Pearl gija',
  'solstice-layer-chain': 'Solstice Layer grandinėlė',
  'stella-locket-necklace': 'Stella Locket kaklo papuošalas',
  'cascade-pearl-drop': 'Cascade Pearl Drop',
};

const translateSpecValue = (value) => {
  if (VALUE_LT[value]) {
    return VALUE_LT[value];
  }
  return value;
};

const localizeSpecs = (specs, locale) => {
  if (locale !== 'lt') {
    return specs;
  }

  return Object.entries(specs).reduce((acc, [key, value]) => {
    const translatedKey = KEY_LT[key] || key;
    acc[translatedKey] = translateSpecValue(value);
    return acc;
  }, {});
};

export const localizeProduct = (product, locale) => {
  if (!product || locale !== 'lt') {
    return product;
  }

  return {
    ...product,
    name: LT_NAME[product.slug] || product.name,
    material: MATERIAL_LT[product.material] || product.material,
    description: LT_DESCRIPTION[product.slug] || product.description,
    specs: localizeSpecs(product.specs || {}, locale),
  };
};

export const localizeProducts = (products, locale) =>
  products.map((product) => localizeProduct(product, locale));
