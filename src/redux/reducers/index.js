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
	userProfileIsLoading,
	loggingIn,
	updatingPassword,
	loggedInUserPermissions,
	resettingPassword
} from './auth'
import {
	users,
	usersHasErrored,
	userDeleted,
	userDeletedError,
	userAdded,
	userAdding,
	usersIsLoading,
	editUserUserAccountsLoading,
	userProfileSaving,
	userProfileSaved,
	userEditSaving,
	userEditSaved,
	userAddError
} from './users'
import {
	accounts,
	currentAccountId,
	isSwitchingAccounts,
	editAccountAccountUsersLoading,
	accountTypes,
	accountCreated,
	accountSaving,
	accountSaved
} from './accounts'
import {
	brandProfiles,
	brandProfilesIsLoading,
	hasBrandProfiles,
	industryVerticals,
	brandProfileCreated,
	brandProfileCreating,
	brandProfileDeleted,
	brandProfileDeleting,
	brandProfileLoading,
	brandProfileSaving,
	brandProfileSaved,
	scenariosIsLoading,
	brandProfileUnderEdit
} from './brandProfiles'

import admin from './admin/index'
import engage from './engage/index'
import thirdParty from './ThirdParty/index'

export default combineReducers({
	authToken,
	roles,
	rolesPermissions,
	rolesHasErrored,
	rolesPermissionsHasErrored,
	rolesIsLoading,
	rolesPermissionsIsLoading,
	isLoggedIn,
	loggingIn,
	alert,
	users,
	usersHasErrored,
	user,
	userDeleted,
	userDeletedError,
	usersIsLoading,
	brandProfiles,
	brandProfileCreated,
	brandProfileCreating,
	brandProfileDeleted,
	brandProfileDeleting,
	userAdded,
	userAdding,
	userEditSaving,
	userEditSaved,
	accounts,
	currentAccountId,
	isSwitchingAccounts,
	userProfileIsLoading,
	userProfileSaving,
	userProfileSaved,
	editUserUserAccountsLoading,
	editAccountAccountUsersLoading,
	accountTypes,
	brandProfilesIsLoading,
	brandProfileUnderEdit,
	brandProfileLoading,
	accountCreated,
	hasBrandProfiles,
	industryVerticals,
	accountSaving,
	accountSaved,
	brandProfileSaving,
	brandProfileSaved,
	userAddError,
	updatingPassword,
	loggedInUserPermissions,
	resettingPassword,
	scenariosIsLoading,
	admin,
	engage,
	thirdParty
})
