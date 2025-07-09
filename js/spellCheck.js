/**
 * Spell checks text
 * @param {string} text - Text to spell check
 * @returns {Promise<string>} - Returns corrected text
 * @throws {Error} - Throws error if request fails or response is invalid
 */
const spellCheck = async (text) => {
    if (typeof text !== 'string' || !text.trim()) {
        throw new Error('Invalid input: text must be a non-empty string');
    }

    const payload = new FormData();
    payload.append('text', text.trim());

    try {
        const response = await fetch('/webasyst/tasks/?module=tasks&action=ai', {
            method: 'POST',
            body: payload,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data?.status === 'ok' && data.data?.response?.content) {
            return data.data.response.content;
        }
        
        throw new Error('Invalid response format from server');
    } catch (error) {
        console.error('Spell check failed:', error);
        throw new Error(`Spell check service unavailable: ${error.message}`);
    }
};

window.spellCheck = spellCheck;