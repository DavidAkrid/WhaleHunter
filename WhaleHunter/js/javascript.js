var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
    blue:0x68c3c0,
};

var newColors = {
    green:0x455939,
    yellow:0x93874b,
    white:0xdbdbdb,
    grey: 0x7f7f7f,
    darkGrey: 0x3f3f3f
};

window.addEventListener('load', init, false);

function init() {
	// set up the scene, the camera and the renderer
	createScene();

	createLights();

    createSub();
    createFloor();
    createWhale();
    floor.generateFloor();
    loadSounds();

    
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('click', shootTorpedo, false);
    //renderer.render(scene, camera);
    loop();
}

function loop(){
    updateSub();
    updateWhale();
    updateTorpedo();
    updateExplosion();
    checkCollision();
    
	floor.mesh.rotation.x += .005;

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);
}

var mousePos={x:0, y:0};

// now handle the mousemove event

function handleMouseMove(event) {
	
	var tx = -1 + (event.clientX / WIDTH)*2;
	
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}


function checkCollision()
{
    if(torpedo != null)
    {
        //if torp hits body
        if(Math.abs(torpedo.mesh.position.x - whale.mesh.position.x) < 50 && Math.abs(torpedo.mesh.position.y - whale.mesh.position.y) < 45 && Math.abs(torpedo.mesh.position.z - whale.mesh.position.z) < 150)
        {
            console.log("Body Hit!");
            whaleHealth--;
            whaleSpeed += 0.02;

            explosionScale = 0.1;
            explosionSwitch = false;
            createExplosion();
        } 

        
    }

    /*
    for(var i = 0; i < numMines; i++)
    {
        floor.mine[i].mine.rotation.y += 0.01;

        if(Math.abs(sub.mesh.position.y - floor.mine[i].mine.position.y) < 20 && Math.abs(sub.mesh.position.x - floor.mine[0].mesh.position.x) < 20 && Math.abs((floor.mesh.rotation.x % Math.PI*2) - floor.mine[i].mesh.rotation.x+Math.PI/2)< Math.PI/64)
        {
            console.log("Mine!");
            explosionScale = 0.1;
            explosionSwitch = false;
            createMineExplosion(i);
        }

        if(Math.abs((floor.mesh.rotation.x % Math.PI*2) - floor.mine[i].mesh.rotation.x) < Math.PI/64)
            console.log("Mine upright!");
        
    }
    */
}

var torpedoOut = false;
function shootTorpedo()
{
    //console.log("Mouse Clicked!");
    //if torpedo is launched already
    if(torpedoOut == true && torpedo != null)
    {
        //remove torpedo (explode)
        
        explosionScale = 0.1;
        explosionSwitch = false;

        if(explosion != null)
        {
            scene.remove(explosion.mesh);
        }
        createExplosion();
    }
    else
    {
        //launch torpedo
        createTorpedo();
    }
}

var torpDropped = false;
function updateTorpedo()
{
    if(torpedo != null)
    {
        if(torpedoOut == true)
        {
            torpedo.prop.rotation.y += 0.15;

            if(torpDropped == false)
            {
                torpedo.mesh.position.y -= 1;

                if(Math.abs(sub.mesh.position.y - torpedo.mesh.position.y) > 20)
                {
                    torpDropped = true;
                }
            }
            else
            {
                torpedo.mesh.position.z -= 4;
            }
        }
        else
        {
            torpedo.mesh.position.x = sub.mesh.position.x;
            torpedo.mesh.position.y = sub.mesh.position.y;
        }
    }
}

function updateSub()
{     
    var targetX = normalize(mousePos.x, -1, 1, -WIDTH/10, WIDTH/10);
    var targetY = normalize(mousePos.y, -1, 1, (HEIGHT/10)-75, (HEIGHT/10) + 100);

    sub.mesh.position.y += (targetY-sub.mesh.position.y)*0.1;
    sub.mesh.position.x += (targetX-sub.mesh.position.x)*0.05;

    sub.mesh.rotation.x = -(sub.mesh.position.y-targetY)*0.02;
    sub.mesh.rotation.y = (sub.mesh.position.x-targetX)*0.005 + Math.PI/2;
    
    sub.prop.rotation.y += 0.1;
}

var tailUp = true;
var segUp = true;
var finUp = true;
var whaleRise = false;
var whaleHealth = 5;
function updateWhale()
{
    if(whaleHealth > 0)
    {
       moveWhale();

        if(tailUp == true)
        {
            whale.tail.rotation.x += 0.005;

            if(whale.tail.rotation.x > (Math.PI/16))
            {
                tailUp = false;
            }
        }
        else
        {
            whale.tail.rotation.x -= 0.005;

            if(whale.tail.rotation.x < -Math.PI/16)
            {
                tailUp = true;
            }
        }
        
        if(segUp == true)
        {
            whale.tailSeg.rotation.x += 0.005;

            if(whale.tailSeg.rotation.x > (Math.PI/16))
            {
                segUp = false;
            }
        }
        else
        {
            whale.tailSeg.rotation.x -= 0.005;

            if(whale.tailSeg.rotation.x < -Math.PI/16)
            {
                segUp = true;
            }
        }

        if(finUp == true)
        {
            whale.tailFin.rotation.x += 0.005;
            whale.body.position.y -= 0.1;
            
            if(whale.tailFin.rotation.x > (Math.PI/16))
            {
                finUp = false;
            }
        }
        else
        {
            whale.tailFin.rotation.x -= 0.005;
            whale.body.position.y += 0.1;
            
            if(whale.tailFin.rotation.x < -Math.PI/16)
            {
                finUp = true;
            }
        }
    }
    else
    {
        deadWhale();
    }
}
  
var desiredPos;
var desiredX = 0;
var desiredY = 75;
var whaleSpeed = 0.01;
function moveWhale()
{
    if(Math.abs(whale.mesh.position.x-desiredX) < 2 & Math.abs(whale.mesh.position.y- desiredY) < 2)
    {
        desiredX = Math.ceil((Math.random()*300)-150);
        desiredY = Math.ceil((Math.random()*75)+75);
    }
    var xDistance = (desiredX-whale.mesh.position.x);
    var yDistance = (desiredY-whale.mesh.position.y);

    var yDif = (Math.abs(yDistance)+1)/((yDistance)+1);
    var xDif = (Math.abs(xDistance)+1)/((xDistance)+1);
    

    if(Math.abs(yDistance) > 1)
    {
        whale.mesh.position.y += (yDistance)*whaleSpeed +.3*yDif;
    }
    if(Math.abs(xDistance) > 1)
    {
        whale.mesh.position.x += (xDistance)*whaleSpeed +.3*xDif;
    }

    /*
    var rotSpeed = 0.1;
    if(Math.abs(xDistance) > 50 && Math.abs(whale.mesh.rotation.y-Math.PI) < Math.PI/4)
    {
        whale.mesh.rotation.y -= 0.005 * (xDistance/Math.abs(xDistance));
    }
    else if(Math.abs(xDistance) < 50)
    {
        whale.mesh.rotation.y = (whale.mesh.position.x-desiredX)*(0.004) + Math.PI;
    }*/
    
    //rotateWhale();
    /*TODO- fix whale rotation on movement. -*/
    //whale.mesh.rotation.x = yDistance*0.004;
    //whale.mesh.rotation.y = (whale.mesh.position.x-desiredX)*(0.004) + Math.PI;
    //whale.mesh.rotation.y += 0.005 * (xDistance/Math.abs(xDistance));
}


function deadWhale()
{
    if(whale.mesh.rotation.z < Math.PI)
    {
        whale.mesh.rotation.z += 0.02;
    }
    if(whale.tail.rotation.x < Math.PI/16)
    {
        whale.tail.rotation.x += 0.005;
    }
    if(whale.tailSeg.rotation.x < Math.PI/16)
    {
        whale.tailSeg.rotation.x += 0.005;
    }
    if(whale.tailFin.rotation.x < Math.PI/16)
    {
        whale.tailFin.rotation.x += 0.005;
    }

    whale.mesh.position.y += 0.5;
    whale.mesh.position.z += 0.5;
}

var explosionScale = 0.1;
var explosionSwitch = false;
function updateExplosion()
{
    if(explosion != null)
    {
        explosion.mesh.scale.set(explosionScale,explosionScale,explosionScale);
        explosion.mesh.position.z += 1.5;

        if(explosionSwitch == false)
        {
            
            explosionScale += 0.2;

            if(explosionScale > 1)
            {
                explosionSwitch = true;
            }
        }
        else
        {
            explosionScale -= 0.01;

            if(explosionScale <= 0.1)
            {
                scene.remove(explosion.mesh);
                explosion = null;
                explosionSwitch = false;
                explosionScale = 0.1;
            }
        }

        
    }
}
function normalize(v,vmin,vmax,tmin, tmax){

    var nv = Math.max(Math.min(v,vmax), vmin);
    var dv = vmax-vmin;
    var pc = (nv-vmin)/dv;
    var dt = tmax-tmin;
    var tv = tmin + (pc*dt);
    return tv;

}

var scene,
camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
renderer, container;

function createScene() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();

    // background color used in the style sheet
    scene.fog = new THREE.Fog(0x001644, 100, 950);

    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    // Create the renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(WIDTH, HEIGHT);

    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
}

var hemisphereLight, shadowLight;

function createLights() {
	// the first parameter is the sky color, the second parameter is the ground color, 
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	// Set the direction of the light  
	shadowLight.position.set(150, 350, 350);
	
	// Allow shadow casting 
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
}

var numMines = 10;
Floor = function()
{	
	var geom = new THREE.CylinderGeometry(600,600,800,40,10);	
	// rotate the geometry on the x axis
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));	
    geom.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI/2));

    geom.mergeVertices();
    
    // get the vertices
    var l = geom.vertices.length;

    // create an array to store new data associated to each vertex
    this.waves = [];

    var numRocks = 10;
    var numKelp = 15;
    
   

    for (var i=0; i<l; i++)
    {
        // get each vertex
        var v = geom.vertices[i];

        // store some data associated to it
        this.waves.push({y:v.y,
            x:v.x,
            z:v.z,
            // a random angle
            ang:Math.random()*Math.PI*2,
            // a random distance
            amp:5 + Math.random()*15,
            // a random speed between 0.016 and 0.048 radians / frame
            speed:0.016 + Math.random()*0.032
        });
    };

	// create the material 
	var mat = new THREE.MeshPhongMaterial({
		color:newColors.yellow,
		transparent:false,
		shading:THREE.FlatShading,
	});
	this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;  
    
    for(var i = 0; i < numRocks; i++)
    {
        var rock = new Rock();
        var piPosition = 2*Math.PI * Math.random();
        rock.mesh.position.z = 600 * Math.cos(piPosition);
        rock.mesh.position.y = 600 * Math.sin(piPosition);
        rock.mesh.position.x = 60*i-200;

        this.mesh.add(rock.mesh);
    }

    for(var i = 0; i < numKelp; i++)
    {
        var kelp = new Kelp();
        var piPosition = 2*Math.PI * Math.random();
        kelp.mesh.position.z = 600 * Math.cos(piPosition);
        kelp.mesh.position.y = 600 * Math.sin(piPosition);
        kelp.mesh.position.x = (Math.random()*200+150)*(Math.round(Math.random()) * 2 - 1);
        kelp.mesh.rotation.x = -piPosition + Math.PI/2;

        this.mesh.add(kelp.mesh);
    }

    this.mine = new Array();
    for(var i = 0; i < numMines; i++)
    {
        this.mine[i] = new Mine();
        var piPosition = 2*Math.PI * Math.random();
        this.mine[i].mesh.position.z = 600 * Math.cos(piPosition);
        this.mine[i].mesh.position.y = 600 * Math.sin(piPosition);
        this.mine[i].mesh.position.x = -150 + (Math.random()*250);
        this.mine[i].mesh.rotation.x = -piPosition + Math.PI/2;

        this.mesh.add(this.mine[i].mesh);
    }
}

Floor.prototype.generateFloor = function (){
	
	// get the vertices
	var verts = this.mesh.geometry.vertices;
	var l = verts.length;
	
	for (var i=0; i<l; i++){
		var v = verts[i];
		
		// get the data associated to it
		var vprops = this.waves[i];
		
		// update the position of the vertex
		v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
		v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

	}

}

Rock = function(){
	// Create an empty container that will hold the different parts of the cloud
	this.mesh = new THREE.Object3D();
	

	var geoRock = new THREE.SphereGeometry(10,5,5);
	
	var matRock = new THREE.MeshPhongMaterial({ color:newColors.darkGrey});
    var rock = new THREE.Mesh(geoRock,matRock);
    rock.castShadow = true;
    rock.receiveShadow = true;

    this.mesh.add(rock);
}

Kelp = function()
{
    this.mesh = new THREE.Object3D();

    var geoBase = new THREE.CylinderGeometry(10,20,20,64);
    var matBase = new THREE.MeshPhongMaterial({color:newColors.yellow});
    var base = new THREE.Mesh(geoBase,matBase);
    base.castShadow = true;
    base.receiveShadow = true;

    var randomHeight = 75 + 125*Math.random();
    var geoStalk = new THREE.CylinderGeometry(2,2,randomHeight,64);
    var matStalk = new THREE.MeshPhongMaterial({color:newColors.green});
    var stalk = new THREE.Mesh(geoStalk,matStalk);
    stalk.position.y = randomHeight/2;
    stalk.castShadow = true;
    stalk.receiveShadow = true;

    var geoLeaf = new THREE.BoxGeometry(15,5,1);
    var matLeaf = new THREE.MeshPhongMaterial({color:newColors.green});
    
    for(randomHeight; randomHeight>0;randomHeight -= 20)
    {
        var leaf = new THREE.Mesh(geoLeaf,matLeaf);
        leaf.position.y = randomHeight;
        leaf.position.x = 5;
        leaf.rotation.z = Math.PI/4;
        leaf.castShadow = true;
        leaf.receiveShadow = true;
        this.mesh.add(leaf);

        var leaf = new THREE.Mesh(geoLeaf,matLeaf);
        leaf.position.y = randomHeight;
        leaf.position.x = -5;
        leaf.rotation.z = Math.PI/4;
        leaf.rotation.y = Math.PI;
        leaf.castShadow = true;
        leaf.receiveShadow = true;
        this.mesh.add(leaf);
    }
    this.mesh.add(stalk);
    this.mesh.add(base);
}

var Mine = function()
{
    this.mesh = new THREE.Object3D();

    var geoBase = new THREE.CylinderGeometry(5,15,15,64);
    var matBase = new THREE.MeshPhongMaterial({color:newColors.darkGrey});
    var base = new THREE.Mesh(geoBase,matBase);
    base.castShadow = true;
    base.receiveShadow = true;

    var height = 5 + 5 * Math.random();
    var geoChain = new THREE.BoxGeometry(3,10,1);
    var matChain = new THREE.MeshPhongMaterial({color:newColors.grey});
    
    for(var i = 0; i < height;i++)
    {
        var chain = new THREE.Mesh(geoChain, matChain);
        chain.position.y = 10 * i;
        chain.rotation.y = Math.PI/4;
        if(i%2 == 0)
            chain.rotation.y += Math.PI/2;
        chain.castShadow = true;
        chain.receiveShadow = true;
        this.mesh.add(chain);
    }
    
    var geoMine = new THREE.SphereGeometry(20);
	var matMine = new THREE.MeshPhongMaterial({ color:newColors.darkGrey});
    this.mine = new THREE.Mesh(geoMine,matMine);
    this.mine.castShadow = true;
    this.mine.receiveShadow = true;
    this.mine.position.y = height *10;

    var geoSpike = new THREE.CylinderGeometry(2,2,45,64);
    var matSpike = new THREE.MeshPhongMaterial({color:newColors.darkGrey});
    var spike = new THREE.Mesh(geoSpike,matSpike);
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.x = Math.PI/2;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.z = Math.PI/2;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.x = Math.PI/4;
    spike.rotation.z = Math.PI/4;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.x = -Math.PI/4;
    spike.rotation.z = -Math.PI/4;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.x = -Math.PI/4;
    spike.rotation.z = Math.PI/4;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.x = Math.PI/4;
    spike.rotation.z = -Math.PI/4;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.x = Math.PI/4;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.x = -Math.PI/4;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.z = Math.PI/4;
    this.mine.add(spike);
    var spike = new THREE.Mesh(geoSpike,matSpike);
    spike.rotation.z = -Math.PI/4;
    this.mine.add(spike);

    this.mesh.add(this.mine);
    this.mesh.add(base);
}

var Sub = function() 
{
    this.mesh = new THREE.Object3D();
    
    var geoBody = new THREE.CylinderGeometry(30,25,100,64);
    var matBody = new THREE.MeshPhongMaterial({color:newColors.green, shading:THREE.FlatShading});
    this.body = new THREE.Mesh(geoBody,matBody);
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    
    

    var geoHead = new THREE.SphereGeometry(30);
    var matHead = new THREE.MeshPhongMaterial({color:newColors.green, shading:THREE.FlatShading});
    var head = new THREE.Mesh(geoHead,matHead);
    head.position.y = 50;
    head.castShadow = true;
    head.receiveShadow = true;
    this.body.add(head);

    var geoButt = new THREE.SphereGeometry(25);
    var matButt = new THREE.MeshPhongMaterial({color:newColors.green, shading:THREE.FlatShading});
    var butt = new THREE.Mesh(geoButt,matButt);
    butt.position.y = -50;
    butt.castShadow = true;
    butt.receiveShadow = true;
    

    var geoArm = new THREE.BoxGeometry(5,20,80);
    var matArm = new THREE.MeshPhongMaterial({color:newColors.green, shading:THREE.FlatShading});
    var arm = new THREE.Mesh(geoArm, matArm);
    arm.position.y = 10;
    arm.castShadow = true;
    arm.receiveShadow = true;
    this.body.add(arm);

    var geoHat = new THREE.CylinderGeometry(15,17,30,64);
    var matHat = new THREE.MeshPhongMaterial({color:newColors.green, shading:THREE.FlatShading});
    var hat = new THREE.Mesh(geoHat,matHat);
    hat.position.x = -32;
    hat.position.y = 10;
    hat.rotation.z = Math.PI/2;
    hat.castShadow = true;
    hat.receiveShadow = true;
    
    var geoTube = new THREE.CylinderGeometry(2,2,30,64);
    var matTube = new THREE.MeshPhongMaterial({color:newColors.green, shading:THREE.FlatShading});
    var tube = new THREE.Mesh(geoTube,matTube);
    tube.position.x = -7;
    tube.position.y = 10;
    tube.castShadow = true;
    tube.receiveShadow = true;
    //tube.rotation.z = Math.PI/2;
    hat.add(tube);
    this.body.add(hat);

    var geoProp = new THREE.CylinderGeometry(3,3,30,64);
    var matProp = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    this.prop = new THREE.Mesh(geoProp,matProp);
    this.prop.position.y = -70;
    this.prop.castShadow = true;
    this.prop.receiveShadow = true;

    var geoFin = new THREE.BoxGeometry(7,2,40);
    var matFin = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    var fin1 = new THREE.Mesh(geoFin, matFin);
    var fin2 = new THREE.Mesh(geoFin, matFin);
    fin1.position.y = -11;
    fin2.position.y = -11;
    fin2.rotation.y = Math.PI/2;
    fin1.castShadow = true;
    fin1.receiveShadow = true;
    fin2.castShadow = true;
    fin2.receiveShadow = true;

    this.prop.add(fin1);
    this.prop.add(fin2);
    this.body.add(this.prop);
    this.body.add(butt);

    this.body.rotation.z = -Math.PI/2;
    this.mesh.add(this.body);
}

var Whale = function()
{
    this.mesh = new THREE.Object3D();

    var geoBody = new THREE.BoxGeometry(60,60,120);
    var matBody = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    this.body = new THREE.Mesh(geoBody,matBody);
    this.body.castShadow = true;
    this.body.receiveShadow = true;

    var geoEyes = new THREE.CylinderGeometry(6,6,64,64);
    var matEyes = new THREE.MeshPhongMaterial({color:newColors.darkGrey, shading:THREE.FlatShading});
    var eyes = new THREE.Mesh(geoEyes,matEyes);
    eyes.rotation.z = Math.PI/2;
    eyes.position.y = -15;
    eyes.position.z = 25;
    eyes.castShadow = true;
    eyes.receiveShadow = true;

    var geoMouth = new THREE.BoxGeometry(40,5,40);
    var matMouth = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    this.mouth = new THREE.Mesh(geoMouth,matMouth);
    this.mouth.castShadow = true;
    this.mouth.receiveShadow = true;
    this.mouth.position.y = -32;
    this.mouth.position.z = 30;
    this.mouth.rotation.x = Math.PI/64;

    var geoFin = new THREE.BoxGeometry(5,15,40);
    var matFin = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    this.fin1 = new THREE.Mesh(geoFin,matFin);
    this.fin1.castShadow = true;
    this.fin1.receiveShadow = true;
    this.fin1.position.x = 32;
    this.fin1.position.y = -25;
    this.fin1.position.z = -25;
    this.fin1.rotation.y = -Math.PI/32;
    
    this.fin2 = new THREE.Mesh(geoFin,matFin);
    this.fin2.castShadow = true;
    this.fin2.receiveShadow = true;
    this.fin2.position.x = -32;
    this.fin2.position.y = -25;
    this.fin2.position.z = -25;
    this.fin2.rotation.y = Math.PI/32;

    var geoTail = new THREE.BoxGeometry(40, 30, 50);
    var matTail = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    this.tail = new THREE.Mesh(geoTail,matTail);
    this.tail.position.z = -70;
    this.tail.position.y = -10;
    this.tail.castShadow = true;
    this.tail.receiveShadow = true;

    var geoTailSeg = new THREE.BoxGeometry(20, 15, 30);
    var matTailSeg = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    this.tailSeg = new THREE.Mesh(geoTailSeg,matTailSeg);
    this.tailSeg.position.z = -25;
    this.tailSeg.position.y = -5;
    this.tailSeg.castShadow = true;
    this.tailSeg.receiveShadow = true;
    

    this.tailFin = new THREE.Object3D();
    this.tailFin.position.z = -5;
    var geoTailFin = new THREE.BoxGeometry(20, 3, 15);
    var matTailFin = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    var tailFin1 = new THREE.Mesh(geoTailFin,matTailFin);
    tailFin1.position.z = -15;
    tailFin1.position.x = 11;
    tailFin1.rotation.y = Math.PI/8;
    tailFin1.castShadow = true;
    tailFin1.receiveShadow = true;
    var tailFin2 = new THREE.Mesh(geoTailFin,matTailFin);
    tailFin2.position.z = -15;
    tailFin2.position.x = -11;
    tailFin2.rotation.y = -Math.PI/8;
    tailFin2.castShadow = true;
    tailFin2.receiveShadow = true;
    var tailFinSeg = new THREE.Mesh(geoTailFin,matTailFin);
    tailFinSeg.position.z = -10;
    tailFinSeg.castShadow = true;
    tailFinSeg.receiveShadow = true;
    
    this.tailFin.add(tailFin1);
    this.tailFin.add(tailFin2);
    this.tailFin.add(tailFinSeg);

    this.tailSeg.add(this.tailFin);
    this.tail.add(this.tailSeg);
    this.body.add(this.tail);
    this.body.add(this.fin1);
    this.body.add(this.fin2);
    this.body.add(this.mouth);
    this.body.add(eyes);
    
    this.mesh.add(this.body);
}

var Torpedo = function()
{
    this.mesh = new THREE.Object3D();

    var geoBody = new THREE.CylinderGeometry(10,10,100,64);
    var matBody = new THREE.MeshPhongMaterial({color:newColors.darkGrey, shading:THREE.FlatShading});
    this.body = new THREE.Mesh(geoBody,matBody);
    this.body.castShadow = true;
    this.body.receiveShadow = true;

    var geoHead = new THREE.SphereGeometry(10);
    var matHead = new THREE.MeshPhongMaterial({color:newColors.darkGrey, shading:THREE.FlatShading});
    var head = new THREE.Mesh(geoHead,matHead);
    head.position.y = 50;
    head.castShadow = true;
    head.receiveShadow = true;
    this.body.add(head);

    var geoButt = new THREE.SphereGeometry(10);
    var matButt = new THREE.MeshPhongMaterial({color:newColors.darkGrey, shading:THREE.FlatShading});
    var butt = new THREE.Mesh(geoButt,matButt);
    butt.position.y = -50;
    butt.castShadow = true;
    butt.receiveShadow = true;

    var geoProp = new THREE.CylinderGeometry(2,2,23,64);
    var matProp = new THREE.MeshPhongMaterial({color:newColors.darkGrey, shading:THREE.FlatShading});
    this.prop = new THREE.Mesh(geoProp,matProp);
    this.prop.position.y = -52;
    this.prop.castShadow = true;
    this.prop.receiveShadow = true;

    var geoFin = new THREE.BoxGeometry(4,1,20);
    var matFin = new THREE.MeshPhongMaterial({color:newColors.grey, shading:THREE.FlatShading});
    var fin1 = new THREE.Mesh(geoFin, matFin);
    var fin2 = new THREE.Mesh(geoFin, matFin);
    fin1.position.y = -10;
    fin2.position.y = -10;
    fin2.rotation.y = Math.PI/2;
    fin1.castShadow = true;
    fin1.receiveShadow = true;
    fin2.castShadow = true;
    fin2.receiveShadow = true;

    this.prop.add(fin1);
    this.prop.add(fin2);
    this.body.add(this.prop);

    this.body.add(butt);
    this.mesh.add(this.body);
}

var Explosion = function()
{
    this.mesh = new THREE.Object3D();

    var geoExpl = new THREE.SphereGeometry(25);
    var matExpl = new THREE.MeshPhongMaterial({
		color:Colors.blue,
		transparent:true,
		opacity:.6,
		shading:THREE.FlatShading,
    });
    this.explosion = new THREE.Mesh(geoExpl, matExpl);

    this.mesh.add(this.explosion);
}

var sky;

function createSky(){
	sky = new Sky();
    sky.mesh.position.y = -750;
    sky.mesh.position.x = 600;
    scene.add(sky.mesh);

}

var floor;

function createFloor(){
	floor = new Floor();
    floor.mesh.position.y = -600;
    //floor.mesh.position.z = -1000;
	scene.add(floor.mesh);
}

var sub;

function createSub()
{
    sub = new Sub();
    sub.mesh.scale.set(.25,.25,.25);
    sub.mesh.position.y = 100;
    sub.mesh.rotation.y = Math.PI/2;
    //sub.mesh.rotation.x = -Math.PI/4;
    scene.add(sub.mesh);
}

var whale;

function createWhale()
{
    whale = new Whale();
    whale.mesh.scale.set(1.75,1.75,1.75);
    
    whale.mesh.position.y = 75;
    whale.mesh.position.x = -0;
    whale.mesh.position.z = -400;
    whale.mesh.rotation.y = Math.PI;
    
    whale.tailSeg.rotation.x = -0.15;
    whale.tailFin.rotation.x = -0.30;

    scene.add(whale.mesh);
}

var torpedo;
function createTorpedo()
{
    torpedo = new Torpedo();
    torpedo.mesh.scale.set(.25,.25,.25);
    torpedo.mesh.rotation.x = -Math.PI/2;
    
    torpedo.mesh.position.x = sub.mesh.position.x;
    torpedo.mesh.position.y = sub.mesh.position.y;
    torpedoOut = true;

    scene.add(torpedo.mesh);
}

var explosion;
function createExplosion()
{
    if(explosion != null)
    {
        scene.remove(explosion.mesh);
        explosion = null;
    }
    explosion = new Explosion();
    explosion.mesh.scale.set(0.1,0.1,0.1);
    explosion.mesh.position.y = torpedo.mesh.position.y;
    explosion.mesh.position.x = torpedo.mesh.position.x;
    explosion.mesh.position.z = torpedo.mesh.position.z;

    torpedoOut = false;
    torpDropped = false;
    scene.remove(torpedo.mesh); 
    torpedo = null;

    scene.add(explosion.mesh);
}

function createMineExplosion(i)
{
    if(explosion != null)
    {
        scene.remove(explosion.mesh);
        explosion = null;
    }
    explosion = new Explosion();
    explosion.mesh.scale.set(0.1,0.1,0.1);
    explosion.mesh.position.y = sub.mesh.position.y;
    explosion.mesh.position.x = sub.mesh.position.x;
    explosion.mesh.position.z = sub.mesh.position.z;

    scene.remove(floor.mine[i].mesh); 

    scene.add(explosion.mesh);
}

var song;
function loadSounds() {
	song = new Audio("sounds/song.mp3")

	song.loop = true;
	song.volume = .2;
	song.play();
}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}