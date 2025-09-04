import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Prompt, Category, ParsedCase } from '@/types/prompt'
import { parseReadmeContent } from '@/utils/dataParser'

export const usePromptsStore = defineStore('prompts', () => {
    const prompts = ref<Prompt[]>([])
    const categories = ref<Category[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const promptsByCategory = computed(() => {
        const grouped: Record<string, Prompt[]> = {}
        prompts.value.forEach(prompt => {
            if (!grouped[prompt.category]) {
                grouped[prompt.category] = []
            }
            grouped[prompt.category].push(prompt)
        })
        return grouped
    })

    // Actions
    const loadPrompts = async () => {
        if (prompts.value.length > 0) return // Already loaded

        isLoading.value = true
        error.value = null

        try {
            // 优先尝试从JSON文件加载数据
            let loadedFromJson = false
            try {
                const jsonResponse = await fetch('/prompts-data.json')
                if (jsonResponse.ok) {
                    const jsonData = await jsonResponse.json()
                    const processedPrompts = processJsonData(jsonData)

                    prompts.value = processedPrompts
                    categories.value = jsonData.categories.map((cat: any) => ({
                        ...cat,
                        promptCount: processedPrompts.filter(p => p.category === cat.name).length
                    }))

                    loadedFromJson = true
                    console.log(`✅ 从 JSON 文件加载了 ${prompts.value.length} 个提示词`)
                }
            } catch (jsonError) {
                console.log('JSON文件加载失败，回退到README.md解析')
            }

            // 如果JSON加载失败，回退到README.md解析
            if (!loadedFromJson) {
                const response = await fetch('/README.md')
                const content = await response.text()

                const parsedCases = parseReadmeContent(content)
                const processedPrompts = processParsedCases(parsedCases)

                prompts.value = processedPrompts
                categories.value = generateCategories(processedPrompts)

                console.log(`📖 从 README.md 解析了 ${prompts.value.length} 个提示词`)
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load prompts'
            console.error('Error loading prompts:', err)
        } finally {
            isLoading.value = false
        }
    }

    const getPromptsByCategory = (categoryId: string) => {
        return prompts.value.filter(prompt => prompt.category === categoryId)
    }

    const searchPrompts = (query: string) => {
        const lowercaseQuery = query.toLowerCase()
        return prompts.value.filter(
            prompt =>
                prompt.title.toLowerCase().includes(lowercaseQuery) ||
                prompt.content.toLowerCase().includes(lowercaseQuery) ||
                prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
                (prompt.author && prompt.author.toLowerCase().includes(lowercaseQuery))
        )
    }

    return {
        prompts,
        categories,
        isLoading,
        error,
        promptsByCategory,
        loadPrompts,
        getPromptsByCategory,
        searchPrompts
    }
})

// Helper functions
function processJsonData(jsonData: any): Prompt[] {
    return jsonData.cases.map((case_: any) => ({
        id: `case-${case_.caseNumber}`,
        title: case_.title,
        content: case_.prompt,
        category: case_.category,
        author: case_.author,
        sourceUrl: case_.sourceUrl,
        tags: case_.tags || [],
        images: {
            gemini: case_.images?.gemini,
            gpt4o: case_.images?.gpt4o
        },
        createdAt: new Date(case_.createdAt || Date.now()),
        updatedAt: new Date(case_.updatedAt || Date.now())
    }))
}

function processParsedCases(cases: ParsedCase[]): Prompt[] {
    return cases.map(case_ => ({
        id: `case-${case_.caseNumber}`,
        title: case_.title,
        content: case_.prompt,
        category: categorizePrompt(case_.title, case_.prompt),
        author: case_.author,
        sourceUrl: case_.sourceUrl,
        tags: extractTags(case_.title, case_.prompt),
        images: {
            gemini: case_.geminiImage,
            gpt4o: case_.gpt4oImage
        },
        createdAt: new Date(),
        updatedAt: new Date()
    }))
}

function categorizePrompt(title: string, content: string): string {
    const text = (title + ' ' + content).toLowerCase()

    if (text.includes('3d') || text.includes('立体') || text.includes('三维')) return '3D艺术'
    if (text.includes('动漫') || text.includes('卡通') || text.includes('anime')) return '动漫风格'
    if (text.includes('写实') || text.includes('摄影') || text.includes('照片')) return '写实摄影'
    if (text.includes('艺术') || text.includes('绘画') || text.includes('插画')) return '艺术插画'
    if (text.includes('创意') || text.includes('设计') || text.includes('广告')) return '创意设计'
    if (text.includes('可爱') || text.includes('萌') || text.includes('q版')) return '可爱风格'
    if (text.includes('未来') || text.includes('科幻') || text.includes('cyberpunk')) return '未来科幻'
    if (text.includes('复古') || text.includes('怀旧') || text.includes('vintage')) return '复古怀旧'
    if (text.includes('极简') || text.includes('简约') || text.includes('minimalist')) return '极简风格'
    if (text.includes('游戏') || text.includes('像素') || text.includes('game')) return '游戏风格'

    return '其他'
}

function extractTags(title: string, content: string): string[] {
    const tags: string[] = []
    const text = (title + ' ' + content).toLowerCase()

    const tagMap = {
        '3D': ['3d', '立体', '三维'],
        动漫: ['动漫', '卡通', 'anime'],
        写实: ['写实', '摄影', '照片'],
        艺术: ['艺术', '绘画', '插画'],
        创意: ['创意', '设计', '广告'],
        可爱: ['可爱', '萌', 'q版'],
        未来: ['未来', '科幻', 'cyberpunk'],
        复古: ['复古', '怀旧', 'vintage'],
        极简: ['极简', '简约', 'minimalist'],
        游戏: ['游戏', '像素', 'game']
    }

    Object.entries(tagMap).forEach(([tag, keywords]) => {
        if (keywords.some(keyword => text.includes(keyword))) {
            tags.push(tag)
        }
    })

    return tags
}

function generateCategories(prompts: Prompt[]): Category[] {
    const categoryMap: Record<string, { count: number; icon: string; description: string }> = {}

    prompts.forEach(prompt => {
        if (!categoryMap[prompt.category]) {
            categoryMap[prompt.category] = { count: 0, icon: getCategoryIcon(prompt.category), description: getCategoryDescription(prompt.category) }
        }
        categoryMap[prompt.category].count++
    })

    return Object.entries(categoryMap).map(([name, data]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: data.description,
        icon: data.icon,
        promptCount: data.count
    }))
}

function getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
        '3D艺术': '🎨',
        动漫风格: '🎭',
        写实摄影: '📸',
        艺术插画: '🖼️',
        创意设计: '💡',
        可爱风格: '🥰',
        未来科幻: '🚀',
        复古怀旧: '📻',
        极简风格: '⚪',
        游戏风格: '🎮',
        其他: '✨'
    }
    return iconMap[category] || '✨'
}

function getCategoryDescription(category: string): string {
    const descMap: Record<string, string> = {
        '3D艺术': '立体感强烈的三维艺术作品',
        动漫风格: '日系动漫和卡通风格图像',
        写实摄影: '逼真的摄影风格作品',
        艺术插画: '富有艺术感的插画作品',
        创意设计: '创意十足的设计作品',
        可爱风格: '萌系可爱的Q版作品',
        未来科幻: '充满科技感的未来主义作品',
        复古怀旧: '怀旧复古风格作品',
        极简风格: '简约清新的极简主义作品',
        游戏风格: '游戏相关的像素和概念艺术',
        其他: '其他风格的精彩作品'
    }
    return descMap[category] || '精彩的创意作品'
}
