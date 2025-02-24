const generateTimestamp = () => {
    const date = new Date()
    return `${date.getUTCFullYear()}_${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0')}_${date
        .getUTCDate()
        .toString()
        .padStart(2, '0')}_${date
        .getUTCHours()
        .toString()
        .padStart(2, '0')}_${date
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')}_${date
        .getUTCSeconds()
        .toString()
        .padStart(2, '0')}_${date
        .getUTCMilliseconds()
        .toString()
        .padStart(3, '0')}`
}

const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
    };

export {
    generateTimestamp,
    convertFileToBase64,
}