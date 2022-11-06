import color from "color";

import { Platform, Dimensions, PixelRatio } from "react-native";
import Device from '../../src/core/helper/device';
import Identify from '../../src/core/helper/Identify';
import Fonts from '../../assets/fonts/fonts';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = "material";
const isIphoneX =
    platform === "ios" && (deviceHeight === 812 || deviceWidth === 812);
const isTablet = Device.isTablet();

const appFont = Identify.appConfig ? (platform === 'ios' ? Identify.appConfig.ios_font : Identify.appConfig.android_font) : null
export default {
    platformStyle,
    platform,

    //Accordion
    headerStyle: "#edebed",
    iconStyle: "#000",
    contentStyle: "#f5f4f5",
    expandedIconStyle: "#000",
    accordionBorderColor: "#d3d3d3",

    // Android
    androidRipple: true,
    androidRippleColor: "rgba(256, 256, 256, 0.3)",
    androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
    btnUppercaseAndroidText: true,

    // Badge
    badgeBg: "#ED1727",
    badgeColor: "#fff",
    badgePadding: 0,

    // Button
    btnFontFamily: this.fontFamily,
    btnDisabledBg: "#b5b5b5",
    buttonPadding: 6,
    get btnPrimaryBg() {
        return this.brandPrimary;
    },
    get btnPrimaryColor() {
        return this.inverseTextColor;
    },
    get btnInfoBg() {
        return this.brandInfo;
    },
    get btnInfoColor() {
        return this.inverseTextColor;
    },
    get btnSuccessBg() {
        return this.brandSuccess;
    },
    get btnSuccessColor() {
        return this.inverseTextColor;
    },
    get btnDangerBg() {
        return this.brandDanger;
    },
    get btnDangerColor() {
        return this.inverseTextColor;
    },
    get btnWarningBg() {
        return this.brandWarning;
    },
    get btnWarningColor() {
        return this.inverseTextColor;
    },
    get btnTextSize() {
        return this.fontSizeBase + (this.isTablet ? 5 : 1);
    },
    get btnTextSizeLarge() {
        return this.fontSizeBase * 1.5;
    },
    get btnTextSizeSmall() {
        return this.fontSizeBase * 0.8;
    },
    get borderRadiusLarge() {
        return this.fontSizeBase * 3.8;
    },
    get iconSizeLarge() {
        return this.iconFontSize * 1.5;
    },
    get iconSizeSmall() {
        return this.iconFontSize * 0.6;
    },

    // Card
    cardDefaultBg: "#fff",
    cardBorderColor: "#ccc",
    cardBorderRadius: 2,
    cardItemPadding: platform === "ios" ? 10 : 12,

    // CheckBox
    CheckboxRadius: 0,
    CheckboxBorderWidth: 2,
    CheckboxPaddingLeft: 2,
    CheckboxPaddingBottom: 0,
    CheckboxIconSize: 17,
    CheckboxIconMarginTop: 1,
    CheckboxFontSize: 20,
    checkboxBgColor: "#039BE5",
    checkboxSize: 30,
    checkboxTickColor: "#fff",

    // Color
    get brandPrimary() {
        if (Identify.theme && Identify.theme.button_background) {
            return Identify.theme.button_background;
        }
        return "#3F51B5";
    },
    brandInfo: "#62B1F6",
    brandSuccess: "#5cb85c",
    brandDanger: "#d9534f",
    brandWarning: "#f0ad4e",
    brandDark: "#000",
    brandLight: "#f4f4f4",

    //Container
    containerBgColor: "#fff",

    //Date Picker
    datePickerTextColor: "#000",
    datePickerBg: "transparent",

    // Font
    DefaultFontSize: this.isTablet ? 28 : 14,
    get fontFamily() {
        if (Identify.locale_identifier && Fonts[Identify.locale_identifier] !== undefined && Fonts[Identify.locale_identifier]['normal'] !== '') {
            return Fonts[Identify.locale_identifier]['normal'];
        }else {
            return Fonts.default.normal;
        }
    },
    get fontBold() {
        if (Identify.locale_identifier && Fonts[Identify.locale_identifier] !== undefined && Fonts[Identify.locale_identifier]['bold'] !== '') {
            return Fonts[Identify.locale_identifier]['bold'];
        }else {
            return Fonts.default.bold;
        }
    },
    fontSizeBase: 15,
    get fontSizeH1() {
        return this.fontSizeBase * (this.isTablet ? 1.8 : 1.6);
    },
    get fontSizeH2() {
        return this.fontSizeBase * (this.isTablet ? 1.6 : 1.4);
    },
    get fontSizeH3() {
        return this.fontSizeBase * (this.isTablet ? 1.4 : 1.2);
    },

    // Footer
    footerHeight: 55,
    footerDefaultBg: "#3F51B5",
    footerPaddingBottom: 0,

    // FooterTab
    tabBarTextColor: "#bfc6ea",
    tabBarTextSize: 11,
    activeTab: "#fff",
    sTabBarActiveTextColor: "#007aff",
    tabBarActiveTextColor: "#fff",
    tabActiveBgColor: "#3F51B5",

    // Header
    get toolbarBtnColor() {
        if (Identify.theme && Identify.theme.top_menu_icon_color) {
            return Identify.theme.top_menu_icon_color;
        }
        return '#fff';
    },
    get toolbarDefaultBg() {
        if (Identify.theme && Identify.theme.key_color) {
            return Identify.theme.key_color;
        }
        return "#3F51B5";
    },
    toolbarHeight: platform == 'ios' ? 78 : 66,
    toolbarSearchIconSize: 23,
    toolbarInputColor: "#fff",
    searchBarHeight: platform === "ios" ? 30 : 40,
    searchBarInputHeight: platform === "ios" ? 40 : 50,
    toolbarBtnTextColor: "#fff",
    toolbarDefaultBorder: "#3F51B5",
    iosStatusbar: "light-content",
    get statusBarColor() {
        return color(this.toolbarDefaultBg)
            .darken(0.2)
            .hex();
    },
    get darkenHeader() {
        return color(this.tabBgColor)
            .darken(0.03)
            .hex();
    },

    // Icon
    iconFamily: "Ionicons",
    iconFontSize: 28,
    iconHeaderSize: 24,
    iconColor: Identify.theme && Identify.theme.icon_color ? Identify.theme.icon_color : '#000000',

    // InputGroup
    inputFontSize: 14,
    inputBorderColor: "#D9D5DC",
    inputSuccessBorderColor: "#2b8339",
    inputErrorBorderColor: "#ed2f2f",
    inputHeightBase: 50,
    get inputColor() {
        return this.textColor;
    },
    get inputColorPlaceholder() {
        return "#575757";
    },

    // Line Height
    btnLineHeight: 19,
    lineHeight: 24,

    // List
    listBg: "transparent",
    listBorderColor: Identify.theme && Identify.theme.menu_line_color ? Identify.theme.menu_line_color : "#c9c9c9",
    listDividerBg: "#f4f4f4",
    listBtnUnderlayColor: "#DDD",
    listItemPadding: 12,
    listNoteColor: "#808080",
    listNoteSize: 13,
    listItemSelected: "#3F51B5",

    // Progress Bar
    defaultProgressColor: "#E4202D",
    inverseProgressColor: "#1A191B",

    // Radio Button
    radioBtnSize: 23,
    radioSelectedColorAndroid: "#3F51B5",
    radioBtnLineHeight: 24,
    get radioColor() {
        return this.brandPrimary;
    },

    // Segment
    segmentBackgroundColor: "#3F51B5",
    segmentActiveBackgroundColor: "#fff",
    segmentTextColor: "#fff",
    segmentActiveTextColor: "#3F51B5",
    segmentBorderColor: "#fff",
    segmentBorderColorMain: "#3F51B5",

    // Spinner
    defaultSpinnerColor: "#45D56E",
    inverseSpinnerColor: "#1A191B",

    // Tab
    tabDefaultBg: "#3F51B5",
    topTabBarTextColor: "#b3c7f9",
    topTabBarActiveTextColor: "#fff",
    topTabBarBorderColor: "#fff",
    topTabBarActiveBorderColor: "#fff",

    // Tabs
    tabBgColor: "#F8F8F8",
    tabFontSize: 15,

    // Text
    get textColor() {
        if (Identify.theme && Identify.theme.content_color) {
            return Identify.theme.content_color;
        }
        return "#000";
    },
    inverseTextColor: Identify.theme && Identify.theme.button_text_color ? Identify.theme.button_text_color : "#fff",
    noteFontSize: 14,
    get defaultTextColor() {
        return this.textColor;
    },

    // Title
    titleFontfamily: this.fontFamily,
    titleFontSize: 19,
    subTitleFontSize: 14,
    subtitleColor: "#FFF",
    titleFontColor: "#FFF",

    // Other
    borderRadiusBase: 2,
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    contentPadding: 10,
    dropdownLinkColor: "#414142",
    inputLineHeight: 24,
    deviceWidth,
    deviceHeight,
    isIphoneX,
    inputGroupRoundedBorderRadius: 30,

    //iPhoneX SafeArea
    Inset: {
        portrait: {
            topInset: 24,
            leftInset: 0,
            rightInset: 0,
            bottomInset: 34
        },
        landscape: {
            topInset: 0,
            leftInset: 44,
            rightInset: 44,
            bottomInset: 21
        }
    },

    // Simi Additional
    // font Size
    textSizeLabel: this.isTablet ? 24 : 20,
    textSizeBigger: this.isTablet ? 22 : 18,
    textSizeSmall: this.isTablet ? 18 : 14,
    textSizeTiny: this.isTablet ? 16 : 12,

    // Other
    textSize5: this.isTablet ? 9 : 5,
    textSize6: this.isTablet ? 10 : 6,
    textSize7: this.isTablet ? 11 : 7,
    textSize8: this.isTablet ? 12 : 8,
    textSize9: this.isTablet ? 13 : 9,
    textSize10: this.isTablet ? 14 : 10,
    textSize11: this.isTablet ? 15 : 11,
    textSize13: this.isTablet ? 17 : 13,
    textSize15: this.isTablet ? 19 : 15,
    textSize17: this.isTablet ? 21 : 17,
    textSize19: this.isTablet ? 23 : 19,
    textSize21: this.isTablet ? 25 : 21,
    textSize22: this.isTablet ? 26 : 22,
    textSize23: this.isTablet ? 27 : 23,
    textSize24: this.isTablet ? 28 : 24,
    textSize25: this.isTablet ? 29 : 25,
    textSize26: this.isTablet ? 30 : 26,

    get getsearchbackgroundcColor() {
        if (Identify.theme && Identify.theme.search_box_background) {
            return Identify.theme.search_box_background;
        }
        return '#EDEDED';
    },
    get menuLeftColor() {
        if (Identify.theme && Identify.theme.menu_background) {
            return Identify.theme.menu_background;
        }
        return '#fff';
    },
    get menuLeftTextColor() {
        if (Identify.theme && Identify.theme.menu_text_color) {
            return Identify.theme.menu_text_color;
        }
        return '#000';
    },
    get menuLeftIconColor() {
        if (Identify.theme && Identify.theme.menu_icon_color) {
            return Identify.theme.menu_icon_color;
        }
        return '#000';
    },
    get menuLeftLineColor() {
        if (Identify.theme && Identify.theme.menu_line_color) {
            return Identify.theme.menu_line_color;
        }
        return '#000';
    },
    get searchtextColor() {
        if (Identify.theme && Identify.theme.search_text_color) {
            return Identify.theme.search_text_color;
        }
        return '#7f7f7f';
    },
    get appBackground() {
        if (Identify.theme && Identify.theme.app_background) {
            return Identify.theme.app_background;
        }
        return 'transparent';
    },
    get contentColor() {
        if (Identify.theme && Identify.theme.content_color) {
            return Identify.theme.content_color;
        }
        return '#000000';
    },
    get priceColor() {
        if (Identify.theme && Identify.theme.price_color) {
            return Identify.theme.price_color;
        }
        return '#000000';
    },
    get secpicalPriceColor() {
        if (Identify.theme && Identify.theme.special_price_color) {
            return Identify.theme.special_price_color;
        }
        return '#f20404';
    },
    get sectionColor() {
        if (Identify.theme && Identify.theme.section_color) {
            return Identify.theme.section_color;
        }
        return '#000000';
    },
    get imageBorderColor() {
        if (Identify.theme && Identify.theme.image_border_color) {
            return Identify.theme.image_border_color;
        }
        return '#ffffff';
    },
};
