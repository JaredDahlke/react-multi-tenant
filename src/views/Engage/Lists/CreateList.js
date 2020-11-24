import React from 'react'
import ButtonToolbar from 'rsuite/lib/ButtonToolbar'
import Modal from 'rsuite/lib/Modal'
import Button from 'rsuite/lib/Button'
import { Form, withFormik } from 'formik'
import FormikInput from '../../../components/CustomInput/FormikInput'
import FormikSelect from '../../../components/CustomSelect/FormikSelect'
import Panel from 'rsuite/lib/Panel'
import Grid from '@material-ui/core/Grid'
import { objectives } from './constants'
import FormGroup from 'rsuite/lib/FormGroup'
import { connect } from 'react-redux'
import { postListObjValidation } from '../../../schemas/Engage/Lists/schemas'
import { getCurrentAccount } from '../../../utils'
import {
	postList,
	setPostListSucess
} from '../../../redux/actions/engage/lists'
import { useHistory } from 'react-router-dom'
import { routes } from '../../../routes'

const mapStateToProps = (state) => {
	return {
		isPostingList: state.engage.isPostingList,
		postListSuccess: state.engage.postListSuccess,
		accounts: state.accounts,
		brandProfiles: state.brandProfiles
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postList: (data) => dispatch(postList(data)),
		setPostListSuccess: (bool) => dispatch(setPostListSuccess(bool))
	}
}

function CreateNewListModal(props) {
	let history = useHistory()
	const { postListSuccess } = props
	React.useEffect(() => {
		if (postListSuccess) {
			history.push(routes.app.engage.lists.listBuilder.path, { from: 'lists' })
		}
	}, [postListSuccess])

	let currentAccount = React.useMemo(() => {
		return getCurrentAccount(props.accounts.data)
	}, [props.accounts.data])

	const {
		isValid,
		dirty,
		values,
		setFieldValue,
		setFieldTouched,
		errors,
		validateField,
		validateForm,
		touched
	} = props
	const handleCreateClick = (values) => {
		let list = {
			smartListName: values.smartListName,
			objectiveId: values.objectiveId,
			smartListData: [{ id: 'UCu-sMNXPu_mqjFVbR9YF7JA', action: 'target' }]
		}

		let data = {
			list,
			brandProfileId: values.brandProfileId,
			accountId: currentAccount.accountId
		}

		props.postList(data)
	}

	return (
		<div className='modal-container'>
			<Grid container spacing={3} justify='center'>
				<Grid item xs={12} sm={6} md={10}>
					<Grid container direction='column' spacing={1}>
						<Form>
							<Grid item xs={12}>
								<FormikInput
									name='smartListName'
									formikValue={values.smartListName}
									labelText='Smartlist Name'
									id='smartListName'
								/>
							</Grid>
							<Grid item xs={12}>
								<FormikSelect
									id='objectiveId'
									name='objectiveId'
									label='Objective'
									optionLabel='objectiveName'
									optionValue='objectiveId'
									options={objectives}
									value={values.objectiveId}
									onChange={setFieldValue}
									onBlur={setFieldTouched}
									validateField={validateField}
									validateForm={validateForm}
									touched={touched.objectiveId}
									error={errors.objectiveId}
									hideSearch
								/>
							</Grid>
							<Grid item xs={12}>
								<FormikSelect
									id='brandProfileId'
									name='brandProfileId'
									label='Brand Profile'
									optionLabel='brandName'
									optionValue='brandProfileId'
									options={props.brandProfiles}
									value={values.brandProfileId}
									onChange={setFieldValue}
									onBlur={setFieldTouched}
									validateField={validateField}
									validateForm={validateForm}
									touched={touched.brandProfileId}
									error={errors.brandProfileId}
									hideSearch
									isDisabled={
										props.brandProfiles && props.brandProfiles.length < 1
									}
								/>
							</Grid>
						</Form>
						<Grid item xs={12}>
							<ButtonToolbar>
								<Button
									disabled={!dirty || !isValid || props.isPostingList}
									//	type='submit'
									onClick={() => handleCreateClick(values)}
									loading={props.isPostingList}
								>
									Let's go!
								</Button>

								<Button
									//	disabled={!dirty || !isValid || props.isPostingList}
									//	onClick={handleClose}
									color='red'
									appearance='subtle'
									//	loading={props.isPostingList}
								>
									Cancel
								</Button>
							</ButtonToolbar>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	)
}

const MyEnhancedForm = withFormik({
	mapPropsToValues: (props) => {
		return {
			smartListName: '',
			objectiveId: 1,
			brandProfileId: props.brandProfiles[0]
				? props.brandProfiles[0].brandProfileId
				: ''
		}
	},
	enableReinitialize: true,
	validateOnChange: true,
	validateOnBlur: true,
	validationSchema: postListObjValidation
})(CreateNewListModal)

export default connect(mapStateToProps, mapDispatchToProps)(MyEnhancedForm)