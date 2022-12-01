use borsh::{BorshDeserialize, BorshSerialize};
use solana_program:: {
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,
};

use crate::calculator_instructions::CalculatorInstructions;

mod calculator_instructions;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Calculator { 
    pub value: u32,
}
entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let account_iter = &mut accounts.iter();
    let account = next_account_info(account_iter)?;

    if account.owner != program_id {
        msg!("Account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    msg!("--------------------------------------");
    msg!("Debug output:");
    msg!("Account ID: {}", account.key);
    msg!("Executable?: {}", account.executable);
    msg!("Lamports: {:#?}", account.lamports);
    msg!("Debug output complete.");
    msg!("--------------------------------------");
    msg!("calculator value...");

    let mut calculator = Calculator::try_from_slice(&account.data.borrow())?;
    let calculator_instructions = CalculatorInstructions::try_from_slice(&instruction_data)?;
    calculator.value = calculator_instructions.evaluate(calculator.value);
    calculator.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!("Value is now: {}", calculator.value);
    Ok(())
}
