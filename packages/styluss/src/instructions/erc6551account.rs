use alloy_primitives::{Address, U256};
use stylus_sdk::{Contract, ContractError};
use std::collections::HashMap;

struct ERC6551Account {
    owner: Address,
    locked: bool,
    permissions: HashMap<Address, bool>,
}

impl ERC6551Account {
    // Constructor
    pub fn new(owner: Address) -> Self {
        ERC6551Account {
            owner,
            locked: false,
            permissions: HashMap::new(),
        }
    }

    // Returns the owner of the account
    pub fn owner(&self) -> Address {
        self.owner.clone()
    }

    // Locks the account
    pub fn lock(&mut self) {
        self.locked = true;
    }

    // Unlocks the account
    pub fn unlock(&mut self) {
        self.locked = false;
    }

    // Checks if an address has permission to execute actions
    pub fn has_permission(&self, executor: &Address) -> bool {
        *self.permissions.get(executor).unwrap_or(&false)
    }

    // Adds a permission for an executor
    pub fn grant_permission(&mut self, executor: Address) {
        self.permissions.insert(executor, true);
    }

    // Executes a low-level call (can be customized for specific calls)
    pub fn execute_call(&self, data: Vec<u8>) -> Result<(), ContractError> {
        if self.locked {
            return Err(ContractError::Locked);
        }

        // Process the call data (example: a method to execute transactions)
        // In a real implementation, you'd decode `data` and process it
        Ok(())
    }

    // Handles incoming Ether (simplified for this example)
    pub fn receive(&self, value: U256) {
        // Handle received Ether here
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_erc6551_account() {
        let owner_address = Address::from([0x42; 20]);
        let mut account = ERC6551Account::new(owner_address);

        // Test owner method
        assert_eq!(account.owner(), owner_address);

        // Test permission granting
        let executor = Address::from([0x43; 20]);
        account.grant_permission(executor.clone());
        assert!(account.has_permission(&executor));

        // Test lock/unlock functionality
        account.lock();
        assert!(account.locked);
        account.unlock();
        assert!(!account.locked);
        // Test executing a call
        let data = vec![0x1, 0x2, 0x3]; // Example call data
        assert!(account.execute_call(data).is_ok());
    }
}
