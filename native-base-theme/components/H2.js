import variable from "./../variables/platform";
import material from '@theme/variables/material';

export default (variables = variable) => {
  const h2Theme = {
    color: variables.textColor,
    fontSize: variables.fontSizeH2,
    lineHeight: variables.lineHeightH2,
    fontFamily: material.fontBold,
  };

  return h2Theme;
};
