#! /bin/bash

SOLANA_PROGRAMS=("transfer_sol")

case $1 in
    "reset")
        rm -rf ./node_modules
        for x in $(solana program show --programs | awk 'RP==0 {print $1}')
        do 
        if [[ $x != "Program" ]]
        then    
            solana program close "$x"
        fi
        done
    ;;
    "clean")
        rm -rf ./node_modules
        for program in "${SOLANA_PROGRAMS[@]}"
        do
            cargo clean --manifest-path=./src/"$program"/Cargo.toml
        done
    ;;
    "build")
        for program in "${SOLANA_PROGRAMS[@]}"
        do
            cargo build-bpf --manifest-path=./src/"$program"/Cargo.toml --bpf-out-dir=./dist/program
        done
    ;;
    "deploy")
        for program in "${SOLANA_PROGRAMS[@]}"
        do
            cargo build-bpf --manifest-path=./src/"$program"/Cargo.toml --bpf-out-dir=./dist/program
            solana program deploy dist/program/"$program".so
        done
    ;;
    "reset-and-build")
        npm run reset
        npm run clean
        npm run deploy
        npm install
        solana program show --programs
    ;;
    "generate-account-samples")
        solana-keygen new --no-bip39-passphrase -o ./accounts/george.json
        solana-keygen new --no-bip39-passphrase -o ./accounts/ringo.json
        solana-keygen new --no-bip39-passphrase -o ./accounts/paul.json
        solana-keygen new --no-bip39-passphrase -o ./accounts/john.json
    ;;
esac