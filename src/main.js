const filter = {
    url: [
        { hostPrefix: "duckduckgo" }
    ]
};

function checkURL( details ) {
    const regexp = /(%21)(\w+)[+]((\w+|[+])+)/;
    const search_query = regexp.exec( details.url );
    if ( search_query[2] === "piped" ) {
       const url = "https://piped.kavin.rocks/results?search_query={{s}}";
       browser.tabs.update( { url: url.replace( "{{s}}", search_query[3] ) } );
    }
}

browser.webNavigation.onBeforeNavigate.addListener( checkURL, filter ); 