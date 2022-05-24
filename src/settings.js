/** page routing */
const routes = [
    "pages/index.html",
    "pages/about.html"
];

const route = ( index ) => {
    const route = routes[ index ] || routes[ 0 ];
    const request = new XMLHttpRequest();
    
    request.open( 'GET', route );
    request.send();
    request.onload = () => {
        document.getElementById( "page" ).innerHTML = request.response;
        if ( index === 0 ) 
            browser.storage.local.get( [ "hostnames", "bangs" ] )
            .then( data => loadLists( data.hostnames, data.bangs ) );
    };
};

document.getElementById( "bangs-btn" ).addEventListener( "click", () => route( 0 ) );
document.getElementById( "about-btn" ).addEventListener( "click", () => route( 1 ) );


/** show data inside respective lists */
const loadLists = ( hostnames, bangs ) => {
    // templates
    const hostname_template = document.getElementsByClassName( "hostname-entry" )[0].cloneNode( true );
    const bang_template = document.getElementsByClassName( "bang-entry" )[0].cloneNode( true );

    // clear templates
    document.getElementsByClassName( "hostname-entry" )[0].remove();
    document.getElementsByClassName( "bang-entry" )[0].remove();

    // load hostnames
    hostnames.forEach( ( value, index ) => {
        const hostname = hostname_template.cloneNode( true );

        document.getElementById( "hostname-list" ).appendChild( hostname );
        document.getElementsByClassName( "hostname-name" )[ index ].innerHTML = value;
    } );

    // load bangs
    Object.entries( bangs ).forEach( ( pairs, index ) => {
        const bang = bang_template.cloneNode( true );

        document.getElementById( "bang-list" ).appendChild( bang );
        document.getElementsByClassName( "bang-name" )[ index ].innerHTML = "!" + pairs[0];
        document.getElementsByClassName( "bang-url" )[ index ].innerHTML = pairs[1];
    } );
}


/** load necessary data */
window.onload = ( event ) => route( 0 ); // start at index.html