export type Ratings = {
    version: 'v1.0'
    target: {
        target_clarity: number | null
        target_achievement: number | null
        target_reasonableness: number | null
    }
    quality: {
        difficulty: number | null
        innovation: number | null
        basic_reliability: number | null
        skill_improvement: number | null
        reflection_improvement: number | null
    }
    weighted_value: number | null
    comment: string | null
}