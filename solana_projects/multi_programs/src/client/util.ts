import {Keypair} from '@solana/web3.js';
import fs from 'mz/fs';
import {Buffer} from 'buffer';
import * as BufferLayout from '@solana/buffer-layout';

  
export async function createKeypairFromFile(
    filePath: string,
): Promise<Keypair> {
    const secretKeyString = await fs.readFile(filePath, {encoding: 'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
}

export async function getStringForInstruction(operation: number, operating_value: number) {
    if (operation == 0) {
        return "reset the example.";
    } else if (operation == 1) {
        return `add: ${operating_value}`;
    } else if (operation == 2) {
        return `subtract: ${operating_value}`;
    } else if (operation == 3) {
        return `multiply by: ${operating_value}`;
    }
}

export async function createCalculatorInstructions(
    operation: number,
    operating_value: number
): Promise<Buffer> {
    const calculator_instructions_struct: BufferLayout.Structure<any> = BufferLayout.struct([
        BufferLayout.u32('operation'),
        BufferLayout.u32('operating_value'),
    ]);
    
    const buffer = Buffer.alloc(calculator_instructions_struct.span)
    calculator_instructions_struct.encode({
        operation: operation,
        operating_value: operating_value
    }, buffer)
    return buffer
}