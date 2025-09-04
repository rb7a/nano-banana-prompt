import type { ParsedCase } from '@/types/prompt'

export function parseReadmeContent(content: string): ParsedCase[] {
    const cases: ParsedCase[] = []

    try {
        // Find all case sections using a more flexible approach
        const casePattern = /### 案例 (\d+)：(.+?) \(by (.+?)\)([\s\S]*?)(?=### 案例 \d+：|$)/g

        let match
        while ((match = casePattern.exec(content)) !== null) {
            const [, caseNumber, title, author, sectionContent] = match

            // Extract source URL
            const sourceMatch = sectionContent.match(/\[原文链接\]\((.+?)\)/)
            const sourceUrl = sourceMatch ? sourceMatch[1] : ''

            // Extract images from table
            const imageMatches = sectionContent.match(/<img src="([^"]+)"/g)
            let geminiImage = ''
            let gpt4oImage = ''

            if (imageMatches && imageMatches.length >= 1) {
                const firstImgMatch = imageMatches[0].match(/src="([^"]+)"/)
                if (firstImgMatch) geminiImage = firstImgMatch[1]

                if (imageMatches.length >= 2) {
                    const secondImgMatch = imageMatches[1].match(/src="([^"]+)"/)
                    if (secondImgMatch) gpt4oImage = secondImgMatch[1]
                }
            }

            // Extract prompt
            const promptMatch = sectionContent.match(/\*\*提示词\*\*\s*```\s*([\s\S]*?)\s*```/)
            const prompt = promptMatch ? promptMatch[1].trim() : ''

            // Only add if we have essential data
            if (caseNumber && title && prompt) {
                cases.push({
                    caseNumber: parseInt(caseNumber),
                    title: title.trim(),
                    author: cleanAuthor(author.trim()),
                    sourceUrl: sourceUrl.trim(),
                    geminiImage: geminiImage.trim(),
                    gpt4oImage: gpt4oImage.trim(),
                    prompt: prompt
                })
            }
        }
    } catch (error) {
        console.error('Error parsing README content:', error)
    }

    // If no cases found, return sample data
    if (cases.length === 0) {
        console.log('No cases parsed from README, using sample data')
        return getSampleData()
    }

    console.log(`Parsed ${cases.length} cases from README`)
    return cases
}

function cleanAuthor(author: string): string {
    // Remove @ symbols and brackets
    return author.replace(/[@\[\]]/g, '').trim()
}

function getSampleData(): ParsedCase[] {
    return [
        {
            caseNumber: 100,
            title: '实物与手绘涂鸦创意广告',
            author: 'azed_ai',
            sourceUrl: 'https://x.com/azed_ai/status/1923016036120658122',
            geminiImage: 'https://bibigpt-apps.chatvid.ai/chatimg/gemini-Bt055iW47OUqRDOh-K0gZ.png?v=1',
            gpt4oImage: 'https://cdn.jsdelivr.net/gh/jamez-bondos/awesome-gpt4o-images/cases/100/creative-ad-real-object-hand-drawn-doodle.png',
            prompt: '一则简约且富有创意的广告，设置在纯白背景上。一个真实的 [真实物体] 与手绘黑色墨水涂鸦相结合，线条松散而俏皮。涂鸦描绘了：[涂鸦概念及交互：以巧妙、富有想象力的方式与物体互动]。在顶部或中部加入粗体黑色 [广告文案] 文字。在底部清晰放置 [品牌标志]。视觉效果应简洁、有趣、高对比度且构思巧妙。'
        },
        {
            caseNumber: 99,
            title: '黑白肖像艺术',
            author: 'ZHO_ZHO_ZHO',
            sourceUrl: 'https://x.com/ZHO_ZHO_ZHO/status/1922150692145283299',
            geminiImage: 'https://bibigpt-apps.chatvid.ai/chatimg/gemini-ameZsuCqj7Px_1-NLwLhj.png?v=1',
            gpt4oImage: 'https://cdn.jsdelivr.net/gh/jamez-bondos/awesome-gpt4o-images/cases/99/harry-potter-black-white-portrait-art.png',
            prompt: '高分辨率的黑白肖像艺术作品，采用编辑类和艺术摄影风格。背景呈现柔和渐变效果，从中灰过渡到近乎纯白，营造出层次感与寂静氛围。细腻的胶片颗粒质感为画面增添了一种可触摸的、模拟摄影般的柔和质地，让人联想到经典的黑白摄影。'
        },
        {
            caseNumber: 98,
            title: '磨砂玻璃后的虚实对比剪影',
            author: 'umesh_ai',
            sourceUrl: 'https://x.com/umesh_ai/status/1921487841634156999',
            geminiImage: 'https://bibigpt-apps.chatvid.ai/chatimg/gemini-pDsaB4o_oiNIjud_j5ypp.png?v=1',
            gpt4oImage: 'https://cdn.jsdelivr.net/gh/jamez-bondos/awesome-gpt4o-images/cases/98/blurred-silhouette-frosted-glass.png',
            prompt: '一张黑白照片，展示了一个[主体]在磨砂或半透明表面后的模糊剪影。其[部分]轮廓清晰，紧贴表面，与其余朦胧、模糊的身影形成鲜明对比。背景是柔和的灰色渐变色调，增强了神秘和艺术的氛围。'
        },
        {
            caseNumber: 97,
            title: '可爱温馨针织玩偶',
            author: 'ZHO_ZHO_ZHO',
            sourceUrl: 'https://x.com/ZHO_ZHO_ZHO/status/1921148024861938077',
            geminiImage: 'https://bibigpt-apps.chatvid.ai/chatimg/gemini-FpVTUFWK2dhd1GSysOFdh.png?v=1',
            gpt4oImage: 'https://cdn.jsdelivr.net/gh/jamez-bondos/awesome-gpt4o-images/cases/97/cute_cozy_knitted_doll.png',
            prompt: '一张特写、构图专业的照片，展示一个手工钩织的毛线玩偶被双手轻柔地托着。玩偶造型圆润，【上传图片】人物得可爱Q版形象，色彩对比鲜明，细节丰富。'
        },
        {
            caseNumber: 96,
            title: '定制动漫手办',
            author: 'dotey',
            sourceUrl: 'https://x.com/dotey/status/1920851135516082246',
            geminiImage: 'https://bibigpt-apps.chatvid.ai/chatimg/gemini-qVK6fm-fP8a4-LxpaN7Ji.png?v=1',
            gpt4oImage: 'https://cdn.jsdelivr.net/gh/jamez-bondos/awesome-gpt4o-images/cases/96/custom-anime-figure-from-photo.png',
            prompt: '生成一张摆放于桌面上的动漫风格手办照片，以日常随手用手机拍摄的轻松休闲视角呈现。手办模型以附件中人物照片为基础，精确还原照片中人物的全身姿势、面部表情以及服装造型，确保手办全身完整呈现。'
        },
        {
            caseNumber: 95,
            title: '自拍生成摇头娃娃',
            author: 'thisdudelikesAI',
            sourceUrl: 'https://x.com/thisdudelikesAI/status/1920433372243136730',
            geminiImage: 'https://bibigpt-apps.chatvid.ai/chatimg/gemini-eJzwap7e7KsSwJofY3ij8.png?v=1',
            gpt4oImage: 'https://cdn.jsdelivr.net/gh/jamez-bondos/awesome-gpt4o-images/cases/95/selfie-to-bobblehead-generator.png',
            prompt: '将这张照片变成一个摇头娃娃：头部稍微放大，保持面部准确，身体卡通化。[把它放在书架上]。'
        },
        {
            caseNumber: 94,
            title: '三只动物与地标自拍',
            author: 'berryxia_ai',
            sourceUrl: 'https://x.com/berryxia_ai/status/1920795648946782583',
            geminiImage: 'https://bibigpt-apps.chatvid.ai/chatimg/gemini-yAd6PqQMt86VX6Nh1QFCl.png?v=1',
            gpt4oImage: 'https://cdn.jsdelivr.net/gh/jamez-bondos/awesome-gpt4o-images/cases/94/three_animals_selfie_at_landmark.png',
            prompt: '三只[动物类型]在标志性[地标]前的特写自拍照，它们表情各异，拍摄于黄金时刻，采用电影般的灯光。动物们靠近镜头，头挨着头，模仿自拍姿势，展现出喜悦、惊讶和平静的表情。'
        },
        {
            caseNumber: 93,
            title: '玻璃质感重塑',
            author: 'egeberkina',
            sourceUrl: 'https://x.com/egeberkina/status/1920448389960909085',
            geminiImage: 'https://bibigpt-apps.chatvid.ai/chatimg/gemini-retry-QCdSAN2IyigyHVVplpXGL.png?v=1',
            gpt4oImage: 'https://cdn.jsdelivr.net/gh/jamez-bondos/awesome-gpt4o-images/cases/93/glass_retexturing.png',
            prompt: '对参考图片进行重新纹理化，基于下方的 JSON 美学定义。使用photorealistic 3D render风格，glass材质具有透明和彩虹色效果。'
        }
    ]
}
