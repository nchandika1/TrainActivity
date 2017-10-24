function addZero(i) {
	if (i < 10) {
	    i = "0" + i;
	}
	return i;
}

function currentTime() {
	var d = new Date();
    var x = document.getElementById("demo");
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var current = h+":"+m;
    return current;	
}

function minutesToString(minutes) {
	var hour = parseInt(minutes/60);
	var min = minutes%60;

	return(hour + ":" + min);
}

function convertTimeToMinutes(h, m) {
	return (h*60+m);
}

function nextArrivalTime(start, freq) {

	console.log("Start: " + start);
	console.log("Freq: " +  freq);
    var current = currentTime();
    var currArray = current.split(":");
    var currentMinutes = convertTimeToMinutes(parseInt(currArray[0]), parseInt(currArray[1]));
    
    var startArray = start.split(":");
    var startMinutes = convertTimeToMinutes(parseInt(startArray[0]), parseInt(startArray[1]));

    console.log("Current Min: " + currentMinutes);
    console.log("Start Min: " + startMinutes);

    if (currentMinutes <= startMinutes) {
    	// case where the train hasn't even started

 		var next = minutesToString(startMinutes);
 		var away = startMinutes - currentMinutes;

 		console.log("Next Train: " + next + " Min Away: " + away);
    } else {
    	var diff = 	currentMinutes-startMinutes;
    	var modulo = diff%freq;

    	var next = minutesToString(currentMinutes + (freq - modulo));
    	var away = freq - modulo;

 		console.log("Next Train: " + next + " Min Away: " + away);
    }
    var returnArray = [];
 
    returnArray[0] = next;
    returnArray[1] = away;

    return returnArray;
}	


