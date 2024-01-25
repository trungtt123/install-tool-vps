const newTab = require('./newTab');
const openUrl = require('./openUrl');
const closeTabByDomain = require('./closeTabByDomain');
const closeTabByIndex = require('./closeTabByIndex');
const goBack = require('./goBack');
const reload = require('./reload');
const activateTabByDomain = require('./activeTabByDomain');
const activateTabByIndex = require('./activeTabByIndex');
const zoomTab = require('./zoomTab');
const closeActiveTab = require('./closeActiveTab');
const getCurrentPageIndexByUrl = require('./getCurrentPageIndexByUrl');
const navigation = {
    getCurrentPageIndexByUrl,
    newTab,
    openUrl,
    closeTabByDomain,
    closeTabByIndex,
    closeActiveTab,
    goBack, 
    reload,
    activateTabByDomain,
    activateTabByIndex,
    zoomTab
}
module.exports = navigation;