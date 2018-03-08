'use strict';

import {Dimensions} from 'react-native';

// device width/height
const deviceWidthDp = Dimensions.get('window').width;
// const deviceHeightDp = Dimensions.get('window').height;
// design width/height
const uiHeightPx = 375;

export default function px2dp(uiElementPx) {
    //console.log(deviceWidthDp);
    //console.log(deviceHeightDp);
    return Math.floor(uiElementPx * deviceWidthDp / uiHeightPx);
}