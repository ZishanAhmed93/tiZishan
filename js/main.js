/*
I hope you find this Index useful in your review

#######                                                    ### 
   #    #    #   ##   #    # #    #    #   #  ####  #    # ### 
   #    #    #  #  #  ##   # #   #      # #  #    # #    # ### 
   #    ###### #    # # #  # ####        #   #    # #    #  #  
   #    #    # ###### #  # # #  #        #   #    # #    #     
   #    #    # #    # #   ## #   #       #   #    # #    # ### 
   #    #    # #    # #    # #    #      #    ####   ####  ###     
 
 -Zishan Ahmed
 */

// Index
//////////////////////////
// 1. Permission loading
// 2. HRM Functions
// 3. GPS Sensor Functions
//////////////////////////

console.log("main js file loaded");

//1. Permission loading
///////////////////////
function permissionSuccess(result, privilege){
	console.log(`Success: ${result}, ${privilege}`);
}
function onErrorPermission(e){
	console.log(`error ${JSON.stringify(e)}`);
}
function permissionInit(){
	tizen.ppm.requestPermission("http://tizen.org/privilege/healthinfo", permissionSuccess, onErrorPermission);
	tizen.ppm.requestPermission("http://tizen.org/privilege/location", permissionSuccess, onErrorPermission);	
}
permissionInit();
//////////////////
//////////////////



// 2. HRM Functions
///////////////////////////////
// -- variables
// -- hrmInit()
// -- getRandomIntegerBetween()
// -- hrmOnChangedCB()
// -- hrmStart()
// -- hrmStop()
///////////////////////////////

let hrmPage,
	hrmLog,
	hrmCheckSensor,
	hrmButton,
	hrmLoadCounter;

// I thought a circular progress would add to the UX
let progressBar,
	progressBarWidget;
	
function hrmInit(){
	console.log("hrm launched");
	
	hrmPage = document.getElementById("hrmPage");
	hrmLog = document.getElementById("hrmLog");
	hrmCheckSensor = document.getElementById("hrmCheckSensor");
	hrmCheckSensor.style.display = 'none';
	hrmButton = document.getElementById("hrmButton");
	hrmButton.addEventListener('click', hrmStop);
	
	progressBar = document.getElementById('circleprogress');
	progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: 'full'});
	
	hrmLoadCounter = 0;
	progressBarWidget.value(hrmLoadCounter);
	
	hrmStart();
}

// using random num to add some variance to the circular progress 
function getRandomIntegerBetween(min, max){
	return Math.floor(Math.random() * (max-min) + min);
}

function hrmOnChangedCB(hrmInfo) {
	if(hrmInfo.heartRate > 0){
		hrmCheckSensor.style.display = 'none';
		let x = getRandomIntegerBetween(-3, 3);
		
		progressBarWidget.value(hrmInfo.heartRate + x);
		hrmLog.innerHTML = `Heart Rate: ${hrmInfo.heartRate}`;
		
	}else{
		hrmCheckSensor.style.display = 'block';
		hrmLoadCounter++;
		progressBarWidget.value(hrmLoadCounter);
	}
}
function hrmStart(){
	console.log('HRM start');
	
	hrmOnChangedCB(0);
	tizen.humanactivitymonitor.start('HRM', hrmOnChangedCB);
	
	hrmButton.removeEventListener('click', hrmStart);
	hrmButton.addEventListener('click', hrmStop);
	hrmButton.innerHTML = "Stop Monitor";
}
function hrmStop(){
	console.log("HRM stop");
	
	hrmLoadCounter = 0;
	progressBarWidget.value(hrmLoadCounter);
	tizen.humanactivitymonitor.stop('HRM');
	
	hrmButton.removeEventListener('click', hrmStop);
	hrmButton.addEventListener('click', hrmStart);
	hrmButton.innerHTML = "Start Monitor";
}
/////////////////////////
/////////////////////////



//3. GPS Sensor Functions
/////////////////////////
// -- variables
// -- gpsInit()
// -- gptOnChangedCB()
// -- gpsOnErrorCB()
// -- gpsStart()
/////////////////////////

let geo = null;
function gpsInit(){
	console.log("gps launched");
	gpsStart();
}
function gpsOnChangedCB(position) {
	document.getElementById('gpsLog').innerHTML = `Latitude: ${position.coords.latitude} <br/>Longitude:  ${position.coords.longitude}`;
	let gpsButton = document.getElementById('gpsButton');
	gpsButton.innerHTML = 'Reload Position'; 
	gpsButton.addEventListener('click', gpsStart);
}

function gpsOnErrorCB(error) {
   let errorInfo = document.getElementById('gpsLog');

   switch (error.code) {
       case error.PERMISSION_DENIED:
           errorInfo.innerHTML = 'User denied the request for Geolocation.';
           tizen.ppm.requestPermission("http://tizen.org/privilege/location");
           break;
       case error.POSITION_UNAVAILABLE:
           errorInfo.innerHTML = 'Make sure GPS is on in watch settings. </br> Location info unavailable.';
           break;
       case error.TIMEOUT:
           errorInfo.innerHTML = 'The request to get user location timed out.';
           break;
       case error.UNKNOWN_ERROR:
           errorInfo.innerHTML = 'An unknown error occurred.';
           break;
   }
}

function gpsStart() {   
	document.getElementById('gpsLog').innerHTML = 'Loading';
	geo = navigator.geolocation;
	
	// console.log(`nav ${geo}`);
	// console.log(`geo ${navigator}`);
	geo.getCurrentPosition(gpsOnChangedCB, gpsOnErrorCB, {maximumAge:60000, timeout:10000});
}
