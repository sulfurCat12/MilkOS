import fs from 'fs';

export default class messageFactory {
    static createSystem(systemPath) {
        return {
            role: 'system',
            content: fs.readFileSync(systemPath, 'utf-8').trim()
        };
    }

    static createSystemRole(profilePath) {
        return {
            role: 'system',
            content: `The name of the person you're currently talking with is ${profilePath.name}`
        };
    }

    static createUser(prompt) {
        return {
            role: 'user',
            content: prompt
        };
    }
}