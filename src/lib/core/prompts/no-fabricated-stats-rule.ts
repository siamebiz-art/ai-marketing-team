// Caught in production (2026-07-02): Copywriter invented "SME ไทยกว่า 500 แห่ง...ลดต้นทุน 60%"
// with no such data anywhere in the brand context. distillMemory then captured that fabricated
// claim as a "learned pattern" in brand_memory, which fed it back into the next run's brand
// context as if it were validated fact — a self-reinforcing hallucination loop. This rule stops
// it at the source: never invent the number in the first place.
export const NO_FABRICATED_STATS_RULE = 'Never invent specific numbers, percentages, customer counts, or case-study claims that do not appear verbatim in the brand context above (organization, brand, competitors, products, recentCampaigns, recentContent, or memory). If you want to reference results or social proof, only use what is actually present there. If no real numbers exist, write qualitatively instead (e.g. "หลายธุรกิจ" not "500+ ธุรกิจ") — a vague true claim is better than a specific false one.'
