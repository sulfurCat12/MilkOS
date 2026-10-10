import ollama from 'ollama';
import fs from 'fs';

import messageFactory from './messageFactory.js';

const corePath = "./src/llm";
const profilePath = JSON.parse(fs.readFileSync(`${corePath}/profile.json`, 'utf8'));
const systemPath = `${corePath}/system.txt`;

async function trigger(prompt) {
    let conversation = [];

    console.log(`userInput: ${prompt}\n( Processing . . . )`);

    const response = await ollama.chat({
        model: 'llama3.2:3b',
        messages: [
            messageFactory.createSystem(systemPath),
            messageFactory.createSystemRole(profilePath),
            messageFactory.createUser(prompt)
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

    conversation.push(messageFactory.createUser(prompt));
    conversation.push({
        role: 'assistant',
        content: response.message.content
    });

    fs.writeFileSync(userConversationPath, JSON.stringify(conversation, null, 2), 'utf8');

    return response.message.content;
}

trigger("okay").then(response => {
    console.log(`Response: ${response}`)
});