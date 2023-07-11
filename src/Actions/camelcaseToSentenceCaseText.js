/**
 * camelcaseToSentenceCaseText.js
 * @author Wilfredo Pacheco
 */

/**
 * camelcaseToSentenceCaseText
 * @param {String} text arg passed to be parsed based on camelcase characters
 * @returns string reformated by spacing out based on camelcase characters
 */
export function camelcaseToSentenceCaseText(text){

    /** Make sure the text passed is a valid String; */
    if (typeof text !== 'string' 
    && text !== '') return console.info(`${text} is not of type String!`);

    /** Handle the fact the text passed might be an acronym; */
    const firstLetter = text.charAt(0);
    const secondLetter = text.charAt(1);
    const thirdLetter = text.charAt(2);

    let exempt = false;
    if (firstLetter === firstLetter.toUpperCase() 
    && secondLetter === secondLetter.toUpperCase() 
    && thirdLetter === thirdLetter.toUpperCase()) exempt = true;

    const result = text.replace(/([A-Z])/g, " $1");
    if (!exempt) return result.charAt(0).toUpperCase() + result.slice(1);
    else if (exempt) return text;
}