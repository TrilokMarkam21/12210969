const { customAlphabet } = require('nanoid');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);


module.exports = async (Url , CustomCode) => {
    if (CustomCode) {
        const existingUrl = await Url.findOne({ ShortCode: CustomCode });
        if (exists) {
            throw new Error('Custom code already exists');
        }
        return CustomCode;
    }

    let Code, exists;
    do {
        Code = nanoid();
        exists = await Url.findOne({ Shortcode: Code });
    } while (exists);
    return Code;
};