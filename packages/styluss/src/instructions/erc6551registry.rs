use ethers::prelude::*;
use std::sync::Arc;
use std::fs::read_to_string;
use stylus_sdk::{Contract, ContractError};
use alloy_primitives::{Address, U256, H256};
use sha3::{Digest, Keccak256};

pub struct ERC6551RegistryContract {
    contract: Contract<Http>,
}

impl ERC6551RegistryContract {
    pub fn new(provider: Arc<Provider<Http>>, contract_address: Address) -> Self {
        let abi = read_to_string("./abi/ERC6551Registry.json")
            .expect("Failed to read ABI file");

        let contract = Contract::from_json(provider, contract_address, abi.as_bytes())
            .expect("Failed to load contract ABI");

        Self { contract }
    }

    pub async fn create_account(
        &self,
        implementation: Address,
        chain_id: U256,
        token_contract: Address,
        token_id: U256,
        salt: U256,
        init_data: Vec<u8>,
    ) -> Result<Address, Box<dyn std::error::Error>> {
        let code = self.get_creation_code(implementation, chain_id, token_contract, token_id, salt);
        let account_address = self.compute_address(salt, &code);

        // Check if the account already exists
        if self.account_exists(&account_address).await? {
            return Ok(account_address);
        }

        // Emit event (in Rust, you might log this instead)
        println!("AccountCreated: {:?}", account_address);

        // Create the account using create2
        let tx = self.contract
            .method::<_, Address>("createAccount", (implementation, chain_id, token_contract, token_id, salt, init_data))?
            .send()
            .await?;

        if tx.is_none() {
            return Err(Box::new(ContractError::Custom("AccountCreationFailed".into())));
        }

        // Initialize the account if init_data is provided
        if !init_data.is_empty() {
            let (success, result) = self.initialize_account(&account_address, init_data).await?;
            if !success {
                return Err(Box::new(ContractError::Custom(format!("Initialization failed: {:?}", result))));
            }
        }

        Ok(account_address)
    }

    fn get_creation_code(
        &self,
        implementation: Address,
        chain_id: U256,
        token_contract: Address,
        token_id: U256,
        salt: U256,
    ) -> Vec<u8> {
        let mut code = vec![
            0x3d, 0x60, 0xad, 0x80, 0x60, 0x0a, 0x3d, 0x39, 0x81, 0xf3, 0x36, 0x3d, 0x3d, 0x37, 0x3d, 0x3d, 0x3d, 0x36, 0x3d, 0x73,
        ];
        code.extend_from_slice(implementation.as_bytes());
        code.extend_from_slice(&[
            0x5a, 0xf4, 0x3d, 0x82, 0x80, 0x3e, 0x90, 0x3d, 0x91, 0x60, 0x2b, 0x57, 0xfd, 0x5b, 0xf3,
        ]);
        code.extend_from_slice(&abi::encode(&[salt.into(), chain_id.into(), token_contract.into(), token_id.into()]));
        code
    }

    fn compute_address(&self, salt: U256, code: &[u8]) -> Address {
        let mut hasher = Keccak256::new();
        hasher.update(&[0xff]);
        hasher.update(&self.contract.address().as_bytes());
        hasher.update(&salt.to_be_bytes());
        hasher.update(&Keccak256::digest(code));
        Address::from_slice(&hasher.finalize()[12..])
    }

    async fn account_exists(&self, account_address: &Address) -> Result<bool, Box<dyn std::error::Error>> {
        let code = self.contract.provider().get_code(*account_address, None).await?;
        Ok(!code.is_empty())
    }

    async fn initialize_account(&self, account_address: &Address, init_data: Vec<u8>) -> Result<(bool, Vec<u8>), Box<dyn std::error::Error>> {
        let result = self.contract
            .method::<_, (bool, Vec<u8>)>("initializeAccount", (account_address, init_data))?
            .call()
            .await?;
        Ok(result)
    }
}