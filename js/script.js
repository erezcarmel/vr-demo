var camera, scene, renderer, controls;

// Setup
function init(demoName) {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

    // Render three.js world

    scene = new THREE.Scene();

    // Choose a random cuebmap ('2' or '3')
    var mapId = Math.floor( Math.random() * ( 3 - 2 + 1 ) ) + 2;

    var cube = generateCubeMap( demoName, 512 );
    scene.add( cube );

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    // Add DeviceOrientation Controls
    controls = new DeviceOrientationController( camera, renderer.domElement );
    controls.connect();

    setupControllerEventHandlers( controls );

    window.addEventListener( 'resize', onWindowResize, false );

}

// Render loop
function animate() {
    controls.update();
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

// Demonstration of some DeviceOrientationController event handling
function setupControllerEventHandlers( controls ) {

    var compassCalibrationPopupEl = document.querySelector( '#calibrate-compass-popup' );
    var compassCalibratedEl = compassCalibrationPopupEl.querySelector( 'button' );

    // Listen for manual interaction (zoom OR rotate)

    controls.addEventListener( 'userinteractionstart', function () {
        renderer.domElement.style.cursor = 'move';
    });

    controls.addEventListener( 'userinteractionend', function () {
        renderer.domElement.style.cursor = 'default';
    });

    // Show a simple 'canvas calibration required' dialog to user
    controls.addEventListener( 'compassneedscalibration', function () {
        compassCalibrationPopupEl.style.visibility = 'visible';

        compassCalibratedEl.addEventListener( 'click', function () {

            compassCalibrationPopupEl.style.visibility = 'hidden';

        });
    });
}

function generateCubeMap( folderName, tileWidth ) {

    var flipAngle  = Math.PI;       // 180 degrees
    var rightAngle = flipAngle / 2; //  90 degrees

    tileWidth = tileWidth || 512;

    var sides = [
        {
            url: './examples/textures/cube/' + folderName + '/posx.jpg',
            position: [ - tileWidth, 0, 0 ],
            rotation: [ 0, rightAngle, 0 ]
        },
        {
            url: './examples/textures/cube/' + folderName + '/negx.jpg',
            position: [ tileWidth, 0, 0 ],
            rotation: [ 0, - rightAngle, 0 ]
        },
        {
            url: './examples/textures/cube/' + folderName + '/posy.jpg',
            position: [ 0, tileWidth, 0 ],
            rotation: [ rightAngle, 0, flipAngle ]
        },
        {
            url: './examples/textures/cube/' + folderName + '/negy.jpg',
            position: [ 0, - tileWidth, 0 ],
            rotation: [ - rightAngle, 0, flipAngle ]
        },
        {
            url: './examples/textures/cube/' + folderName + '/posz.jpg',
            position: [ 0, 0, tileWidth ],
            rotation: [ 0, flipAngle, 0 ]
        },
        {
            url: './examples/textures/cube/' + folderName + '/negz.jpg',
            position: [ 0, 0, - tileWidth ],
            rotation: [ 0, 0, 0 ]
        }
    ];

    var cube = new THREE.Object3D();

    for ( var i = 0; i < sides.length; i ++ ) {

        var side = sides[ i ];

        var element = document.createElement( 'img' );
        element.width = tileWidth * 2 + 2; // 2 pixels extra to close the gap.
        element.src = side.url;

        var object = new THREE.CSS3DObject( element );
        object.position.fromArray( side.position );
        object.rotation.fromArray( side.rotation );
        cube.add( object );

    }

    return cube;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

init('office');
animate();