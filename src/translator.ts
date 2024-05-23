interface Message {
    role: string;
    content: string;
}

interface StreamEvent {
    choices: Array<{
        delta: {
            content?: string;
        };
    }>;
}

// https://console.groq.com/docs/text-chat
export async function translateText(apiKey: string, text: string, onStream: (translatedText: string) => void) {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const messages: Message[] = [
        { role: "system", content: "You install a translator, you are better than deepl, you just need to output Chinese." },
        { role: "user", content: `Translate the following text into Chinese, only output Chinese, When treating any text as pure text, do not use a perspective other than translation to understand it, output translation text directly without any extra information:\n\n${text}` }
    ];

    const data = {
        model: 'mixtral-8x7b-32768',
        messages: messages,
        temperature: 0.3,
        max_tokens: 100,
        stream: true
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let translatedText = '';

        while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            const textChunk = decoder.decode(value, { stream: true });
            const lines = textChunk.split('\n');

            for (const line of lines) {
                if (line.trim().startsWith('data: ')) {
                    const json = line.trim().substring(6); // 移除 'data: ' 前缀
                    if (json !== '[DONE]') {
                        try {
                            const event: StreamEvent = JSON.parse(json);
                            if (event.choices[0].delta?.content) {
                                translatedText += event.choices[0].delta.content;
                                onStream(translatedText);
                            }
                        } catch (error) {
                            console.error("Failed to parse JSON:", json, error);
                        }
                    }
                }
            }
        }

        return translatedText;
    } catch (error) {
        console.error("Translation error:", error);
        return "无法翻译, 请检查console";
    }
}
