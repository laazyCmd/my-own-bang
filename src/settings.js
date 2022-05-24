/**
 *  Saving/data lists
 */
 const test = async () => {
    await browser.storage.local.get().then( items => console.log( items ) );
};

test();