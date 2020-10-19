import {
	USERS_HAS_ERRORED,
	USERS_FETCH_DATA_SUCCESS,
	USER_DELETED,
	USER_DELETED_ERROR,
	USERS_REMOVE_USER,
	USERS_ADD_USER,
	USER_ADDED,
	USERS_IS_LOADING,
	USERS_SET_USER_ACCOUNTS,
	EDIT_USER_USER_ACCOUNTS_LOADING,
	USER_PROFILE_SAVED,
	USER_PROFILE_SAVING,
	USER_ADDING,
	USER_EDIT_SAVED,
	USER_EDIT_SAVING
} from '../action-types/users'
import { SET_ALERT } from '../action-types/auth'
import axios from '../../axiosConfig'
import config from '../../config.js'
import { accountsObjValidation, userObjValidation } from '../../schemas'
import { setUser } from './auth'

const apiBase = config.apiGateway.URL

export function usersHasErrored(bool) {
	return {
		type: USERS_HAS_ERRORED,
		hasErrored: bool
	}
}

export function userDeleted(bool) {
	return {
		type: USER_DELETED,
		userDeleted: bool
	}
}
export function setUserAdded(bool) {
	return {
		type: USER_ADDED,
		userAdded: bool
	}
}
export function userDeletedError(bool) {
	return {
		type: USER_DELETED_ERROR,
		userDeleted: bool
	}
}

export function usersFetchDataSuccess(users) {
	return {
		type: USERS_FETCH_DATA_SUCCESS,
		users
	}
}

export function usersIsLoading(bool) {
	return {
		type: USERS_IS_LOADING,
		usersIsLoading: bool
	}
}

export function userProfileSaving(bool) {
	return {
		type: USER_PROFILE_SAVING,
		userProfileSaving: bool
	}
}

export function userProfileSaved(bool) {
	return {
		type: USER_PROFILE_SAVED,
		userProfileSaved: bool
	}
}

export function setUserAdding(bool) {
	return {
		type: USER_ADDING,
		userAdding: bool
	}
}

export function setUserEditSaving(bool) {
	return {
		type: USER_EDIT_SAVING,
		userEditSaving: bool
	}
}

export function setUserEditSaved(bool) {
	return {
		type: USER_EDIT_SAVED,
		userEditSaved: bool
	}
}

export function setAlert(payload) {
	return { type: SET_ALERT, payload }
}

export function editUserUserAccountsLoading(bool) {
	return {
		type: EDIT_USER_USER_ACCOUNTS_LOADING,
		editUserUserAccountsLoading: bool
	}
}

export function usersFetchData(accountId) {
	let url = apiBase + `/account/${accountId}/users`
	return async (dispatch) => {
		try {
			let params = {
				roles: true
			}

			let result = []

			try {
				result = await axios.get(url, {
					params
				})
			} catch (error) {
				console.log(error)
			}

			dispatch(usersIsLoading(false))

			if (result.status === 200) {
				let users = { data: [] }
				for (const user of result.data) {
					// this can be deleted once single role is implemented in API
					addressUserRoles(user)
					// this can be deleted once single role is implemented in API

					users.data.push(user)
				}

				dispatch(usersFetchDataSuccess(users))
			}
		} catch (error) {
			alert(
				'Error on fetch users usersFetchData: ' + JSON.stringify(error, null, 2)
			)
		}
	}
}

function addressUserRoles(user) {
	let rolesCopy = JSON.parse(JSON.stringify(user.roles))
	let roleId = rolesCopy[0].roleId
	delete user.roles
	user.roleId = roleId
}

export function fetchUserAccounts(userId) {
	let url = apiBase + `/user/${userId}/accounts`
	return async (dispatch) => {
		dispatch(editUserUserAccountsLoading(true))
		try {
			let result = []

			try {
				result = await axios.get(url)
			} catch (error) {
				console.log(error)
			}

			if (result.status === 200) {
				accountsObjValidation.validate(result.data).catch(function(err) {
					console.log(err.name, err.errors)
					alert('Could not validate accounts data')
				})
				dispatch(usersSetUserAccounts(userId, result.data))
				dispatch(editUserUserAccountsLoading(false))
			}
		} catch (error) {
			alert('Error on fetch user accounts: ' + JSON.stringify(error, null, 2))
		}
	}
}

export function updateUserData(user) {
	let userId = user.userId
	let url = apiBase + `/user/${userId}`
	return async (dispatch) => {
		dispatch(userProfileSaving(true))
		dispatch(setUserEditSaving(true))
		try {
			let myUser = {
				userId: user.userId,
				firstName: user.firstName,
				lastName: user.lastName,
				company: user.company,
				email: user.email,
				userType: user.userType,
				roles: [],
				accounts: []
			}

			userObjValidation.validate(myUser).catch(function(err) {
				console.log(err.name, err.errors)
				alert('Could not validate new user')
			})
			delete myUser.accounts
			delete myUser.roles
			dispatch(setUser(myUser))
			const result = await axios.patch(url, myUser)
			if (result.status === 200) {
				dispatch(userProfileSaving(false))
				dispatch(userProfileSaved(true))
				dispatch(setUserEditSaving(false))
				dispatch(setUserEditSaved(true))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function updateUserRole(user, roleId) {
	//TODO: THIs can be deleted when API implements single role
	let roles = [{ roleId: roleId }]
	//TODO: THIs can be deleted when API implements single role
	let userId = user.userId
	let url = apiBase + `/user/${userId}/roles`
	return async (dispatch) => {
		try {
			const result = await axios.patch(url, roles)
			if (result.status === 200) {
				// dispatch(setUser(result.data.user));
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function updateUserAccounts(user, accounts) {
	if (accounts.length < 1) {
		alert(
			'User not saved. Each user must have at least one account assigned to them.'
		)
		return
	}

	let userId = user.userId
	let url = apiBase + `/user/${userId}/accounts`
	return async (dispatch) => {
		try {
			const result = await axios.patch(url, accounts)
			if (result.status === 200) {
				// dispatch(setUser(result.data.user));
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function usersRemoveUser(userId) {
	return {
		type: USERS_REMOVE_USER,
		userId
	}
}

export function usersAddUser(user) {
	return {
		type: USERS_ADD_USER,
		user
	}
}

export function usersSetUserAccounts(userId, accounts) {
	let payload = { userId, accounts }
	return {
		type: USERS_SET_USER_ACCOUNTS,
		payload
	}
}

export const deleteUser = (userId) => {
	let url = apiBase + `/user/${userId}`
	return (dispatch) => {
		dispatch(usersRemoveUser(userId))
		axios
			.delete(url)
			.then((response) => {
				dispatch(userDeleted(true))
				setTimeout(() => {
					dispatch(userDeleted(false))
				}, 2000)
			})
			.catch((error) => {
				dispatch(userDeletedError(true))
				setTimeout(() => {
					dispatch(userDeletedError(false))
				}, 2000)
			})
	}
}

export const createUser = (user) => {
	let userCopy = JSON.parse(JSON.stringify(user))

	user.userName = 'placeholder'
	user.phoneNumber = '123123123'

	//TODO: this can be deleted once API implements single role
	user.roles = [{ roleId: userCopy.roleId }]
	//TODO: this can be deleted once API implements single role

	delete user.userId
	delete user.internal
	delete user.roleId

	let url = apiBase + `/user/invite`
	return (dispatch) => {
		dispatch(setUserAdding(true))
		dispatch(usersAddUser(userCopy))
		axios
			.post(url, user)
			.then((response) => {
				dispatch(setUserAdding(false))
				dispatch(setUserAdded(true))
			})
			.catch((error) => {
				console.log('invite user error')
				console.log(error)
			})
	}
}

export const linkRoleToUser = (userId, roleId) => {
	let url = apiBase + `/user?userId=${userId}`
	return (dispatch) => {
		axios
			.post(url, roleId)
			.then((response) => {})
			.catch((error) => {
				console.log('link role to user error')
				console.log(error)
			})
	}
}

export function updatePassword(userId, oldPassword, password) {
	let url = `${apiBase}/user/${userId}/update-password`
	return async (dispatch) => {
		try {
			const result = await axios.post(url, {
				password: password,
				oldPassword: oldPassword
			})

			if (result.status === 200) {
				dispatch(
					setAlert({
						show: true,
						message: 'Password has been updated.',
						severity: 'success'
					})
				)
			} else {
				dispatch(
					setAlert({
						show: true,
						message: result.response.data.Error,
						severity: 'error'
					})
				)
			}
		} catch (error) {
			dispatch(
				setAlert({
					show: true,
					message: error.response.data.message,
					severity: 'error'
				})
			)
		}
	}
}
