/** remove data from a bang list */
const removeBangs = async () => {
    let saved_bangs = {};
    let to_remove = [];
    
    const bangs = document.getElementById( "bang-list" );
    for ( const bang of bangs.children ) {
        const checkbox = bang.getElementsByTagName( "input" )[ 0 ];
        if ( checkbox.checked ) to_remove.push( bang );
        else saved_bangs[ bang.id ] = bang.getElementsByTagName( "span" )[ 1 ].innerText;
    }

    // remove selected bangs
    for ( const removed of to_remove ) {
        bangs.removeChild( removed );
    }
    
    const new_bangs = Object.fromEntries( Object.entries( saved_bangs ).sort() );
    await browser.storage.local.set( { bangs: new_bangs } );
    loadBangs( new_bangs, bangs.children[ 0 ] );
};

/** save data from hostname list */
const saveHostname = async () => {
    const hostname_entry = document.getElementsByClassName( "hostname-entry" )[ 0 ];

    const input = hostname_entry.getElementsByTagName( "span" )[ 0 ];
    input.contentEditable = false;

    const new_hostname = input.innerText || "duckduckgo.com";
    await browser.storage.local.set( { hostname: new_hostname } );
    loadHostname( new_hostname, hostname_entry );
};

/** save data from bangs list */
const saveBangs = async () => {
    let saved_bangs = {};

    const bangs = document.getElementsByClassName( "bang-entry" );
    for ( const bang of bangs ) {
        const input = bang.getElementsByTagName( "span" );
        if ( ( input[ 0 ].innerText === "%bang%" || input[ 0 ].innerText === "" ) && 
            input[ 1 ].innerText === "%bang_url%" ) continue;
        
        if ( input[ 0 ].isContentEditable || input[ 1 ].isContentEditable ) {
            saved_bangs[ input[0].innerText ] = input[1].innerText || "https://piped.kavin.rocks/watch?v=dQw4w9WgXcQ";
        } else saved_bangs[ bang.id ] = input[1].innerText;
    }

    const new_bangs = Object.fromEntries( Object.entries( saved_bangs ).sort() );
    await browser.storage.local.set( { bangs: new_bangs } );
    loadBangs( new_bangs, bangs[ 0 ] );
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
const loadHostname = ( hostname, template ) => {
    // stop if template is missing
    if ( !template ) return;

    // disable editing
    template.getElementsByTagName( "span" )[ 0 ].contentEditable = false;

    template.id = hostname;

    const details = template.getElementsByTagName( "span" )[ 0 ];
    details.innerText = hostname;

    details.addEventListener( 'click', () => {
        details.contentEditable = true;
        document.getElementById( "hostname-save" ).disabled = false;
    } );

    document.getElementById( "hostname-save" ).disabled = true;
};

/** show data inside bang list */
const loadBangs = ( bangs, template ) => {
    // stop if template is missing
    if ( !template ) return;

    // untick checkbox and disable editing
    template.getElementsByTagName( "input" )[ 0 ].checked = false;
    template.getElementsByTagName( "span" )[ 0 ].contentEditable = false;
    template.getElementsByTagName( "span" )[ 1 ].contentEditable = false;

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

    document.getElementById( "bangs-rem" ).disabled = true;
    document.getElementById( "bangs-save" ).disabled = true;
};

/** show data inside respective lists */
const loadLists = ( hostname, bangs ) => {
    // clone templates
    const hostname_template = document.getElementsByClassName( "hostname-entry" )[0];
    const bang_template = document.getElementsByClassName( "bang-entry" )[0];

    // clear default bang template
    document.getElementsByClassName( "bang-entry" )[0].remove();

    // load hostname
    loadHostname( hostname, hostname_template );

    // load bangs
    loadBangs( bangs, bang_template );

    // initialize hostname save
    document.getElementById( "hostname-save" ).addEventListener( "click", saveHostname );
    
    // initialize bangs buttons
    document.getElementById( "bangs-rem" ).addEventListener( "click", removeBangs );
    document.getElementById( "bangs-save" ).addEventListener( "click", saveBangs );
    document.getElementById( "bangs-add" ).addEventListener( "click", () => addBang( bang_template ) );
};


/** page routing */
const routes = [
    "pages/index.html",
    "pages/help.html",
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
            await browser.storage.local.get( [ "hostname", "bangs" ] )
            .then( data => loadLists( data.hostname, data.bangs ) );
    };
};

document.getElementById( "bangs-btn" ).addEventListener( "click", () => route( 0 ) );
document.getElementById( "help-btn" ).addEventListener( "click", () => route( 1 ) );
document.getElementById( "about-btn" ).addEventListener( "click", () => route( 2 ) );

/** run on page load */
window.onload = ( event ) => route( 0 ); // start at index.html