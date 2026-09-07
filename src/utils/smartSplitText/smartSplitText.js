function smartSplitText(message, maxLength = 4000) {
    if (message.length <= maxLength) return [message];
    
    const parts = [];
    let currentPart = '';
    
    // Разбиваем по строкам
    const lines = message.split('\n');
    
    for (const line of lines) {
        // Если строка длиннее лимита
        if (line.length > maxLength) {
            if (currentPart) {
                parts.push(currentPart.trim());
                currentPart = '';
            }
            
            // Разбиваем длинную строку по точкам и пробелам
            let remaining = line;
            while (remaining.length > maxLength) {
                let cutIndex = maxLength;
                // Ищем пробел или точку для разрыва
                const breakPos = remaining.lastIndexOf(' ', maxLength);
                if (breakPos > maxLength * 0.7) {
                    cutIndex = breakPos + 1;
                } else {
                    const dotPos = remaining.lastIndexOf('.', maxLength);
                    if (dotPos > maxLength * 0.7) {
                        cutIndex = dotPos + 1;
                    }
                }
                parts.push(remaining.slice(0, cutIndex).trim());
                remaining = remaining.slice(cutIndex).trim();
            }
            if (remaining) {
                parts.push(remaining);
            }
            continue;
        }
        
        // Проверяем, влезет ли строка в текущую часть
        if (currentPart.length + line.length + 1 <= maxLength) {
            currentPart += (currentPart ? '\n' : '') + line;
        } else {
            // Начинаем новую часть
            if (currentPart) {
                parts.push(currentPart.trim());
            }
            currentPart = line;
        }
    }
    
    if (currentPart) {
        parts.push(currentPart.trim());
    }
    
    return parts;
}

module.exports = { smartSplitText }