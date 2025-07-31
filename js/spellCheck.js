/**
 * Spell checks text
 * @param {string} text - Text to spell check
 * @returns {Promise<string>} - Returns corrected text
 * @throws {Error} - Throws error if request fails or response is invalid
 */
const spellCheck = async (inputMd) => {
    if (typeof inputMd !== 'string' || !inputMd.trim()) {
        throw new Error('Invalid input: text must be a non-empty string');
    }

    const { text, placeholders } = extractCodeBlocks(inputMd);

    const payload = new FormData();
    payload.append('text', text);

    try {
        const response = await fetch('?module=tasks&action=ai', {
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

        if (data?.status === 'ok' && data.data?.content) {
            const restored = restoreCodeBlocks(data.data.content, placeholders);
            const formated = data.data.format_content;
            return { restored, formated };
        }

        if (data.errors?.error_description) {
            const errorContainer = document.querySelector('.t-errors-block');
            if (!errorContainer) return;
            errorContainer.innerHTML = `<span style="color: red;"><br>${data.errors.error_description}</span>`;
            setTimeout(() => {
                errorContainer.innerHTML = '';
            }, 3000);
        }

        console.log('Invalid response format from server', data);
        throw new Error('Invalid response format from server');
    } catch (error) {
        console.error('Spell check failed:', error);
        throw new Error(`Spell check service unavailable: ${error.message}`);
    }

    function extractCodeBlocks (mdText) {
        const placeholders = [];
        let placeholderIndex = 0;

        // Replace ```...```
        mdText = mdText.replace(/```([\s\S]*?)```/g, (_, code) => {
            const key = `__BLOCK_PLACEHOLDER_${placeholderIndex}__`;
            placeholders.push({ key, content: `\`\`\`${code}\`\`\`` });
            placeholderIndex++;
            return key;
        });

        // Replace `...`
        mdText = mdText.replace(/`([^`\n]+?)`/g, (_, code) => {
            const key = `__INLINE_PLACEHOLDER_${placeholderIndex}__`;
            placeholders.push({ key, content: `\`${code}\`` });
            placeholderIndex++;
            return key;
        });

        // Replace quotes > ...
        mdText = mdText.replace(/(^>.*(?:\n>.*)*)/gm, (quote) => {
            const key = `__QUOTE_PLACEHOLDER_${placeholderIndex}__`;
            placeholders.push({ key, content: quote });
            placeholderIndex++;
            return key;
        });

        // Replace mentions
        mdText = mdText.replace(/(@\w+)/g, (mention) => {
            const key = `__MENTION_PLACEHOLDER_${placeholderIndex}__`;
            placeholders.push({ key, content: mention });
            placeholderIndex++;
            return key;
        });

        // Replace tags
        mdText = mdText.replace(/(#\w+)/g, (hashtag) => {
            const key = `__HASHTAG_PLACEHOLDER_${placeholderIndex}__`;
            placeholders.push({ key, content: hashtag });
            placeholderIndex++;
            return key;
        });

        return { text: mdText, placeholders };
    }

    function restoreCodeBlocks (processedText, placeholders) {
        let restored = processedText;
        for (const { key, content } of placeholders) {
            restored = restored.replace(key, content);
        }
        return restored;
    }
};

window.spellCheck = spellCheck;