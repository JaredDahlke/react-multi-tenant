import { combineReducers } from 'redux'
import {
	roles,
	rolesHasErrored,
	rolesIsLoading,
	rolesPermissionsIsLoading,
	rolesPermissions,
	rolesPermissionsHasErrored
} from './roles'
import {
	authToken,
	isLoggedIn,
	alert,
	user,
	userProfileIsLoading
} from './auth'
import {
	users,
	usersHasErrored,
	userDeleted,
	userDeletedError,
	userAdded,
	usersIsLoading,
	editUserUserAccountsLoading,
	userProfileSaving,
	userProfileSaved
} from './users'
import {
	accounts,
	currentAccountId,
	isSwitchingAccounts,
	treeAccounts,
	editAccountAccountUsersLoading,
	accountTypes,
	accountCreated
} from './accounts'
import {
	brandProfiles,
	brandProfilesIsLoading,
	hasBrandProfiles,
	scenarioProperties,
	industryVerticals
} from './brandProfiles'
import { categories, channels, videos } from './discover/channels'

export default combineReducers({
	authToken,
	roles,
	rolesPermissions,
	rolesHasErrored,
	rolesPermissionsHasErrored,
	rolesIsLoading,
	rolesPermissionsIsLoading,
	isLoggedIn,
	alert,
	users,
	usersHasErrored,
	user,
	userDeleted,
	userDeletedError,
	usersIsLoading,
	brandProfiles,
	userAdded,
	accounts,
	currentAccountId,
	isSwitchingAccounts,
	userProfileIsLoading,
	userProfileSaving,
	userProfileSaved,
	treeAccounts,
	editUserUserAccountsLoading,
	editAccountAccountUsersLoading,
	accountTypes,
	brandProfilesIsLoading,
	accountCreated,
	hasBrandProfiles,
	scenarioProperties,
	industryVerticals,
	categories,
	channels,
	videos
})
