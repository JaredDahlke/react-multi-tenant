import React from 'react'
import { connect } from 'react-redux'
import GridItem from '../../components/Grid/GridItem.js'
import GridContainer from '../../components/Grid/GridContainer.js'
import Button from 'rsuite/lib/Button'
import Card from '../../components/Card/Card.js'
import CardBody from '../../components/Card/CardBody.js'
import CardFooter from '../../components/Card/CardFooter.js'
import {
	updateUserData,
	updateUserAccounts,
	fetchUserAccounts
} from '../../redux/actions/users'
import Loader from 'rsuite/lib/Loader'
import { Formik } from 'formik'
import FormikInput from '../../components/CustomInput/FormikInput'
import FormikSelect from '../../components/CustomSelect/FormikSelect'
import * as Yup from 'yup'
import SuiteTree from '../../components/Tree/SuiteTree.js'
import Icon from 'rsuite/lib/Icon'
import IconButton from 'rsuite/lib/IconButton'
import Tooltip from 'rsuite/lib/Tooltip'
import Whisper from 'rsuite/lib/Whisper'
import { UserCan, perms, userCan } from '../../Can'
import {
	filteredRolesPermissions,
	filteredRolesPermissionsInfo,
	canAccessRoleId
} from './userUtils'
import RolesInfoFullScreen from './RolesInfoFullScreen.js'

const schemaValidation = Yup.object().shape({
	roleId: Yup.number()
		.typeError('Required')
		.required('Required'),
	accounts: Yup.array().min(1, 'Select at least one account'),
	firstName: Yup.string()
		.required('Required')
		.min(2, 'Must be greater than 1 character')
		.max(50, 'Must be less than 50 characters'),
	lastName: Yup.string()
		.required('Required')
		.min(2, 'Must be greater than 1 character')
		.max(50, 'Must be less than 50 characters'),
	company: Yup.string()
		.required('Required')
		.min(2, 'Must be greater than 1 character')
		.max(50, 'Must be less than 50 characters'),
	email: Yup.string()
		.required('Required')
		.email('Invalid email')
})

const mapStateToProps = (state) => {
	return {
		roles: state.rolesPermissions.data,
		accounts: state.accounts,
		users: state.users,
		editUserUserAccountsLoading: state.editUserUserAccountsLoading,
		userEditSaving: state.userEditSaving,
		userProfile: state.user.userProfile
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateUserData: (userData) => dispatch(updateUserData(userData)),
		fetchUserAccounts: (userId) => dispatch(fetchUserAccounts(userId)),
		updateUserAccounts: (user, accounts) =>
			dispatch(updateUserAccounts(user, accounts))
	}
}

const formatAccountsForTree = (accounts) => {
	if (!accounts) return []
	let accountsCopy = JSON.parse(JSON.stringify(accounts))
	if (accountsCopy && accountsCopy.length > 0) {
		addPropsToAccounts(accountsCopy)
	}
	return accountsCopy
}

const addPropsToAccounts = (accounts) => {
	for (const account of accounts) {
		account.value = account.accountId
		account.label = account.accountName
		if (account.children) {
			addPropsToAccounts(account.children)
		}
	}
}

const getGrantedAccounts = (users, userId) => {
	if (!users) return []
	let usersCopy = JSON.parse(JSON.stringify(users))
	if (usersCopy && usersCopy.length > 0) {
		for (const user of users) {
			if (user.userId === userId) {
				if (!user.accounts) return []
				let accounts = []
				for (const account of user.accounts) {
					accounts.push(account.accountId)
				}
				return accounts
			}
		}
	}
}

const getUser = (users, userId) => {
	if (!users || users.length < 1)
		return {
			firstName: '',
			lastName: '',
			email: '',
			roleId: '',
			accounts: [],
			company: ''
		}
	let usersCopy = JSON.parse(JSON.stringify(users))
	for (const user of usersCopy) {
		if (user.userId === userId) return user
	}
}

export function EditUser(props) {
	const [openDialog, setOpenDialog] = React.useState(false)

	let parsedUserId = JSON.parse(props.match.params.user)

	let treeAccounts = React.useMemo(
		() => formatAccountsForTree(props.accounts.data),
		[props.accounts.data]
	)
	let grantedAccounts = React.useMemo(
		() => getGrantedAccounts(props.users.data, parsedUserId),
		[props.users.data, parsedUserId]
	)
	let user = React.useMemo(() => getUser(props.users.data, parsedUserId), [
		props.users.data,
		parsedUserId
	])

	const handleSaveClick = (values, setFieldValue) => {
		if (!canAccessRoleId(values, props)) {
			setFieldValue('roleId', '')
			return
		}

		if (
			!values.email.toLowerCase().includes('sightly.com') &&
			values.accounts.includes(1)
		) {
			alert(
				'Currently we are unable to add external users to the Sightly account. Please select another account and try again.'
			)
			setFieldValue('accounts', [])
			return
		}

		values.userType = values.email.toLowerCase().includes('sightly.com')
			? 'Internal'
			: 'External'

		values.userId = user.userId

		props.updateUserData(values)
		let accounts = []
		for (const account of values.accounts) {
			accounts.push({ accountId: account })
		}
		props.updateUserAccounts(user, accounts)
	}

	const handleDialog = (value) => {
		setOpenDialog(value)
	}

	let fetchUserAccounts = props.fetchUserAccounts

	React.useEffect(() => {
		if (!user.accounts) {
			fetchUserAccounts(parsedUserId)
		}
	}, [props.users, parsedUserId, user.accounts, fetchUserAccounts])

	if (props.editUserUserAccountsLoading) {
		return <Loader center size='lg' content='Loading...' vertical />
	}

	return (
		<>
			<Formik
				data-qa='editUserForm'
				enableReinitialize={true}
				validateOnMount={true}
				validateOnChange={true}
				validateOnBlur={true}
				validationSchema={() => schemaValidation}
				initialValues={{
					company: user.company,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					roleId: user.roleId,
					accounts: grantedAccounts
				}}
				render={({
					values,
					errors,
					touched,
					setFieldValue,
					setFieldTouched,
					validateField,
					validateForm,
					isValid,
					dirty,
					resetForm
				}) => (
					<div>
						<GridContainer>
							<GridItem xs={12} sm={12} md={8}>
								<GridContainer>
									<GridItem xs={12} sm={12} md={6}>
										<FormikInput
											name='company'
											formikValue={values.company}
											labelText='Company'
											id='company'
											disabled={!userCan(perms.USER_UPDATE)}
										/>
									</GridItem>

									<GridItem xs={12} sm={12} md={6}>
										<FormikInput
											name='email'
											formikValue={values.email}
											labelText='Email'
											id='email'
											disabled={!userCan(perms.USER_UPDATE)}
										/>
									</GridItem>

									<GridItem xs={12} sm={12} md={6}>
										<FormikInput
											name='firstName'
											formikValue={values.firstName}
											labelText='First Name'
											id='firstName'
											disabled={!userCan(perms.USER_UPDATE)}
										/>
									</GridItem>

									<GridItem xs={12} sm={12} md={6}>
										<FormikInput
											name='lastName'
											formikValue={values.lastName}
											labelText='Last Name'
											id='lastName'
											disabled={!userCan(perms.USER_UPDATE)}
										/>
									</GridItem>

									<GridItem xs={12} sm={12} md={6}>
										{props.accounts.data &&
										props.accounts.data.length > 0 &&
										!props.editUserUserAccountsLoading ? (
											<SuiteTree
												label='Account Access'
												name='accounts'
												data-qa='accounts'
												data={treeAccounts}
												labelKey='accountName'
												valueKey='accountId'
												value={values.accounts}
												onChange={setFieldValue}
												cascade={true}
												error={errors.accounts}
												//	disabled={

												//	!userCan(perms.ASSIGNED_ACCOUNT_UPDATE)

												//		}
											/>
										) : null}
									</GridItem>
									<GridItem xs={12} sm={12} md={6}></GridItem>

									<GridItem xs={10} sm={10} md={6}>
										<div
											style={{
												display: 'flex',
												alignItems: 'flex-end'
											}}
										>
											<FormikSelect
												id='role'
												name='roleId'
												data-qa='roleId'
												label='Role'
												placeholder='Role'
												optionLabel='roleName'
												optionValue='roleId'
												options={filteredRolesPermissions(
													props.userProfile && props.userProfile.userType,
													values.email,
													props.roles
												)}
												value={values.roleId}
												onChange={setFieldValue}
												onBlur={setFieldTouched}
												validateField={validateField}
												validateForm={validateForm}
												touched={touched.roleId}
												error={errors.roleId}
												isDisabled={!userCan(perms.USER_UPDATE)}
											/>
											<Whisper
												placement='right'
												trigger='hover'
												speaker={
													<Tooltip>More about Roles/Permissions</Tooltip>
												}
											>
												<IconButton
													icon={<Icon icon='info' />}
													circle
													size='md'
													appearance='ghost'
													onClick={() => {
														handleDialog(true)
													}}
													style={{ margin: '10px' }}
												/>
											</Whisper>
										</div>
									</GridItem>
								</GridContainer>

								<CardFooter>
									<UserCan do={perms.USER_UPDATE}>
										<Button
											disabled={!isValid || !dirty}
											onClick={() => handleSaveClick(values, setFieldValue)}
											loading={props.userEditSaving}
										>
											Save
										</Button>
									</UserCan>
								</CardFooter>
							</GridItem>
						</GridContainer>
					</div>
				)}
			/>
			{/* Info Modal for Roles help */}
			{openDialog && (
				<RolesInfoFullScreen
					show={openDialog}
					title='Roles and Permissions'
					handleDialog={(value) => {
						handleDialog(value)
					}}
					data={filteredRolesPermissionsInfo(
						props.userProfile && props.userProfile.userType,
						props.roles
					)}
					userType={props.userProfile && props.userProfile.userType}
				/>
			)}
		</>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUser)
