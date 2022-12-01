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
pub struct MathStuffSum {
    pub sum: u32,
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
    msg!("Adding 1 to sum...");


    let mut math_stuff = MathStuffSum::try_from_slice(&account.data.borrow())?;
    math_stuff.sum += 1;
    math_stuff.serialize(&mut &mut account.data.borrow_mut()[..])?;
    
    msg!("Current sum is now: {}", math_stuff.sum);
    Ok(())
}

