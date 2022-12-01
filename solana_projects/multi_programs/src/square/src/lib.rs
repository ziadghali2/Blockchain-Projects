use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    program_error::ProgramError,
};

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct MathStuffSquare {
    pub square: u32,
}

entrypoint!(process_instruction);

fn process_instruction(program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {
    
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
    msg!("Squaring value...");

    let mut math_stuff = MathStuffSquare::try_from_slice(&account.data.borrow())?;
    math_stuff.square = math_stuff.square.pow(2);
    math_stuff.serialize(&mut &mut account.data.borrow_mut()[..])?;
    
    msg!("Current sum is now: {}", math_stuff.square);
    Ok(())
}

