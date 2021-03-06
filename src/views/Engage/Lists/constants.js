export const objectives = [
	{ objectiveId: 1, objectiveName: 'Reach & Awareness' },
	{ objectiveId: 2, objectiveName: 'Branding' },
	{ objectiveId: 3, objectiveName: 'Conversions' }
]

export const activeStatuses = [
	{ activeStatusId: 1, activeStatusName: 'Active' },
	{ activeStatusId: 2, activeStatusName: 'Not Active' }
]

export const archivedStatuses = [
	{ archivedStatusId: 1, archivedStatusName: 'Archived' },
	{ archivedStatusId: 2, archivedStatusName: 'Not Archived' }
]

export const targetTypes = [
	{ targetTypeId: 1, targetTypeName: 'Trend' },
	{ targetTypeId: 2, targetTypeName: 'Persona' },
	{ targetTypeId: 3, targetTypeName: 'Influencer' },
	{ targetTypeId: 4, targetTypeName: 'Other' }
]

export const listActions = {
	target: {
		actionId: 1,
		text: 'Target'
	},
	block: {
		actionId: 2,
		text: 'Block'
	},
	watch: {
		actionId: 3,
		text: 'Watch'
	}
}

export const channelColumns = [
	'image',
	'name',
	//	'createDate', //not shown by default
	'ytCategory',
	'latestVideoUploadDate',
	'iabCategory',
	'videos',
	'views',
	'subscribers',
	'actions'
]

export const videoColumns = [
	'image',
	'name',
	'uploaded',
	'category',
	'likes',
	'dislikes',
	'views',
	'subscribers',
	'comments',
	'iabCategory',
	'actions'
]
