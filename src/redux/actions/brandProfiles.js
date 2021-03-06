import {
	SET_BRAND_PROFILES,
	REMOVE_BRAND_PROFILE,
	ADD_BRAND_PROFILE,
	BRAND_PROFILES_IS_LOADING,
	HAS_BRAND_PROFILES,
	SET_BRAND_INDUSTRY_VERTICALS,
	BRAND_PROFILE_CREATED,
	BRAND_PROFILE_DELETING,
	BRAND_PROFILE_CREATING,
	SET_BRAND_PROFILE_LOADING,
	SET_BRAND_PROFILE_SAVING,
	SET_BRAND_PROFILE_SAVED,
	SCENARIOS_IS_LOADING,
	SET_BRAND_PROFILE_UNDER_EDIT,
	SET_BRAND_PROFILE_CATEGORIES,
	SET_BRAND_PROFILE_IAB_CATEGORIES,
	SET_BRAND_PROFILE_COMPETITORS,
	SET_BRAND_PROFILE_TOPICS,
	SET_BRAND_PROFILE_SCENARIOS,
	SET_BRAND_PROFILE_OPINIONS,
	SET_BRAND_PROFILE_BASIC_INFO,
	SET_BRAND_PROFILE_QUESTIONS
} from '../action-types/brandProfiles'
import axios from '../../axiosConfig'
import config from '../../config.js'
import toast from 'react-hot-toast'

import {
	brandProfilesObjValidation,
	basicInfoObjValidation,
	competitorsObjValidation,
	categoriesObjValidation,
	topicsObjValidation,
	scenariosObjValidation,
	opinionsObjValidation,
	questionsObjValidation
} from '../../schemas/brandProfiles'

var cwait = require('cwait')
var categoriesQueue = new cwait.TaskQueue(Promise, 1)
var topicsQueue = new cwait.TaskQueue(Promise, 1)
var scenariosQueue = new cwait.TaskQueue(Promise, 1)
var opinionsQueue = new cwait.TaskQueue(Promise, 1)
var questionsQueue = new cwait.TaskQueue(Promise, 1)

const apiBase = config.api.userAccountUrl

export function setBrandProfiles(brandProfiles) {
	return {
		type: SET_BRAND_PROFILES,
		brandProfiles
	}
}

export function fetchBrandProfileBasic(brandProfileId) {
	return async (dispatch, getState) => {
		let url = apiBase + `/brand-profile/${brandProfileId}/basic`
		try {
			const result = await axios.get(url)
			if (result.status === 200) {
				basicInfoObjValidation.validate(result.data).catch(function(err) {
					console.log(err.name, err.errors)
					alert(
						' we received different data from the api than expected while fetching brand profile basic info, see console log for more details'
					)
				})

				let brandProfile = JSON.parse(
					JSON.stringify(getState().brandProfileUnderEdit)
				)
				brandProfile.brandProfileId = result.data.brandProfileId
				brandProfile.brandName = result.data.brandName
				brandProfile.websiteUrl = result.data.websiteUrl
				brandProfile.industryVerticalId = result.data.industryVerticalId
				brandProfile.twitterProfileUrl = result.data.twitterProfileUrl
				brandProfile.primaryKPI = result.data.primaryKPI
					? result.data.primaryKPI
					: ''
				brandProfile.secondaryKPI = result.data.secondaryKPI
					? result.data.secondaryKPI
					: ''
				brandProfile.tertiaryKPI = result.data.tertiaryKPI
					? result.data.tertiaryKPI
					: ''

				dispatch(setBrandProfileUnderEdit(brandProfile))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function fetchBrandProfileCompetitors(brandProfileId) {
	let url = apiBase + `/brand-profile/${brandProfileId}/competitors`
	return async (dispatch, getState) => {
		try {
			const result = await axios.get(url)

			if (result.status === 200) {
				if (result.data.length > 0) {
					competitorsObjValidation.validate(result.data).catch(function(err) {
						console.log(err.name, err.errors)
						alert(
							' we received different data from the api than expected while fetching brand profile competitors, see console log for more details'
						)
					})
				}
				dispatch(setBrandProfileCompetitors(result.data))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function fetchBrandProfileCategories(brandProfileId) {
	let url = apiBase + `/brand-profile/${brandProfileId}/categories`
	return async (dispatch, getState) => {
		try {
			const result = await axios.get(url)

			if (result.status === 200) {
				categoriesObjValidation.validate(result.data).catch(function(err) {
					console.log(err.name, err.errors)
					alert(
						' we received different data from the api than expected while fetching brand profile categories, see console log for more details'
					)
				})
				dispatch(setBrandProfileCategories(result.data))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function fetchBrandProfileIabCategories(args) {
	let brandProfileId = args.brandProfileId
	let iabCategories = args.iabCategories
	let url = apiBase + `/brand-profile/${brandProfileId}/iab-categories`
	return async (dispatch, getState) => {
		const result = await axios.get(url)

		if (result.status === 200) {
			// categoriesObjValidation.validate(result.data).catch(function(err) {
			// 	console.log(err.name, err.errors)
			// 	alert(
			// 		' we received different data from the api than expected while fetching brand profile categories, see console log for more details'
			// 	)
			// })

			if (result.data.length > 0) {
				let processedIabCategories = processIabCategories(
					iabCategories,
					result.data
				)
				let cascaded = cascadeCats(processedIabCategories)
				dispatch(setBrandProfileIabCategories(cascaded))
			} else {
				dispatch(setBrandProfileIabCategories(iabCategories))
			}
		}
	}
}

const cascadeCats = (cats) => {
	for (const row of cats) {
		if (row.actionId && row.children) {
			for (const child of row.children) {
				child.actionId = row.actionId
			}
		}
	}

	for (const row of cats) {
		if (row.children) {
			for (const child of row.children) {
				if (child.children && child.actionId) {
					for (const gChild of child.children) {
						gChild.actionId = child.actionId
					}
				}
			}
		}
	}

	for (const row of cats) {
		if (row.children) {
			for (const child of row.children) {
				if (child.children) {
					for (const gChild of child.children) {
						if (gChild.children && gChild.actionId) {
							for (const ggChild of gChild.children) {
								ggChild.actionId = gChild.actionId
							}
						}
					}
				}
			}
		}
	}

	return cats
}

const processIabCategories = (iabCats, bpIabCats) => {
	//loop through api results and assign to iabCategories
	let bpIabCatIds = bpIabCats.map((cat) => cat.iabCategoryId)
	for (const row of iabCats) {
		if (bpIabCatIds.includes(Number(row.id))) {
			row.actionId = getActionId(bpIabCats, Number(row.id))
		}
		if (row.children) {
			for (const child of row.children) {
				if (bpIabCatIds.includes(Number(child.id))) {
					child.actionId = getActionId(bpIabCats, Number(child.id))
				}
				if (child.children) {
					for (const gChild of child.children) {
						if (bpIabCatIds.includes(Number(gChild.id))) {
							gChild.actionId = getActionId(bpIabCats, Number(gChild.id))
						}
						if (gChild.children) {
							for (const ggChild of gChild.children) {
								if (bpIabCatIds.includes(Number(ggChild.id))) {
									ggChild.actionId = getActionId(bpIabCats, Number(ggChild.id))
								}
							}
						}
					}
				}
			}
		}
	}
	return iabCats
}

const getActionId = (bpIabCats, id) => {
	let bpCat = bpIabCats.filter((cat) => cat.iabCategoryId === id)
	return bpCat[0].iabCategoryResponseId
}

export function fetchBrandProfileTopics(brandProfileId) {
	let url = apiBase + `/brand-profile/${brandProfileId}/topics`
	return async (dispatch, getState) => {
		try {
			const result = await axios.get(url)

			if (result.status === 200) {
				topicsObjValidation.validate(result.data).catch(function(err) {
					console.log(err.name, err.errors)
					alert(
						' we received different data from the api than expected while fetching brand profile topics, see console log for more details'
					)
				})
				dispatch(setBrandProfileTopics(result.data))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function fetchBrandProfileScenarios(brandProfileId) {
	let url = apiBase + `/brand-profile/${brandProfileId}/scenarios`
	return async (dispatch, getState) => {
		try {
			const result = await axios.get(url)

			if (result.status === 200) {
				scenariosObjValidation.validate(result.data).catch(function(err) {
					console.log(err.name, err.errors)
					alert(
						' we received different data from the api than expected while fetching brand profile scenarios, see console log for more details'
					)
				})

				let scenarioTypes = []
				let scenTypesShort = []
				for (const scenarioType of JSON.parse(JSON.stringify(result.data))) {
					if (!scenTypesShort.includes(scenarioType.scenarioType)) {
						scenarioTypes.push({
							scenarioTypeName: scenarioType.scenarioType,
							scenarios: []
						})
						scenTypesShort.push(scenarioType.scenarioType)
					}
				}

				for (const scenarioType of scenarioTypes) {
					for (const scenario of result.data) {
						if (scenario.scenarioType === scenarioType.scenarioTypeName) {
							scenarioType.scenarios.push(scenario)
						}
					}
				}

				dispatch(setBrandProfileScenarios(scenarioTypes))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function fetchBrandProfileOpinions(brandProfileId) {
	let url = apiBase + `/brand-profile/${brandProfileId}/opinions`
	return async (dispatch, getState) => {
		try {
			const result = await axios.get(url)

			if (result.status === 200) {
				opinionsObjValidation.validate(result.data).catch(function(err) {
					console.log(err.name, err.errors)
					alert(
						' we received different data from the api than expected while fetching brand profile opinions, see console log for more details'
					)
				})
				dispatch(setBrandProfileOpinions(result.data))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function fetchBrandProfileQuestions(brandProfileId) {
	let url = apiBase + `/brand-profile/${brandProfileId}/questions`
	return async (dispatch, getState) => {
		try {
			const result = await axios.get(url)

			if (result.status === 200) {
				questionsObjValidation.validate(result.data).catch(function(err) {
					console.log(err.name, err.errors)
					alert(
						' we received different data from the api than expected while fetching brand profile questions, see console log for more details'
					)
				})
				dispatch(setBrandProfileQuestions(result.data))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export const createBrandProfile = () => {
	let url = apiBase + `/brand-profile`
	return (dispatch, getState) => {
		let initialName =
			getState().brandProfiles.length > 0
				? 'UNTITLED_BRAND_PROFILE'
				: 'My first brand profile'
		dispatch(setBrandProfileCreating(true))
		let brandProfile = {
			accountId: getState().currentAccountId,
			brandName: initialName
		}

		axios
			.post(url, brandProfile)
			.then((response) => {
				if (response.status === 200) {
					basicInfoObjValidation.validate(response.data).catch(function(err) {
						console.log(err.name, err.errors)
						alert(
							' we received different data from the api than expected after creating a  brand profile, see console log for more details'
						)
					})

					response.data.industryVerticalId = null
					let copy = JSON.parse(JSON.stringify(response.data))
					dispatch(addBrandProfile(copy))
					dispatch(setBrandProfileCreating(false))
					dispatch(setBrandProfileCreated(true))
					console.log('create  brand profile')
					console.log(response.data)
					dispatch(setBrandProfileUnderEdit(response.data))
				}
			})
			.catch((error) => {
				//error
			})
	}
}

export function setBrandProfileUnderEdit(brandProfileUnderEdit) {
	return {
		type: SET_BRAND_PROFILE_UNDER_EDIT,
		brandProfileUnderEdit
	}
}

export function setBrandProfileBasicInfo(basicInfo) {
	return {
		type: SET_BRAND_PROFILE_BASIC_INFO,
		basicInfo
	}
}

export function setBrandProfileCategories(categories) {
	return {
		type: SET_BRAND_PROFILE_CATEGORIES,
		categories
	}
}

export function setBrandProfileIabCategories(iabCategories) {
	return {
		type: SET_BRAND_PROFILE_IAB_CATEGORIES,
		iabCategories
	}
}

export function setBrandProfileCompetitors(competitors) {
	return {
		type: SET_BRAND_PROFILE_COMPETITORS,
		competitors
	}
}

export function setBrandProfileTopics(topics) {
	return {
		type: SET_BRAND_PROFILE_TOPICS,
		topics
	}
}

export function setBrandProfileScenarios(scenarios) {
	return {
		type: SET_BRAND_PROFILE_SCENARIOS,
		scenarios
	}
}

export function setBrandProfileOpinions(opinions) {
	return {
		type: SET_BRAND_PROFILE_OPINIONS,
		opinions
	}
}

export function setBrandProfileQuestions(questions) {
	return {
		type: SET_BRAND_PROFILE_QUESTIONS,
		questions
	}
}

export const patchBrandProfileBasicInfo = (brandProfile) => {
	return async (dispatch, getState) => {
		dispatch(setBrandProfileSaving(true))

		let profiles = JSON.parse(JSON.stringify(getState().brandProfiles))
		for (const profile of profiles) {
			if (profile.brandProfileId === brandProfile.brandProfileId) {
				profile.brandName = brandProfile.brandName
				profile.twitterProfileUrl = brandProfile.twitterProfileUrl
				profile.industryVerticalId = brandProfile.industryVerticalId
				profile.websiteUrl = brandProfile.websiteUrl
				profile.primaryKPI = brandProfile.primaryKPI
				profile.secondaryKPI = brandProfile.secondaryKPI
				profile.tertiaryKPI = brandProfile.tertiaryKPI
			}
		}
		dispatch(setBrandProfiles(profiles))

		brandProfile.accountId = getState().currentAccountId
		if (!brandProfile.industryVerticalId) {
			delete brandProfile.industryVerticalId
		}
		let url = apiBase + `/brand-profile/${brandProfile.brandProfileId}`
		const result = await axios.patch(url, brandProfile)
		if (result.status === 200) {
			dispatch(setBrandProfileSaving(false))
			dispatch(setBrandProfileSaved(true))
		}
	}
}

export const patchBrandProfileCompetitors = (data) => {
	let brandProfileId = data.brandProfileId
	let competitors = data.competitors

	return async (dispatch, getState) => {
		dispatch(setBrandProfileSaving(true))

		let url = apiBase + `/brand-profile/${brandProfileId}/competitors`
		const result = await axios.patch(url, competitors)
		if (result.status === 200) {
			dispatch(setBrandProfileSaving(false))
			dispatch(setBrandProfileSaved(true))
		}
	}
}

export const patchBrandProfileCategories = (data) => {
	let brandProfileId = data.brandProfileId
	let categories = data.categories

	for (const category of categories) {
		delete category.contentCategoryName
		delete category.contentCategory
		delete category.contentCategoryResponseName
		delete category.brandProfileId
	}

	let url = apiBase + `/brand-profile/${brandProfileId}/categories`
	return categoriesQueue.wrap(async (dispatch) => {
		dispatch(setBrandProfileSaving(true))
		const result = await axios.patch(
			url,
			categories.filter((cat) => cat.contentCategoryResponseId)
		)
		if (result.status === 201 || result.status === 200) {
			dispatch(setBrandProfileSaving(false))
			dispatch(setBrandProfileSaved(true))
		}
	})
}

export const patchBrandProfileIabCategories = (data) => {
	let brandProfileId = data.brandProfileId
	let iabCategories = data.iabCategories

	let url = apiBase + `/brand-profile/${brandProfileId}/iab-categories`
	return async (dispatch) => {
		dispatch(setBrandProfileSaving(true))
		const result = await axios.patch(url, iabCategories)
		if (result.status === 201 || result.status === 200) {
			dispatch(setBrandProfileSaving(false))
			dispatch(setBrandProfileSaved(true))
		}
	}
}

export const patchBrandProfileTopics = (data) => {
	let brandProfileId = data.brandProfileId
	let topics = data.topics
	let url = apiBase + `/brand-profile/${brandProfileId}/topics`
	return topicsQueue.wrap(async (dispatch) => {
		dispatch(setBrandProfileSaving(true))
		const result = await axios.patch(url, topics)
		if (result.status === 201 || result.status === 200) {
			dispatch(setBrandProfileSaving(false))
			dispatch(setBrandProfileSaved(true))
		}
	})
}

export const patchBrandProfileScenarios = (data) => {
	let brandProfileId = data.brandProfileId
	let scenarios = data.scenarios
	let url = apiBase + `/brand-profile/${brandProfileId}/scenarios`

	return scenariosQueue.wrap(async (dispatch) => {
		dispatch(setBrandProfileSaving(true))
		const result = await axios.patch(url, scenarios)
		if (result.status === 201 || result.status === 200) {
			dispatch(setBrandProfileSaving(false))
			dispatch(setBrandProfileSaved(true))
		}
	})
}

export const patchBrandProfileOpinions = (data) => {
	let brandProfileId = data.brandProfileId
	let opinions = data.opinions

	let url = apiBase + `/brand-profile/${brandProfileId}/opinions`

	return opinionsQueue.wrap(async (dispatch) => {
		dispatch(setBrandProfileSaving(true))
		const result = await axios.patch(url, opinions)
		if (result.status === 201 || result.status === 200) {
			dispatch(setBrandProfileSaving(false))
			dispatch(setBrandProfileSaved(true))
		}
	})
}

export const patchBrandProfileQuestions = (data) => {
	let brandProfileId = data.brandProfileId
	let questions = data.questions

	let url = apiBase + `/brand-profile/${brandProfileId}/questions`

	return questionsQueue.wrap(async (dispatch) => {
		dispatch(setBrandProfileSaving(true))
		const result = await axios.patch(url, questions)
		if (result.status === 201 || result.status === 200) {
			dispatch(setBrandProfileSaving(false))
			dispatch(setBrandProfileSaved(true))
		}
	})
}

export function addBrandProfile(brandProfile) {
	return {
		type: ADD_BRAND_PROFILE,
		brandProfile
	}
}

export function removeBrandProfile(brandProfileId) {
	return {
		type: REMOVE_BRAND_PROFILE,
		brandProfileId
	}
}

export const deleteBrandProfile = (brandProfileId) => {
	let url = apiBase + `/brand-profile/${brandProfileId}`
	return (dispatch) => {
		dispatch(setBrandProfileDeleting(true))
		dispatch(removeBrandProfile(brandProfileId))
		axios
			.delete(url)
			.then((response) => {
				dispatch(setBrandProfileDeleting(false))
				toast.success('Brand profile deleted!')
			})
			.catch((error) => {
				console.error(error)
			})
	}
}

export function fetchBrandProfiles(accountId) {
	let url = apiBase + `/account/${accountId}/brand-profiles`
	return async (dispatch) => {
		dispatch(brandProfilesIsLoading(true))
		try {
			const result = await axios.get(url)
			if (result.status === 200) {
				brandProfilesObjValidation.validate(result.data).catch(function(err) {
					console.log(err.name, err.errors)
					alert(
						' we received different data from the api than expected while fetching all brand profiles, see console log for more details'
					)
				})

				let brandProfiles = result.data
				if (brandProfiles.length < 1) {
					dispatch(hasBrandProfiles(false))
				}

				dispatch(setBrandProfiles(brandProfiles))
				dispatch(brandProfilesIsLoading(false))
			}
		} catch (error) {
			alert(error)
		}
	}
}

export function setBrandProfileLoading(bool) {
	return {
		type: SET_BRAND_PROFILE_LOADING,
		brandProfileLoading: bool
	}
}

export function brandProfilesIsLoading(bool) {
	return {
		type: BRAND_PROFILES_IS_LOADING,
		brandProfilesIsLoading: bool
	}
}

export function setBrandProfileSaving(bool) {
	return {
		type: SET_BRAND_PROFILE_SAVING,
		brandProfileSaving: bool
	}
}
export function setBrandProfileSaved(bool) {
	return {
		type: SET_BRAND_PROFILE_SAVED,
		brandProfileSaved: bool
	}
}

export function setBrandProfileCreated(bool) {
	return {
		type: BRAND_PROFILE_CREATED,
		brandProfileCreated: bool
	}
}
export function setBrandProfileCreating(bool) {
	return {
		type: BRAND_PROFILE_CREATING,
		brandProfileCreating: bool
	}
}

export function setBrandProfileDeleting(bool) {
	return {
		type: BRAND_PROFILE_DELETING,
		brandProfileDeleting: bool
	}
}

export function setScenariosIsLoading(bool) {
	return {
		type: SCENARIOS_IS_LOADING,
		scenariosIsLoading: bool
	}
}

export function hasBrandProfiles(bool) {
	return {
		type: HAS_BRAND_PROFILES,
		hasBrandProfiles: bool
	}
}
