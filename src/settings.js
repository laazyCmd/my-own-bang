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

/** show data inside respective lists */
const loadLists = ( hostnames, bangs ) => {
    // templates
    const hostname = document.getElementsByClassName( "hostname-entry" )[0].cloneNode( true );
    const bang = document.getElementsByClassName( "bang-entry" )[0].cloneNode( true );

    // clear templates
    document.getElementsByClassName( "hostname-entry" )[0].remove();
    document.getElementsByClassName( "bang-entry" )[0].remove();

    // load hostnames
    hostnames.forEach( ( value, index ) => {
        document.getElementById( "hostname-list" ).appendChild( hostname.cloneNode( true ) );
        document.getElementsByClassName( "hostname-entry" )[ index ].id = value;

        const details = document.getElementById( value ).getElementsByTagName( "span" );
        const checkbox = document.getElementById( value ).getElementsByTagName( "input" )[0];

        details[0].innerHTML = value;

        checkbox.addEventListener( 'click', () => document.getElementById( "hostnames-rem" ).disabled = false );
        details[0].addEventListener( 'click', () => {
            details[0].contentEditable = true;
            document.getElementById( "hostnames-save" ).disabled = false 
        } );
    } );

    // load bangs
    Object.entries( bangs ).forEach( ( pairs, index ) => {
        document.getElementById( "bang-list" ).appendChild( bang.cloneNode( true ) );
        document.getElementsByClassName( "bang-entry" )[ index ].id = pairs[ 0 ];

        const details = document.getElementById( pairs[ 0 ] ).getElementsByTagName( "span" );
        const checkbox = document.getElementById( pairs[ 0 ] ).getElementsByTagName( "input" )[0];

        details[0].innerHTML = pairs[0];
        details[1].innerHTML = pairs[1];

        checkbox.addEventListener( 'click', () => document.getElementById( "bangs-rem" ).disabled = false );
        details[0].addEventListener( 'click', () => {
            details[0].contentEditable = true
            document.getElementById( "bangs-save" ).disabled = false 
        } );
        details[1].addEventListener( 'click', () => {
            details[1].contentEditable = true
            document.getElementById( "bangs-save" ).disabled = false 
        } );
    } );
}


document.getElementById( "bangs-btn" ).addEventListener( "click", () => route( 0 ) );
document.getElementById( "about-btn" ).addEventListener( "click", () => route( 1 ) );


/** run on page load */
window.onload = ( event ) => route( 0 ); // start at index.html