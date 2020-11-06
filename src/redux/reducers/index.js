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
	scenarios,
	industryVerticals,
	topics,
	brandProfileCreated,
	brandProfileCreating,
	brandProfileDeleted,
	brandProfileDeleting,
	brandCategories,
	brandProfileBasicInfo,
	brandProfileCompetitors,
	brandProfileLoading,
	brandProfileSaving,
	brandProfileSaved,
	scenariosIsLoading,
	scenarioSaving,
	scenarioCreated,
	scenarioArchiving,
	scenarioArchived
} from './brandProfiles'
import { categories, channels, videos } from './discover/channels'

import brandProfilesAdmin from './brandProfilesAdmin/index'

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
	brandProfileLoading,
	accountCreated,
	hasBrandProfiles,
	scenarios,
	industryVerticals,
	topics,
	brandCategories,
	brandProfileBasicInfo,
	brandProfileCompetitors,
	categories,
	channels,
	videos,
	accountSaving,
	accountSaved,
	brandProfileSaving,
	brandProfileSaved,
	userAddError,
	updatingPassword,
	loggedInUserPermissions,
	resettingPassword,
	scenariosIsLoading,
	scenarioSaving,
	scenarioCreated,
	scenarioArchiving,
	scenarioArchived,
	brandProfilesAdmin
})
