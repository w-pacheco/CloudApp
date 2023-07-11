/**
 * Form.Fields.js
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
    
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export default class Fields {

    constructor (Element){
        this.Element = Element;
    }

    querySelector(queryString){
        return this.Element.querySelector(queryString);
    }

    get(arg){
        const fields = [
            Array.from(this.Element), 
            Array.from(this.Element.querySelectorAll('div[contenteditable="true"]')),
        ]
        .flat();

        if (!arg) return fields;
        else return this.Element.querySelector(arg);
    }

    /**
     * focus
     * @description By default the method will focus on the first field.
     * @param {String} arg string name of the field to focus on.
     */
    focus(arg){
        /** FIXME: This is not working. */
        const fields = this.get();
        if (!arg && fields.length) setTimeout(function(){
            fields[0].focus();
        }, 600);
    }

    validate(){

        const valid = this.Element.checkValidity();
        this.Element.classList.add('was-validated');

        if (!valid)
        {
            Array.from(this.Element)
            .map(function(el){

                const {
                    badInput,
                    customError,
                    patternMismatch,
                    rangeOverflow,
                    rangeUnderflow,
                    stepMismatch,
                    typeMismatch,
                    tooLong,
                    tooShort,
                    // valid,
                    valueMissing,
                } = el.validity;

                const validity_state = {
                    badInput,
                    customError,
                    patternMismatch,
                    rangeOverflow,
                    rangeUnderflow,
                    stepMismatch,
                    typeMismatch,
                    tooLong,
                    tooShort,
                    // valid,
                    valueMissing,
                };

                let invalidCustom;
                if (el.dataset.invalidCustom) invalidCustom = el.dataset.invalidCustom;

                Object.entries(validity_state)
                .forEach(item => {
                    try {
                        const value = item[1];
                        if (value) el.parentNode.querySelector('div.invalid-feedback').innerText = `${
                            invalidCustom || camelcaseToSentenceCaseText(item[0])
                        }!`;
                    }
                    catch(e) {}
                });

            });
        }

        return valid;
    }
    
}