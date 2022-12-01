use {
    std::convert::TryInto,
    solana_program::{
        account_info::{
            next_account_info,
            AccountInfo
        },
        entrypoint,
        entrypoint::ProgramResult,
        msg,
        program::invoke,
        program_error::ProgramError,
        pubkey::Pubkey,
        system_instruction,
    },
};

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    input: &[u8],
) -> ProgramResult {
    
    let account_iter = &mut accounts.iter();
    let payer = next_account_info(account_iter)?;
    let payee = next_account_info(account_iter)?;
    
    let amount = input.get(..8).and_then(|value| value.try_into().ok()).map(u64::from_le_bytes).ok_or(ProgramError::InvalidInstructionData)?;

    msg!("Receive request to transfer {:?} lamports from {:?} to {:?}", amount, payer.key, payee.key);
    msg!("  Processing transfer...");

    // transfer amount
    invoke(
        &system_instruction::transfer(payer.key, payee.key, amount), 
        &[payer.clone(), payee.clone()]
    )?;
    msg!("Transfer completed successfully.");
    
    Ok(())
}