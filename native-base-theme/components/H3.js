import variable from "./../variables/platform";
import material from '@theme/variables/material';

export default (variables = variable) => {
  const h3Theme = {
    color: variables.textColor,
    fontSize: variables.fontSizeH3,
    lineHeight: variables.lineHeightH3,
    fontFamily: material.fontBold,
    textAlign: 'left'
  };

  return h3Theme;
};
