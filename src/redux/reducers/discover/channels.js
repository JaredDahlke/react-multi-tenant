import {
	SET_CHANNELS,
	SET_VIDEOS,
	REMOVE_ALL_VIDEOS,
	REMOVE_ALL_CHANNELS,
	SET_HAS_NEXT_PAGE
} from '../../action-types/discover/channels'

export function videos(state = [], action) {
	switch (action.type) {
		case SET_VIDEOS:
			let currentVideos = [...state].concat(action.videos)
			return currentVideos
		case REMOVE_ALL_VIDEOS:
			return []
		default:
			return state
	}
}

export function channels(state = [], action) {
	switch (action.type) {
		case SET_CHANNELS:
			let currentChannels = [...state].concat(action.channels)
			return currentChannels
		case REMOVE_ALL_CHANNELS:
			return []
		default:
			return state
	}
}

export function hasNextPage(state = true, action) {
	switch (action.type) {
		case SET_HAS_NEXT_PAGE:
			return action.hasNextPage
		default:
			return state
	}
}
