import * as math from './math';
import * as borsh from 'borsh';


class MathStuffSquare {
    // parameters
    square = 0
    
    // init
    constructor(fields: {square: number} | undefined = undefined) {
        if (fields) {
            this.square = fields.square;
        }
    }
}

const MathStuffSquareSchema = new Map([
    [MathStuffSquare, {kind: 'struct', fields: [['square' , 'u32']]}],
]);

const MATH_STUFF_SIZE = borsh.serialize(MathStuffSquareSchema, new MathStuffSquare()).length;

async function main () {
    await math.example('square', MATH_STUFF_SIZE);
}

main().then(
    () => process.exit(),
    (err) => {
        console.log(err);
        process.exit(-1)
    }
);

