// TooNetic's brands all target the Thai market by default, even when a brand's seed data
// is thin/English (e.g. mission statements written in English). Without this, agents infer
// language purely from brand context and default to English for data-poor brands — this
// forces Thai output regardless of how much Thai text happens to be in the brand context.
export const THAI_LANGUAGE_RULE = 'Write all customer-facing text (captions, headlines, CTAs, taglines) in Thai (ภาษาไทย), even if the brand context above is written in English. Product/brand names stay in their original form (e.g. "ATLAS Guardian", "AMOS").'
