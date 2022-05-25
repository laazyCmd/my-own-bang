/** initialization of default values for the first runtime (runs once after install/update) */
const initializeDefault = ( details ) => {
    browser.storage.local.get( [ "hostnames", "bangs" ] ).then( items => {
        if ( items[ "hostnames" ] === undefined ) browser.storage.local.set( { hostnames: [ "duckduckgo" ] } );
        if ( items[ "bangs" ] === undefined ) browser.storage.local.set( { 
        bangs: { 
                piped: "https://piped.kavin.rocks/results?search_query={{s}}",
                odysee: "https://odysee.com/$/search?q={{s}}" 
            } 
        } );
    } );
};

browser.runtime.onInstalled.addListener( initializeDefault );

const checkBang = ( details ) => {
    const search_query = /(%21)(\w+)[+]((\w+|[+])+)/.exec( details.url ); // get prefix and search query
    const prefix = search_query[2];

    browser.storage.local.get( "bangs" ).then( data => {
        if ( data.bangs[ prefix ] ) navigateToBang( data.bangs[ prefix ], search_query[ 3 ] );
    } );
};

const navigateToBang = ( address, query ) => {
    browser.tabs.update( { url: address.replace( "{{s}}", query ) } );
}

browser.webNavigation.onBeforeNavigate.addListener( checkBang, { url: [ { hostPrefix: "duckduckgo" } ] } );