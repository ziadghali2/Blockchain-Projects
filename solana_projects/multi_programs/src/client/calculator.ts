import * as math from './math';
import * as borsh from 'borsh';


class Calculator {
    value = 0

    constructor(fields: {value: number} | undefined = undefined) {
        if (fields) {
           this.value = fields.value;
        }
    }
}

const CALCULATOR_SCHEMA = new Map([
    [Calculator, {kind: 'struct', fields: [['value' , 'u32']]}]
]);

const MATH_STUFF_SIZE = borsh.serialize(CALCULATOR_SCHEMA, new Calculator()).length


async function main () {
   
    await math.example('calculator', MATH_STUFF_SIZE);
}

main().then(
    () => process.exit(),
    (err) => {
        console.log(err);
        process.exit(-1)
    }
);

