import React from 'react'
import { Formik, FieldArray, useFormikContext } from 'formik'
import Panel from '../../../../components/CustomPanel'
import Button from 'rsuite/lib/Button'
import Grid from '@material-ui/core/Grid'
import debounce from 'just-debounce-it'
import FormikInput from '../../../../components/CustomInput/FormikInput'
import { connect } from 'react-redux'
import { UserCan, perms, userCan } from '../../../../Can'
import * as Yup from 'yup'
import { neutralLightColor } from '../../../../assets/jss/colorContants.js'
import {
	patchBrandProfileCompetitors,
	fetchBrandProfileCompetitors
} from '../../../../redux/actions/brandProfiles'
const urlRegex = require('url-regex')

const mapStateToProps = (state) => {
	return {
		brandProfile: state.brandProfileUnderEdit
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		patchBrandProfileCompetitors: (competitors) =>
			dispatch(patchBrandProfileCompetitors(competitors)),
		fetchBrandProfileCompetitors: (brandProfileId) =>
			dispatch(fetchBrandProfileCompetitors(brandProfileId))
	}
}

function TopCompetitors(props) {
	const [fetched, setFetched] = React.useState(false)
	React.useEffect(() => {
		if (!fetched) {
			props.fetchBrandProfileCompetitors(props.brandProfileId)
			setFetched(true)
		}
	}, [])

	React.useEffect(() => {
		return () => {
			setFetched(false)
		}
	}, [])

	const handleSaveNew = (values) => {
		let newComps = []
		let newCompsWithoutId = []
		for (const competitor of values.competitors) {
			let newCompetitor = {
				competitorId: (Math.random() * 100) | 0,
				competitorName: competitor.competitorName,
				twitterProfileUrl: competitor.twitterProfileUrl,
				websiteUrl: competitor.websiteUrl
			}
			let newCompetitorWithoutId = {
				competitorName: competitor.competitorName,
				twitterProfileUrl: competitor.twitterProfileUrl,
				websiteUrl: competitor.websiteUrl
			}

			newComps.push(newCompetitor)
			newCompsWithoutId.push(newCompetitorWithoutId)
		}

		let data = {
			competitors: newCompsWithoutId,
			brandProfileId: props.brandProfile.brandProfileId
		}

		props.patchBrandProfileCompetitors(data)
	}

	const handleAddNew = (values, setFieldValue) => {
		let old = JSON.parse(JSON.stringify(values.competitors))
		old.push({
			competitorId: Math.random() * 100,
			competitorName: '',
			websiteUrl: '',
			twitterProfileUrl: ''
		})
		setFieldValue('competitors', old)
	}

	const handleDeleteCompetitor = (
		competitorIdToDelete,
		arrayHelpers,
		index,
		competitors,
		setFieldValue
	) => {
		arrayHelpers.remove(index)
		let newComps = [
			...competitors.filter(
				({ competitorId }) => competitorId !== competitorIdToDelete
			)
		]
		setFieldValue('competitors', newComps)

		let newValues = {
			competitors: newComps
		}
		handleSaveNew(newValues)
	}

	const schema = Yup.object().shape({
		competitors: Yup.array()
			.typeError('Wrong type')
			.min(1, 'At least one competitor is required')
			.of(
				Yup.object()
					.shape({
						competitorName: Yup.string()
							.min(2, 'Must be greater than 1 character')
							.max(50, 'Must be less than 50 characters')
							.required('Required'),
						websiteUrl: Yup.string()
							.required('Required')
							.test('urlTest', 'Valid URL required', (websiteUrl) => {
								return urlRegex({ exact: true, strict: false }).test(websiteUrl)
							}),
						twitterProfileUrl: Yup.string()
							.min(2, 'Must be greater than 1 character')
							.max(50, 'Must be less than 30 characters')
							.required('Required')
					})
					.transform((v) => (v === '' ? null : v))
			)
	})

	const CustomField = (props) => {
		return (
			<FormikInput
				name={props.name}
				disabled={!userCan(perms.BRAND_PROFILE_UPDATE)}
				formikValue={props.formikValue}
				specialError={props.error}
				startAdornmentText={props.name.includes('twitter') && 'twitter.com/'}
				simple
			/>
		)
	}

	const AutoSave = ({ debounceMs }) => {
		const formik = useFormikContext()
		const debouncedSubmit = React.useCallback(
			debounce(() => formik.submitForm(formik.setFieldValue), debounceMs),
			[debounceMs, formik.submitForm]
		)

		React.useEffect(() => {
			if (formik.dirty) {
				debouncedSubmit()
			}
		}, [debouncedSubmit, formik.values])

		return null
	}

	return (
		<Formik
			enableReinitialize={true}
			validateOnMount={true}
			validationSchema={schema}
			onSubmit={(values, formik) => handleSaveNew(values)}
			initialValues={{
				competitors: props.brandProfile.competitors
					? props.brandProfile.competitors
					: [
							{
								competitorId: '',
								competitorName: '',
								websiteUrl: '',
								twitterProfileUrl: ''
							}
					  ]
			}}
		>
			{(formik) => (
				<Panel header='Competitors' bordered>
					<Grid container>
						<FieldArray
							name='competitors'
							render={(arrayHelpers) => {
								const competitors = formik.values.competitors
								return (
									<>
										{competitors && competitors.length > 0
											? competitors.map((competitor, index) => (
													<Grid key={index} container spacing={1}>
														<div style={{ width: 15 }} />
														<Grid item xs={12} sm={12} md={3}>
															<p>{index === 0 ? 'Name' : ''}</p>
															<CustomField
																name={`competitors.${index}.competitorName`}
																formikValue={competitor.competitorName}
																error={
																	formik.errors &&
																	formik.errors.competitors &&
																	formik.errors.competitors[index] &&
																	formik.errors.competitors[index]
																		.competitorName
																}
															/>
														</Grid>

														<Grid item xs={12} sm={12} md={3}>
															<p>{index === 0 ? 'Twitter' : ''}</p>
															<CustomField
																name={`competitors.${index}.twitterProfileUrl`}
																formikValue={competitor.twitterProfileUrl}
																error={
																	formik.errors &&
																	formik.errors.competitors &&
																	formik.errors.competitors[index] &&
																	formik.errors.competitors[index]
																		.twitterProfileUrl
																}
															/>
														</Grid>
														<Grid item xs={12} sm={12} md={3}>
															<p>{index === 0 ? 'Website' : ''}</p>
															<CustomField
																name={`competitors.${index}.websiteUrl`}
																formikValue={competitor.websiteUrl}
																error={
																	formik.errors &&
																	formik.errors.competitors &&
																	formik.errors.competitors[index] &&
																	formik.errors.competitors[index].websiteUrl
																}
															/>
														</Grid>
														<Grid item xs={12} sm={12} md={2}>
															{index === 0 ? (
																<div style={{ height: 20 }}></div>
															) : (
																''
															)}

															<UserCan do={perms.BRAND_PROFILE_UPDATE}>
																<Button
																	block
																	style={{
																		color: '#F44336',
																		borderColor: '#F44336'
																	}}
																	appearance='ghost'
																	onClick={() =>
																		handleDeleteCompetitor(
																			competitor.competitorId,
																			arrayHelpers,
																			index,
																			formik.values.competitors,
																			formik.setFieldValue
																		)
																	}
																>
																	Remove
																</Button>
															</UserCan>
														</Grid>
													</Grid>
											  ))
											: null}

										<AutoSave debounceMs={500} />
									</>
								)
							}}
						/>

						<Grid container style={{ paddingTop: 25, marginLeft: 15 }}>
							<UserCan do={perms.BRAND_PROFILE_UPDATE}>
								<Button
									size={'sm'}
									appearance='ghost'
									color='green'
									onClick={() => {
										handleAddNew(formik.values, formik.setFieldValue)
									}}
								>
									{formik.values.competitors.length < 1
										? 'Add a Competitor'
										: 'Add another'}
								</Button>
							</UserCan>
						</Grid>
					</Grid>
				</Panel>
			)}
		</Formik>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(TopCompetitors)
