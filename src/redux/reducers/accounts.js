import {
	ACCOUNTS_UPDATE_ACCOUNT,
	SET_ACCOUNT_TYPES,
	SET_ACCOUNTS,
	ACCOUNTS_SET_ACCOUNT_USERS,
	SET_CURRENT_ACCOUNT_ID,
	SET_IS_SWITCHING_ACCOUNTS,
	SET_CURRENT_ACCOUNT,
	EDIT_ACCOUNT_ACCOUNT_USERS_LOADING,
	SET_ACCOUNT_SAVING
} from '../action-types/accounts'
import {
	findAccountNodeByAccountId,
	markAllAccountsAsCurrentFalse
} from '../../utils'

export function accounts(state = [], action) {
	switch (action.type) {
		case SET_ACCOUNTS:
			return action.accounts
		case SET_CURRENT_ACCOUNT:
			let newAccounts = JSON.parse(JSON.stringify(state.data))
			markAllAccountsAsCurrentFalse(newAccounts)
			let account = findAccountNodeByAccountId(action.accountId, newAccounts)
			account.current = true
			let accounts = { data: newAccounts }
			return accounts
		case ACCOUNTS_SET_ACCOUNT_USERS:
			let stateCopy = []
			if (state.data && state.data.length > 0) {
				stateCopy = JSON.parse(JSON.stringify(state.data))
			}
			// for (const account of stateCopy) {
			let accountNode = findAccountNodeByAccountId(
				action.payload.accountId,
				stateCopy
			)
			accountNode.users = action.payload.users
			// }
			let newAccountState = { data: stateCopy }
			return newAccountState
		case ACCOUNTS_UPDATE_ACCOUNT:
			let accountsCopy = []
			if (state.data && state.data.length > 0) {
				accountsCopy = JSON.parse(JSON.stringify(state.data))
			}
			// for (const account of stateCopy) {
			let copyAccount = findAccountNodeByAccountId(
				action.account.accountId,
				accountsCopy
			)
			copyAccount.accountMargin = action.account.accountMargin
			copyAccount.accountName = action.account.accountName
			copyAccount.accountTypeId = action.account.accountTypeId
			copyAccount.accountTypeName = action.account.accountTypeName
			copyAccount.contactEmail = action.account.contactEmail
			copyAccount.contactName = action.account.contactName
			// }
			let newState = { data: accountsCopy }
			return newState
		default:
			return state
	}
}

export function editAccountAccountUsersLoading(state = true, action) {
	switch (action.type) {
		case EDIT_ACCOUNT_ACCOUNT_USERS_LOADING:
			return action.editAccountAccountUsersLoading
		default:
			return state
	}
}

export function currentAccountId(state = '', action) {
	switch (action.type) {
		case SET_CURRENT_ACCOUNT_ID:
			return action.accountId
		default:
			return state
	}
}

export function isSwitchingAccounts(state = false, action) {
	switch (action.type) {
		case SET_IS_SWITCHING_ACCOUNTS:
			return action.isSwitchingAccounts
		default:
			return state
	}
}

export function accountSaving(state = false, action) {
	switch (action.type) {
		case SET_ACCOUNT_SAVING:
			return action.accountSaving
		default:
			return state
	}
}
