import ollama from 'ollama';
import fs from 'fs';

const corePath = "./src/llm";
const profilePath = JSON.parse(fs.readFileSync(`${corePath}/profile.json`, 'utf8'));
const systemPath = `${corePath}/system.txt`;

async function trigger(prompt) {
    let conversation = [];

    const systemMessage = {
        role: 'system',
        content: fs.readFileSync(systemPath, 'utf-8').trim()
    };

    const messenger = {
        role: 'system',
        content: `The name of the person you're currently talking with is ${profilePath.name}`
    };

    const userMessage = {
        role: 'user',
        content: prompt
    };

    console.log("userInput: " + prompt);
    console.log("( Processing . . . )");

    const response = await ollama.chat({
        model: 'llama3.2:3b',
        messages: [
            systemMessage,
            messenger,
            userMessage
        ],
        options: {
            temperature: 0.9,
            top_p: 0.9
        }
    });

    const userConversationPath = `${corePath}/conversations/${profilePath.id}.json`;
    let conversations = [];

    if (fs.existsSync(userConversationPath)) {
        conversation = JSON.parse(
            fs.readFileSync(userConversationPath, 'utf8')
        );
    }

    conversation.push(userMessage);
    conversation.push({
        role: 'assistant',
        content: response.message.content
    });

    fs.writeFileSync(userConversationPath, JSON.stringify(conversation, null, 2), 'utf8');

    return response.message.content;
}

trigger("Hence and so forth you can just call me sulfur lol").then(response => {
    console.log("Response: " + response);
});