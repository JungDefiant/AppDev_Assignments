const {checkListingTitle} = require('./main');

test('"Home" is rejected', () => {
     expect(checkListingTitle("Home")).toBe(false);
});

test('"Beautiful Alki Beach Rental" is successful', () => {
     expect(checkListingTitle("Beautiful Alki Beach Rental")).toBe(true);
});

test('"Tukwila Rental; close to Southcenter Mall and not far from SeaTac" is rejected', () => {
     expect(checkListingTitle("Tukwila Rental; close to Southcenter Mall and not far from SeaTac")).toBe(false);
});
