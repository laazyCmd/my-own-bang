/** initialization of default values for the first runtime (runs once after install/update) */
const initializeDefault = ( details ) => {
    browser.storage.local.get( [ "hostname", "bangs" ] ).then( items => {
        if ( items[ "hostname" ] === undefined ) browser.storage.local.set( { hostname: "duckduckgo.com" } );
        if ( items[ "bangs" ] === undefined ) browser.storage.local.set( { 
        bangs: { 
                odysee: "https://odysee.com/$/search?q={{s}}" ,
                piped: "https://piped.kavin.rocks/results?search_query={{s}}"
            } 
        } );
    } );
};

browser.runtime.onInstalled.addListener( initializeDefault );

const getHostname = async () => {
    await browser.storage.local.get( "hostname" ).then( data => {
        return data;
    } );
};

const checkBang = async ( details ) => {
    const search_query = /(%21)(\w+)(([+]\w+)*)/.exec( details.url ); // get prefix and search query
    const prefix = search_query[2];
    
    if ( search_query[3] === "" ) {
        await browser.storage.local.get( "bangs" ).then( data => {
            if ( data.bangs[ prefix ] ) {
                const domain_name = /((https|http):\/\/([www]*)(([.]*)(\w+))*)/.exec( data.bangs[ prefix ] );
                navigateToBang( domain_name[0] );
            }
        } );
    } else {
        await browser.storage.local.get( "bangs" ).then( data => {
            if ( data.bangs[ prefix ] ) navigateToBang( data.bangs[ prefix ], search_query[ 3 ].trim() );
        } );
    }
};

const navigateToBang = ( address, query ) => {
    if ( query ) browser.tabs.update( { url: address.replace( "{{s}}", query ) } );
    else browser.tabs.update( { url: address } );
}

browser.webNavigation.onBeforeNavigate.addListener( checkBang, { url: [ { hostEquals: getHostname().hostname } ] } );