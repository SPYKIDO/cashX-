const fetch = require('node-fetch');

async function analyzeImage(imageUrl, apiKey) {
    try {
        const response = await fetch(imageUrl);
        const imageBuffer = await response.buffer();
        const base64Image = imageBuffer.toString('base64');

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const visionResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: "Analyze this image and describe what you see. If it's related to game servers, hosting, or technical issues, provide relevant information and suggestions."
                        },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!visionResponse.ok) {
            const errorData = await visionResponse.json();
            console.error('Vision API error details:', errorData);
            throw new Error(`Vision API error: ${visionResponse.status}`);
        }

        const result = await visionResponse.json();
        if (!result.candidates || result.candidates.length === 0) {
            return "I'm having trouble analyzing this image. Could you please describe what you're seeing?";
        }
        return result.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Image analysis error:', error);
        return "I'm having trouble analyzing this image. Could you please describe what you're seeing?";
    }
}

module.exports = { analyzeImage }; 