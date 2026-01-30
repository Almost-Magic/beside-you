export interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  plainExplanation: string;
  doctorMightSay?: string[];
  youCanAsk?: string[];
  relatedTerms: string[];
  category: 'diagnosis' | 'treatment' | 'side-effect' | 'procedure' | 'anatomy' | 'test' | 'general';
}

// Sample glossary terms - in production this would be the full 1,499 terms
export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'metastatic',
    term: 'Metastatic',
    pronunciation: 'meh-tah-STAT-ik',
    plainExplanation: "When cancer has spread from where it started to another part of the body. For example, breast cancer that spreads to the bones is still breast cancer — it's called 'metastatic breast cancer'. This changes treatment options but doesn't mean treatment isn't possible.",
    doctorMightSay: ['The cancer has metastasised', 'We found metastatic disease', 'There are metastases in the liver'],
    youCanAsk: ['What does this mean for my treatment options?', 'Is the cancer still treatable?', 'How will this affect my prognosis?'],
    relatedTerms: ['primary-cancer', 'secondary-cancer', 'stage-4'],
    category: 'diagnosis',
  },
  {
    id: 'chemotherapy',
    term: 'Chemotherapy',
    pronunciation: 'kee-moh-THER-uh-pee',
    plainExplanation: "Chemotherapy uses medicines to kill cancer cells or stop them from growing. It can be given as tablets, injections, or through a drip into your vein. It travels through your whole body, which is why it can cause side effects in areas that don't have cancer.",
    doctorMightSay: ['We recommend a course of chemo', "You'll have six cycles of chemotherapy", 'This is a systemic treatment'],
    youCanAsk: ['What side effects should I expect?', 'How long will each treatment take?', 'Will I be able to work during treatment?'],
    relatedTerms: ['cycle', 'infusion', 'neutropenia', 'anti-nausea'],
    category: 'treatment',
  },
  {
    id: 'oncologist',
    term: 'Oncologist',
    pronunciation: 'on-KOL-oh-jist',
    plainExplanation: 'A doctor who specialises in treating cancer. There are different types: medical oncologists (who use chemotherapy and other drugs), radiation oncologists (who use radiation therapy), and surgical oncologists (who perform surgery to remove cancer).',
    doctorMightSay: ['Your oncologist will discuss treatment options', "We'll refer you to an oncologist"],
    youCanAsk: ['What type of oncologist will I be seeing?', 'Will I have the same oncologist throughout my treatment?'],
    relatedTerms: ['medical-oncologist', 'radiation-oncologist', 'haematologist'],
    category: 'general',
  },
  {
    id: 'biopsy',
    term: 'Biopsy',
    pronunciation: 'BY-op-see',
    plainExplanation: "A procedure where a small sample of tissue is taken from your body to be examined under a microscope. This helps doctors find out if there's cancer and what type it is. There are different types of biopsies depending on where the tissue is taken from.",
    doctorMightSay: ["We need to do a biopsy", "The biopsy results show...", "It's a simple procedure"],
    youCanAsk: ['How is the biopsy done?', 'Will it hurt?', 'When will I get the results?', 'What happens after the biopsy?'],
    relatedTerms: ['pathology', 'tissue-sample', 'needle-biopsy'],
    category: 'procedure',
  },
  {
    id: 'radiation-therapy',
    term: 'Radiation Therapy',
    pronunciation: 'ray-dee-AY-shun THER-uh-pee',
    plainExplanation: 'A treatment that uses high-energy rays (similar to X-rays but much stronger) to kill cancer cells. The radiation is carefully targeted at the cancer while trying to protect healthy tissue. You might also hear it called radiotherapy.',
    doctorMightSay: ["We recommend radiation", "You'll have radiotherapy after surgery", 'The radiation oncologist will plan your treatment'],
    youCanAsk: ['How many sessions will I need?', 'What side effects should I expect?', 'Will I be radioactive afterwards?'],
    relatedTerms: ['radiotherapy', 'radiation-oncologist', 'simulation'],
    category: 'treatment',
  },
  {
    id: 'staging',
    term: 'Staging',
    pronunciation: 'STAY-jing',
    plainExplanation: "The process doctors use to find out how much cancer is in your body and where it is. Stages usually go from 1 to 4, with higher numbers meaning the cancer has spread more. Knowing the stage helps your team plan the best treatment.",
    doctorMightSay: ["We need to stage the cancer", "It's stage 2", "The staging shows..."],
    youCanAsk: ['What stage is my cancer?', 'What does this stage mean for treatment?', 'How was the stage determined?'],
    relatedTerms: ['tnm', 'grade', 'prognosis'],
    category: 'diagnosis',
  },
  {
    id: 'remission',
    term: 'Remission',
    pronunciation: 'rih-MISH-un',
    plainExplanation: "When cancer has reduced or disappeared completely after treatment. In 'partial remission', the cancer has shrunk but is still there. In 'complete remission', no cancer can be detected. Remission doesn't always mean cured, which is why follow-up care is important.",
    doctorMightSay: ["You're in remission", 'The scans show complete remission', "We'll continue monitoring"],
    youCanAsk: ['Is this complete or partial remission?', 'What follow-up care will I need?', 'What are the chances of the cancer coming back?'],
    relatedTerms: ['response', 'recurrence', 'follow-up'],
    category: 'diagnosis',
  },
  {
    id: 'fatigue',
    term: 'Fatigue',
    pronunciation: 'fuh-TEEG',
    plainExplanation: "Extreme tiredness that doesn't go away with rest. Cancer-related fatigue is different from normal tiredness — it can feel overwhelming and make even simple tasks feel impossible. It's one of the most common side effects of cancer and its treatment.",
    doctorMightSay: ['Fatigue is a common side effect', 'Many patients experience fatigue', "Let us know if the fatigue is affecting your daily life"],
    youCanAsk: ['Is there anything I can do to help with fatigue?', 'Will the fatigue get better after treatment?', 'Should I be resting or staying active?'],
    relatedTerms: ['anaemia', 'energy-levels', 'rest'],
    category: 'side-effect',
  },
  {
    id: 'nausea',
    term: 'Nausea',
    pronunciation: 'NAW-zee-uh',
    plainExplanation: 'Feeling sick to your stomach, like you might vomit. Many cancer treatments can cause nausea, but there are very good medications (called anti-emetics) that can help prevent or reduce it. Tell your care team if you feel nauseous — they can help.',
    doctorMightSay: ["You might experience some nausea", "We'll give you anti-nausea medication", 'Let us know if the nausea is severe'],
    youCanAsk: ['What can I do if I feel nauseous?', 'When should I take the anti-nausea medication?', 'Are there foods that might help?'],
    relatedTerms: ['anti-emetic', 'vomiting', 'appetite'],
    category: 'side-effect',
  },
  {
    id: 'immunotherapy',
    term: 'Immunotherapy',
    pronunciation: 'im-yoo-noh-THER-uh-pee',
    plainExplanation: "A type of treatment that helps your own immune system fight cancer. Instead of directly killing cancer cells like chemotherapy does, it 'teaches' your immune system to recognise and attack them. It's becoming an important treatment for many cancer types.",
    doctorMightSay: ['Immunotherapy might be an option', "You'll receive checkpoint inhibitors", 'Your cancer responds well to immunotherapy'],
    youCanAsk: ['Is immunotherapy right for my type of cancer?', 'What side effects are different from chemotherapy?', 'How long will I need treatment?'],
    relatedTerms: ['checkpoint-inhibitor', 'immune-system', 'pd-1'],
    category: 'treatment',
  },
  {
    id: 'palliative-care',
    term: 'Palliative Care',
    pronunciation: 'PAL-ee-uh-tiv care',
    plainExplanation: "Specialised medical care focused on providing relief from symptoms and improving quality of life. Palliative care can be given alongside curative treatment — it's not just for end of life. It helps manage pain, nausea, fatigue, and emotional distress.",
    doctorMightSay: ["We'd like to involve the palliative care team", 'Palliative care can help with symptom management', 'This is about comfort and quality of life'],
    youCanAsk: ['Does this mean my cancer is incurable?', 'How will palliative care help me?', 'Will I still receive active treatment?'],
    relatedTerms: ['symptom-management', 'quality-of-life', 'hospice'],
    category: 'general',
  },
  {
    id: 'neutropenia',
    term: 'Neutropenia',
    pronunciation: 'noo-troh-PEE-nee-uh',
    plainExplanation: 'When your neutrophil count (a type of white blood cell) is low. Neutrophils help fight infection, so when they\'re low, you\'re more likely to get sick. Chemotherapy often causes this. Your team will monitor your blood counts and tell you when to be extra careful.',
    doctorMightSay: ['Your neutrophils are low', "You're neutropenic", 'Avoid crowds and sick people'],
    youCanAsk: ['What precautions should I take?', 'When will my counts recover?', 'What symptoms should I watch for?'],
    relatedTerms: ['white-blood-cells', 'infection-risk', 'blood-count'],
    category: 'side-effect',
  },
  {
    id: 'ct-scan',
    term: 'CT Scan',
    pronunciation: 'see-tee scan',
    plainExplanation: 'A type of X-ray that takes detailed pictures of the inside of your body from different angles. A computer combines these to create a 3D image. You might need to drink a special liquid or have dye injected to help certain areas show up more clearly.',
    doctorMightSay: ["We need a CT scan", 'The CT shows...', "It's like a detailed X-ray"],
    youCanAsk: ['Do I need to prepare for the scan?', 'How long does it take?', 'When will I get the results?'],
    relatedTerms: ['imaging', 'mri', 'pet-scan'],
    category: 'procedure',
  },
  {
    id: 'tumour-marker',
    term: 'Tumour Marker',
    pronunciation: 'TOO-mer MAR-ker',
    plainExplanation: 'Substances in your blood that can indicate cancer. They\'re made by cancer cells or by your body in response to cancer. Tumour markers are used to monitor how well treatment is working and to check for recurrence. Not all cancers have useful markers.',
    doctorMightSay: ['Your tumour markers have decreased', "We'll check your markers regularly", 'The CA-125 level is...'],
    youCanAsk: ['What do my tumour marker levels mean?', 'How often will they be checked?', 'Can markers be elevated for other reasons?'],
    relatedTerms: ['blood-test', 'ca-125', 'psa'],
    category: 'test',
  },
  {
    id: 'lymph-nodes',
    term: 'Lymph Nodes',
    pronunciation: 'limf nohdz',
    plainExplanation: 'Small, bean-shaped organs that are part of your immune system. They filter harmful substances and contain immune cells. Cancer can sometimes spread to nearby lymph nodes first, which is why doctors often check them. Swollen lymph nodes can also mean infection.',
    doctorMightSay: ['The lymph nodes are clear', 'We found cancer in one lymph node', "We'll remove some lymph nodes to test them"],
    youCanAsk: ['Why are my lymph nodes important?', 'What does it mean if cancer is in my lymph nodes?', 'Will removing lymph nodes cause problems?'],
    relatedTerms: ['lymphatic-system', 'sentinel-node', 'lymphoedema'],
    category: 'anatomy',
  },
];

// Categories for filtering
export const glossaryCategories = [
  { id: 'all', label: 'All Terms' },
  { id: 'diagnosis', label: 'Diagnosis' },
  { id: 'treatment', label: 'Treatment' },
  { id: 'side-effect', label: 'Side Effects' },
  { id: 'procedure', label: 'Procedures' },
  { id: 'test', label: 'Tests' },
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'general', label: 'General' },
];

export function searchGlossary(query: string, category?: string): GlossaryTerm[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  return glossaryTerms.filter((term) => {
    // Category filter
    if (category && category !== 'all' && term.category !== category) {
      return false;
    }
    
    // Empty query returns all (filtered by category)
    if (!normalizedQuery) return true;
    
    // Search in term, explanation, and related terms
    return (
      term.term.toLowerCase().includes(normalizedQuery) ||
      term.plainExplanation.toLowerCase().includes(normalizedQuery) ||
      term.relatedTerms.some(rt => rt.toLowerCase().includes(normalizedQuery))
    );
  });
}
