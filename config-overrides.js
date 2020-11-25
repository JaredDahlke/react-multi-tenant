const { override, addLessLoader } = require('customize-cra')

const neutralColor = process.env.REACT_APP_NEUTRAL
const neutralLightColor = process.env.REACT_APP_NEUTRAL_LIGHT
const neutralExtraLightColor = process.env.REACT_APP_NEUTRAL_EXTRA_LIGHT
const accentColor = process.env.REACT_APP_ACCENT

module.exports = override(
	addLessLoader({
		// If you are using less-loader@5 or older version, please spread the lessOptions to options directly.
		lessOptions: {
			javascriptEnabled: true,
			modifyVars: {
				'@base-color': accentColor,
				//	'@primary-color': 'yellow',

				'@dropdown-bg': neutralLightColor,

				//input
				'@input-bg': neutralColor,
				'@input-color': '#FFF',
				'@input-group-addon-bg': neutralColor,

				'@picker-select-menu-item-selected-bg': neutralLightColor,

				//'@picker-tree-node-active-color': 'purple',
				// '@picker-select-menu-item-selected-bg' : 'pink',
				//'@picker-tree-node-active-bg': 'yellow'
				// '@picker-select-menu-item-selected-color': 'yellow',
				'@picker-select-item-color': '#FFF',
				'@picker-menu-item-hover-bg': neutralColor,
				'@picker-tree-node-hover-bg': neutralLightColor,
				'@text-color': '#FFF',
				'@font-family-base': '"Roboto", "Helvetica", "Arial", sans-serif',
				'@font-size-base': '16px',
				'@input-bg-disabled': neutralColor,

				//navbar
				'@nav-bar-default-bg': neutralColor,
				'@nav-bar-default-active-color': 'yellow',
				'@nav-bar-default-font-color': '#FFF',
				'@nav-bar-default-active-bg': neutralColor,
				'@nav-item-default-hover-bg': neutralExtraLightColor,
				'@dropdown-link-hover-bg': neutralLightColor,

				//'@btn-default-hover-bg': 'yellow',
				////	'@btn-default-active-bg': accentColor,

				'@nav-subtle-hover-bg': 'red',
				//	'@nav-bar-subtle-hover-bg': 'green',
				'@btn-subtle-hover-bg': neutralColor,
				'@btn-subtle-focus-bg': neutralColor,
				//'@btn-subtle-active-color': neutralColor,
				//'@btn-subtle-active-default-color': neutralColor,
				'@btn-subtle-active-default-bg': neutralColor,

				//button
				'@btn-default-bg': accentColor,
				'@btn-default-disabled-bg': neutralLightColor,
				'@btn-default-hover-bg': accentColor,
				'@btn-default-focus-bg': accentColor,
				'@btn-link-color': accentColor,
				'@btn-subtle-color': '#FFF',
				'@btn-subtle-active-color': accentColor,
				'@btn-subtle-active-default-color': accentColor,

				//messages
				'@message-success-bg': neutralExtraLightColor,
				'@message-warning-bg': neutralExtraLightColor,
				'@message-header-color': '#FFF',

				//tables
				'@table-body-background': neutralColor,
				'@table-head-background': neutralColor,
				'@table-body-hover-background': neutralExtraLightColor,
				'@table-head-font-color': '#FFF',
				//panel
				'@panel-heading-color': '#FFF',
				'@panel-border': '1px solid' + neutralExtraLightColor,

				//steps
				//	'@steps-default-color': '#FFF',
				'@steps-tail-default-color': '#FFF',
				'@steps-content-process-color': '#FFF',

				//divider:
				'@divider-border-color': neutralExtraLightColor,

				//loader
				'@loader-spin-ring-color': accentColor,
				'@loader-spin-ring-active-color': '#FFF',
				'@loader-content-color': '#FFF',

				//checkbox
				'@checkbox-disabled-color': neutralExtraLightColor,

				//uploader
				'@uploader-default-font-color': '#FFF',
				'@uploader-item-hover-background-color': neutralExtraLightColor,

				//nav item
				'@nav-item-font-default-color': '#FFF',
				'@nav-item-click-font-color': '#FFF',

				'@dropdown-link-color': '#FFF',
				'@dropdown-link-active-color': '#FFF',

				//toggle
				'@toggle-default-bg': neutralExtraLightColor,
				'@toggle-inner-text-color': '#FFF',
				'@toggle-default-hover-bg': neutralLightColor
			}
		}
	})
)
