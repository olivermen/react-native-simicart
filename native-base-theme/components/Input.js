import variable from './../variables/platform';
import material from '@theme/variables/material';

export default (variables = variable) => {
	const inputTheme = {
		'.multiline': {
			height: null,
		},
		height: variables.inputHeightBase,
		color: variables.inputColor,
		paddingLeft: 5,
		paddingRight: 5,
		flex: 1,
		fontSize: variables.inputFontSize,
		fontFamily: material.fontFamily
	};

	return inputTheme;
};
