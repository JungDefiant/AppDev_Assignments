function checkListingTitle(listingTitle) {
    if(listingTitle.length < 5 || listingTitle.length > 50) {
        return false;
    }

    return true;
}

module.exports = {
    checkListingTitle
};