const SOURCE_FILES = {
  'plants-fungi': 'LAJIEN KUVIA_kasvit ja sienet.pdf',
  molluscs: 'LAJIEN KUVIA_nilviäiset.pdf',
  'arthropods-annelids': 'LAJIEN KUVIA_niveljalkaiset ja nivelmadot.pdf',
  vertebrates: 'LAJIEN KUVIA_selkarankaiset.pdf'
};

const CATEGORY_META = {
  all: { label: 'All species', short: 'Mixed set', tone: 'mixed' },
  'plants-fungi': { label: 'Plants and fungi', short: 'Plants + fungi', tone: 'leaf' },
  molluscs: { label: 'Molluscs', short: 'Molluscs', tone: 'shell' },
  'arthropods-annelids': { label: 'Arthropods and annelids', short: 'Arthropods + annelids', tone: 'bug' },
  vertebrates: { label: 'Vertebrates', short: 'Vertebrates', tone: 'bird' }
};

const IMAGE_COUNTS = {
  'plants-fungi': { 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 2, 17: 3, 18: 2, 19: 2, 20: 2, 21: 3, 22: 2, 23: 2, 24: 2, 25: 2, 26: 3, 27: 2, 28: 2, 29: 3, 30: 3, 31: 2, 33: 2, 34: 2, 35: 2, 36: 2, 37: 2, 38: 2, 39: 2, 40: 2, 42: 3, 43: 3 },
  molluscs: { 1: 2, 2: 2, 3: 1 },
  'arthropods-annelids': { 3: 1, 4: 2, 6: 2, 7: 2, 8: 2, 10: 2, 11: 2, 12: 2, 13: 2, 14: 1, 15: 2, 16: 2, 18: 2, 20: 2 },
  vertebrates: { 5: 2, 6: 2, 7: 2, 8: 1, 9: 2, 10: 2, 12: 2, 13: 2, 14: 2, 15: 3, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2, 25: 2, 26: 2, 28: 2, 29: 2, 30: 2, 31: 2, 32: 2, 33: 2, 34: 2, 35: 2, 36: 2, 37: 2, 38: 2, 39: 2, 40: 3, 41: 3, 42: 1, 43: 2, 45: 2, 46: 1, 48: 2, 49: 2, 50: 2 }
};

function photoPaths(category, page) {
  const count = IMAGE_COUNTS[category]?.[page] || 0;
  const pageText = String(page).padStart(2, '0');
  return Array.from({ length: count }, (_, index) => `assets/${category}-p${pageText}-i${index + 1}.jpg`);
}

function species(id, name, scientific, category, page, hint, aliases = [], group = false) {
  return {
    id,
    name,
    scientific,
    category,
    sourceFile: SOURCE_FILES[category],
    page,
    images: photoPaths(category, page),
    hint,
    aliases,
    group
  };
}

const SPECIES = [
  species('kuusi', 'Kuusi', 'Picea abies', 'plants-fungi', 2, 'Look for the needle-covered branches and hanging cones.'),
  species('manty', 'Mänty', 'Pinus sylvestris', 'plants-fungi', 3, 'Compare the needles and the overall shape of the tree.'),
  species('koivut', 'Koivut', 'Betula (suku)', 'plants-fungi', 4, 'The pale trunk and delicate leaves are useful clues.', [], true),
  species('pihlaja', 'Pihlaja', 'Sorbus aucuparia', 'plants-fungi', 5, 'Look closely at the leaflets and the clustered fruit.'),
  species('vaahtera', 'Vaahtera', 'Acer platanoides', 'plants-fungi', 6, 'The leaf shape is the key visual clue.'),
  species('lepat', 'Lepät', 'Alnus (suku)', 'plants-fungi', 7, 'Look for the catkins and the shape of the leaves.', [], true),
  species('haapa', 'Haapa', 'Populus tremula', 'plants-fungi', 8, 'Focus on the rounded leaves and the light trunk.'),
  species('vadelma', 'Vadelma', 'Rubus idaeus', 'plants-fungi', 9, 'Thorns, leaflets, and familiar berries may help.'),
  species('kataja', 'Kataja', 'Juniperus communis', 'plants-fungi', 10, 'The stiff needle-like leaves make a distinctive texture.'),
  species('pajut', 'Pajut', 'Salix (suku)', 'plants-fungi', 11, 'Look at the long leaves and the catkin-bearing branches.', [], true),
  species('mustikka', 'Mustikka', 'Vaccinium myrtillus', 'plants-fungi', 12, 'A low woodland plant with small leaves and dark berries.'),
  species('puolukka', 'Puolukka', 'Vaccinium vitis-idaea', 'plants-fungi', 13, 'Compare the evergreen leaves and berry clusters.'),
  species('kanerva', 'Kanerva', 'Calluna vulgaris', 'plants-fungi', 14, 'Look for the small scale-like leaves and tiny flowers.'),
  species('lakka', 'Lakka', 'Rubus chamaemorus', 'plants-fungi', 15, 'The plant grows low; its fruit changes colour as it ripens.', ['hilla']),
  species('oravanmarja', 'Oravanmarja', 'Maianthemum bifolium', 'plants-fungi', 16, 'Notice the small paired leaves and delicate flowers.'),
  species('kielo', 'Kielo', 'Convallaria majalis', 'plants-fungi', 17, 'Look for broad leaves and a hanging flower stalk.'),
  species('voikukka', 'Voikukka', 'Taraxacum', 'plants-fungi', 18, 'The flower head and the toothed leaves are strong clues.'),
  species('leskenlehti', 'Leskenlehti', 'Tussilago farfara', 'plants-fungi', 19, 'A yellow flower that can appear before the leaves.'),
  species('puna-apila', 'Puna-apila', 'Trifolium pratense', 'plants-fungi', 20, 'Look at the three-part leaves and rounded flower head.'),
  species('niittyleinikki', 'Niittyleinikki', 'Ranunculus acris', 'plants-fungi', 21, 'A bright yellow flower with a distinctive petal shape.'),
  species('maitohorsma', 'Maitohorsma', 'Epilobium angustifolium', 'plants-fungi', 22, 'Tall stems and a vertical row of pink flowers are clues.'),
  species('valkovuokko', 'Valkovuokko', 'Anemone nemorosa', 'plants-fungi', 23, 'Look for the white woodland flower and divided leaves.'),
  species('sinivuokko', 'Sinivuokko', 'Hepatica nobilis', 'plants-fungi', 24, 'The flower colour and the three-lobed leaves help.'),
  species('jarviruoko', 'Järviruoko', 'Phragmites australis', 'plants-fungi', 25, 'Tall wetland stems topped with a feathery plume.'),
  species('metsakorte', 'Metsäkorte', 'Equisetum sylvaticum', 'plants-fungi', 26, 'Look for the jointed stem and whorled side branches.'),
  species('kotkansiipi', 'Kotkansiipi', 'Matteuccia struthiopteris', 'plants-fungi', 27, 'A tall fern with fronds arranged in a broad shape.'),
  species('kallioimarre', 'Kallioimarre', 'Polypodium vulgare', 'plants-fungi', 28, 'A fern with separate leaflets growing from a creeping base.'),
  species('rahkasammalet', 'Rahkasammalet', 'Sphagnum', 'plants-fungi', 29, 'Look for the soft, tufted structure of a wetland moss.', [], true),
  species('karhunsammalet', 'Karhunsammalet', 'Polytrichum', 'plants-fungi', 30, 'The upright moss shoots have a sturdy, bristly look.', [], true),
  species('seinasammal', 'Seinäsammal', 'Pleurozium schreberi', 'plants-fungi', 31, 'A carpet-forming moss with branching shoots.'),
  species('punakarpassieni', 'Punakärpässieni', 'Amanita muscaria', 'plants-fungi', 33, 'The cap pattern and colour are especially useful here.'),
  species('kantarelli', 'Kantarelli eli keltavahvero', 'Cantharellus cibarius', 'plants-fungi', 34, 'Look at the warm colour and the shape of the underside.', ['keltavahvero']),
  species('suppilovahvero', 'Suppilovahvero', 'Cantharellus tubaeformis', 'plants-fungi', 35, 'A funnel-like shape and hollow stem are key clues.'),
  species('herkkutatti', 'Herkkutatti', 'Boletus edulis', 'plants-fungi', 36, 'Notice the cap, stout stem, and pale underside.'),
  species('kantokaapa', 'Kantokääpä', 'Fomitopsis pinicola', 'plants-fungi', 37, 'Look for the shelf-like growth on wood.'),
  species('sormipaisukarve', 'Sormipaisukarve', 'Hypogymnia physodes', 'plants-fungi', 38, 'A branching lichen with pale, finger-like lobes.'),
  species('harmaaporonjakala', 'Harmaaporonjäkälä', 'Cladina rangiferina', 'plants-fungi', 39, 'A pale, branching ground lichen with a soft appearance.'),
  species('naavat', 'Naavat', 'Usnea', 'plants-fungi', 40, 'Look for the hanging, hair-like lichen form.', [], true),
  species('rakkoleva', 'Rakkolevä', 'Fucus vesiculosus', 'plants-fungi', 42, 'The flat seaweed blades and air bladders are useful clues.'),
  species('ahdinparta', 'Ahdinparta', 'Cladophora glomerata', 'plants-fungi', 43, 'Look for the green, thread-like aquatic mass.'),

  species('sinisimpukka', 'Sinisimpukka', 'Mytilus edulis', 'molluscs', 1, 'A dark, ridged shell-forming mollusc from the shore.'),
  species('lehtokotilo', 'Lehtokotilo', 'Arianta arbustorum', 'molluscs', 2, 'Look at the spiral shell and the patterned body.', ['lehtokotilo']),
  species('ukkoetana', 'Ukkoetana', 'Limax cinereoniger', 'molluscs', 3, 'A large slug with a dark, mottled mantle.', ['ukkoetana']),

  species('jokirapu', 'Jokirapu', 'Astacus astacus', 'arthropods-annelids', 3, 'Look for the claws, segmented body, and long antennae.'),
  species('merirokko', 'Merirokko', 'Amphibalanus improvisus', 'arthropods-annelids', 4, 'A small, hard-shelled animal attached to a surface.'),
  species('susihamahakki', 'Susihämähäkki', 'Suku Pardosa', 'arthropods-annelids', 6, 'Focus on the eight-legged body and ground-dwelling form.', [], true),
  species('ristihamahakki', 'Ristihämähäkki', 'Araneus diadematus', 'arthropods-annelids', 7, 'Look for the pale cross-like pattern on the abdomen.'),
  species('puutiainen', 'Puutiainen', 'Ixodes ricinus', 'arthropods-annelids', 8, 'A small tick with a compact, oval body.'),
  species('kekomuurahainen', 'Kekomuurahainen', 'Formica rufa', 'arthropods-annelids', 10, 'Look closely at the red-and-dark colour pattern.'),
  species('mehilaiset', 'Mehiläiset', 'Anthophila', 'arthropods-annelids', 11, 'Look for the striped body and pollen-gathering form.', [], true),
  species('yleinen-ampiainen', 'Yleinen ampiainen', 'Vespula vulgaris', 'arthropods-annelids', 12, 'Yellow-and-black bands are the strongest visual clue.'),
  species('kimalaiset', 'Kimalaiset', 'Bombus', 'arthropods-annelids', 13, 'A round, fuzzy body with contrasting bands.', [], true),
  species('marjalude', 'Marjalude', 'Dolycoris baccarum', 'arthropods-annelids', 14, 'Look for the shield-shaped body and muted colours.'),
  species('neitoperhonen', 'Neitoperhonen', 'Nymphalis io', 'arthropods-annelids', 15, 'The bold eye spots on the wings are a clear clue.'),
  species('nokkosperhonen', 'Nokkosperhonen', 'Aglais urticae', 'arthropods-annelids', 16, 'Look for orange wings with dark markings and blue spots.'),
  species('juoksujalkainen', 'Juoksujalkainen', 'Chilopoda', 'arthropods-annelids', 18, 'A long, flattened body with many pairs of legs.', [], true),
  species('kasteliero', 'Kasteliero', 'Lumbricus terrestris', 'arthropods-annelids', 20, 'Look for the long, segmented body and pale band.'),

  species('hauki', 'Hauki', 'Esox lucius', 'vertebrates', 5, 'Look at the long body and broad, flattened snout.'),
  species('ahven', 'Ahven', 'Perca fluviatilis', 'vertebrates', 6, 'The striped body and spiny dorsal fin are clues.'),
  species('silakka', 'Silakka', 'Clupea harengus membras', 'vertebrates', 7, 'A silvery fish with a streamlined body.'),
  species('lohi', 'Lohi', 'Salmo salar', 'vertebrates', 8, 'Look for the salmon-like body and spotted pattern.'),
  species('sarki', 'Särki', 'Rutilus rutilus', 'vertebrates', 9, 'Notice the silvery body and reddish eye.'),
  species('lahna', 'Lahna', 'Abramis brama', 'vertebrates', 10, 'A deep-bodied fish with a tall, flattened profile.'),
  species('varis', 'Varis', 'Corvus corone ssp. cornix', 'vertebrates', 12, 'Grey and black plumage is the main clue.'),
  species('harakka', 'Harakka', 'Pica pica', 'vertebrates', 13, 'Look for the long tail and black-white plumage.'),
  species('talitiainen', 'Talitiainen', 'Parus major', 'vertebrates', 14, 'A black head, yellow underside, and dark breast stripe.'),
  species('peippo', 'Peippo', 'Fringilla coelebs', 'vertebrates', 15, 'Look for the compact finch shape and patterned wings.'),
  species('varpunen', 'Varpunen', 'Passer domesticus', 'vertebrates', 16, 'A small, familiar urban bird with a stout bill.'),
  species('mustarastas', 'Mustarastas', 'Turdus merula', 'vertebrates', 17, 'The male is dark with a bright bill; compare the silhouette.'),
  species('kesykyyhky', 'Kesykyyhky', 'Columba livia domestica', 'vertebrates', 18, 'Look for the familiar pigeon shape and wing bars.', ['pulu']),
  species('merikotka', 'Merikotka', 'Haliaeetus albicilla', 'vertebrates', 19, 'A large raptor with broad wings and a powerful profile.'),
  species('sinisorsa', 'Sinisorsa', 'Anas platyrhynchos', 'vertebrates', 20, 'Look at the broad bill and duck-like body.'),
  species('telkka', 'Telkkä', 'Bucephala clangula', 'vertebrates', 21, 'A compact diving duck with a rounded head.'),
  species('laulujoutsen', 'Laulujoutsen', 'Cygnus cygnus', 'vertebrates', 22, 'A large white waterbird with a long neck.'),
  species('valkoposkihanhi', 'Valkoposkihanhi', 'Branta leucopsis', 'vertebrates', 23, 'The white cheek patch is the defining clue.'),
  species('kalalokki', 'Kalalokki', 'Larus canus', 'vertebrates', 24, 'A medium-sized gull with grey wings.'),
  species('kanahaukka', 'Kanahaukka', 'Accipiter gentilis', 'vertebrates', 25, 'Look for a broad-winged forest raptor.'),
  species('helmipollo', 'Helmipöllö', 'Aegolius funereus', 'vertebrates', 26, 'A small owl with a rounded head and pale facial disc.'),
  species('karhu', 'Karhu', 'Ursus arctos', 'vertebrates', 28, 'A large mammal with a heavy build and rounded ears.'),
  species('kettu', 'Kettu', 'Vulpes vulpes', 'vertebrates', 29, 'Look for the pointed muzzle and bushy tail.'),
  species('susi', 'Susi', 'Canis lupus', 'vertebrates', 30, 'A large, long-legged canid with a thick coat.'),
  species('ilves', 'Ilves', 'Lynx lynx', 'vertebrates', 31, 'Look for ear tufts, a short tail, and a spotted coat.'),
  species('poro', 'Poro', 'Rangifer tarandus tarandus', 'vertebrates', 32, 'Antlers and the stocky northern deer shape are clues.'),
  species('hirvi', 'Hirvi', 'Alces alces', 'vertebrates', 33, 'A very large deer with long legs and broad ears.'),
  species('valkohantapeura', 'Valkohäntäkauris', 'Odocoileus virginianus', 'vertebrates', 34, 'Look for the white tail area and deer-like build.'),
  species('orava', 'Orava', 'Sciurus vulgaris', 'vertebrates', 35, 'A small tree-dweller with a prominent bushy tail.'),
  species('metsajanis', 'Metsäjänis', 'Lepus timidus', 'vertebrates', 36, 'Look for the long ears and powerful hind legs.'),
  species('siili', 'Siili', 'Erinaceus europaeus', 'vertebrates', 37, 'The coat of spines is the unmistakable clue.'),
  species('pohjanlepakko', 'Pohjanlepakko', 'Eptesicus nilssonii', 'vertebrates', 38, 'A small bat with folded wings and a compact body.'),
  species('saimaannorppa', 'Saimaannorppa', 'Phoca hispida ssp. saimensis', 'vertebrates', 39, 'Look for the rounded seal form and patterned coat.'),
  species('metsamyyra', 'Metsämyyrä', 'Myodes glareolus', 'vertebrates', 40, 'Compare the short tail and compact vole shape.'),
  species('metsahiiri', 'Metsähiiri', 'Apodemus flavicollis', 'vertebrates', 41, 'Look for the longer tail and large ears.'),
  species('karppa', 'Kärppä', 'Mustela erminea', 'vertebrates', 43, 'A slender mustelid; the coat changes with the season.'),
  species('sammakko', 'Sammakko', 'Rana temporaria', 'vertebrates', 45, 'A familiar frog with a compact body and long hind legs.'),
  species('rupikonna', 'Rupikonna', 'Bufo bufo', 'vertebrates', 46, 'Look for the warty skin and stockier body.'),
  species('sisilisko', 'Sisilisko', 'Zootoca vivipara', 'vertebrates', 48, 'A small lizard with a long tail and four legs.'),
  species('kyy', 'Kyy', 'Vipera berus', 'vertebrates', 49, 'Look for the zig-zag pattern and short, thick body.'),
  species('rantakaarme', 'Rantakäärme', 'Natrix natrix', 'vertebrates', 50, 'A slender snake with a lighter collar behind the head.')
];

// The PDFs contain 202 extracted photographs. Keep one canonical entry per
// named species for study mode, then turn every photograph into its own quiz
// card so the complete source image set is testable.
const ASSET_QUESTIONS = SPECIES.flatMap((item) => item.images.map((image, index) => ({
  ...item,
  id: `${item.id}-asset-${index + 1}`,
  baseId: item.id,
  images: [image],
  variant: index + 1
})));

// This is a comparison photograph from vertebrates PDF page 42. It shows the
// two small mammals being compared on that page rather than a single species.
const COMPARISON_QUESTION = {
  id: 'metsamyyra-metsahiiri-comparison-asset-1',
  baseId: 'metsamyyra',
  name: 'Metsämyyrä / metsähiiri',
  scientific: 'Myodes glareolus / Apodemus flavicollis',
  category: 'vertebrates',
  sourceFile: SOURCE_FILES.vertebrates,
  page: 42,
  images: ['assets/vertebrates-p42-i1.jpg'],
  hint: 'This source photograph is used for the PDF comparison of metsämyyrä and metsähiiri.',
  aliases: ['metsämyyrä', 'metsähiiri'],
  group: true,
  variant: 1
};

const QUESTION_BANK = [...ASSET_QUESTIONS, COMPARISON_QUESTION];
const QUESTION_BANK_SIZE = QUESTION_BANK.length;
