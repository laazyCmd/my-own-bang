/** remove data from a hostname list */
const removeHostnames = async () => {
    let saved_hostnames = [];

    const hostnames = document.getElementById( "hostname-list" );
    const to_remove = [];
    for ( const hostname of hostnames.children ) {
        const checkbox = hostname.getElementsByTagName( "input" )[ 0 ];
        if ( checkbox.checked ) {
            to_remove.push( hostname );
            continue;
        }

        saved_hostnames.push( hostname );
    }

    // remove selected hostnames
    for ( const removed of to_remove ) {
        hostnames.removeChild( removed );
    }
    
    await browser.storage.local.set( { hostnames: saved_hostnames.sort() } );

    document.getElementById( "hostnames-rem" ).disabled = true;
    loadHostnames( saved_hostnames, hostnames.children[ 0 ] );
};

/** remove data from a bang list */
const removeBangs = async () => {
    let saved_bangs = {};
    await browser.storage.local.get( [ "bangs" ] )
    .then( data => saved_bangs = data.bangs );

    const bangs = document.getElementById( "bang-list" );
    const to_remove = [];
    for ( const bang of bangs.children ) {
        const checkbox = bang.getElementsByTagName( "input" )[ 0 ];
        if ( checkbox.checked ) {
            delete saved_bangs[ bang.id ];
            to_remove.push( bang );
        }
    }

    // remove selected bangs
    for ( const removed of to_remove ) {
        bangs.removeChild( removed );
    }

    const new_bangs = Object.fromEntries( Object.entries( saved_bangs ).sort() );
    await browser.storage.local.set( { bangs: new_bangs } );

    document.getElementById( "bangs-rem" ).disabled = true;
    loadBangs( new_bangs, bangs.children[ 0 ] );
};

/** save data from hostnames list */
const saveHostnames = async () => {
    let saved_hostnames = [];

    const hostnames = document.getElementsByClassName( "hostname-entry" );
    for ( let element of hostnames ) {
        const input = element.getElementsByTagName( "span" );
        if ( input[ 0 ].innerText === "%hostname%" ) {
            input[ 0 ].contentEditable = false;
            continue;
        }
        if ( input[0].isContentEditable ) {
            saved_hostnames.push( input[0].innerText );
            input[0].contentEditable = false;
            continue;
        }

        saved_hostnames.push( element.id );
    }

    await browser.storage.local.set( { hostnames: saved_hostnames.sort() } );

    document.getElementById( "hostnames-save" ).disabled = true;
    loadHostnames( saved_hostnames, hostnames[ 0 ] );
};

/** save data from bangs list */
const saveBangs = async () => {
    let saved_bangs = {};
    await browser.storage.local.get( [ "bangs" ] )
    .then( data => saved_bangs = data.bangs );

    const bangs = document.getElementsByClassName( "bang-entry" );
    for ( let element of bangs ) {
        const input = element.getElementsByTagName( "span" );
        if ( input[ 0 ].innerText === "%bang%" && input[ 1 ].innerText === "%bang_url%" ) {
            input[0].contentEditable = false;
            input[1].contentEditable = false;
            continue;
        };
        if ( input[ 0 ].isContentEditable || input[ 1 ].isContentEditable ) {
            delete saved_bangs[ element.id ];
            saved_bangs[ input[0].innerText ] = input[1].innerText || "https://piped.kavin.rocks/watch?v=dQw4w9WgXcQ";
            input[0].contentEditable = false;
            input[1].contentEditable = false;
        }
    }

    const new_bangs = Object.fromEntries( Object.entries( saved_bangs ).sort() );
    await browser.storage.local.set( { bangs: new_bangs } );
    
    document.getElementById( "bangs-save" ).disabled = true;
    loadBangs( new_bangs, bangs[ 0 ] );
};

/** add new data to hostname list */
const addHostname = ( template ) => {
    // enable respective save button
    document.getElementById( "hostnames-save" ).disabled = false;

    const hostname_list = document.getElementById( "hostname-list" );
    const new_hostname = hostname_list.insertAdjacentElement( "afterbegin", template.cloneNode( true ) );
    
    // make editable
    new_hostname.getElementsByTagName( "span" )[ 0 ].contentEditable = true;
};

/** add new data to bangs list */
const addBang = ( template ) => {
    // enable respective save button
    document.getElementById( "bangs-save" ).disabled = false;

    const bang_list = document.getElementById( "bang-list" );
    const new_bang = bang_list.insertAdjacentElement( "afterbegin", template.cloneNode( true ) );
    
    // make editable
    new_bang.getElementsByTagName( "span" )[ 0 ].contentEditable = true;
    new_bang.getElementsByTagName( "span" )[ 1 ].contentEditable = true;
};

/** show data inside hostname list */
const loadHostnames = ( hostnames, template ) => {
    // stop if template is missing
    if ( !template ) return;

    // remove all current hostname entries
    document.getElementById( "hostname-list" ).replaceChildren();

    for ( const name of hostnames ) {
        const hostname = template.cloneNode( true );
        hostname.id = name;

        const details = hostname.getElementsByTagName( "span" );
        const checkbox = hostname.getElementsByTagName( "input" )[0];

        details[ 0 ].innerText = name;

        document.getElementById( "hostname-list" ).appendChild( hostname );

        checkbox.addEventListener( 'click', () => document.getElementById( "hostnames-rem" ).disabled = false );
        details[0].addEventListener( 'click', () => {
            details[0].contentEditable = true;
            document.getElementById( "hostnames-save" ).disabled = false;
        } );
    }
};

/** show data inside bang list */
const loadBangs = ( bangs, template ) => {
    // stop if template is missing
    if ( !template ) return;

    // remove all current bang entries
    document.getElementById( "bang-list" ).replaceChildren();

    // load new bangs
    for ( const [ name, address ] of Object.entries( bangs ) ) {
        const bang = template.cloneNode( true );
        bang.id = name;

        const details = bang.getElementsByTagName( "span" );
        const checkbox = bang.getElementsByTagName( "input" )[0];

        details[0].innerText = name;
        details[1].innerText = address;

        document.getElementById( "bang-list" ).appendChild( bang );

        checkbox.addEventListener( 'click', () => document.getElementById( "bangs-rem" ).disabled = false );
        details[0].addEventListener( 'click', () => {
            details[0].contentEditable = true;
            document.getElementById( "bangs-save" ).disabled = false;
        } );
        details[1].addEventListener( 'click', () => {
            details[1].contentEditable = true;
            document.getElementById( "bangs-save" ).disabled = false;
        } );
    }
};

/** show data inside respective lists */
const loadLists = ( hostnames, bangs ) => {
    // clone templates
    const hostname_template = document.getElementsByClassName( "hostname-entry" )[0].cloneNode( true );
    const bang_template = document.getElementsByClassName( "bang-entry" )[0].cloneNode( true );

    // clear default templates
    document.getElementsByClassName( "hostname-entry" )[0].remove();
    document.getElementsByClassName( "bang-entry" )[0].remove();

    // load hostnames
    loadHostnames( hostnames, hostname_template );

    // load bangs
    loadBangs( bangs, bang_template );

    // initialize remove buttons
    document.getElementById( "hostnames-rem" ).addEventListener( "click", removeHostnames );
    document.getElementById( "bangs-rem" ).addEventListener( "click", removeBangs );

    // initialize saving buttons
    document.getElementById( "hostnames-save" ).addEventListener( "click", saveHostnames );
    document.getElementById( "bangs-save" ).addEventListener( "click", saveBangs );

    // initialize add buttons with templates
    document.getElementById( "hostnames-add" ).addEventListener( "click", () => addHostname( hostname_template ) );
    document.getElementById( "bangs-add" ).addEventListener( "click", () => addBang( bang_template ) );
};


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
    request.onload = async () => {
        document.getElementById( "page" ).innerHTML = request.response;
        if ( index === 0 )
            await browser.storage.local.get( [ "hostnames", "bangs" ] )
            .then( data => loadLists( data.hostnames, data.bangs ) );
    };
};

document.getElementById( "bangs-btn" ).addEventListener( "click", () => route( 0 ) );
document.getElementById( "about-btn" ).addEventListener( "click", () => route( 1 ) );

/** run on page load */
window.onload = ( event ) => route( 0 ); // start at index.html