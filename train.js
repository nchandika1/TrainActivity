/*************

MAIN LOGIC FOR POPULATING FIRE BASE AND THE WEBPAGE WITH LATEST TRAIN INFORMATION

**************/


 $(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC7QVIJx72Uv8Fo-2U_Ece4dzYNw9X1lnI",
    authDomain: "train-activity-4d0c2.firebaseapp.com",
    databaseURL: "https://train-activity-4d0c2.firebaseio.com",
    projectId: "train-activity-4d0c2",
    storageBucket: "train-activity-4d0c2.appspot.com",
    messagingSenderId: "422417814962"
  };
  firebase.initializeApp(config);

  //Get ref to the database
  var database = firebase.database();

  // This function retrieves database snapshot from the firebase
  // Add populate Table on the webpage with the database entries
  function populateTable() {

    // Let us first clear all table entries since we are getting the latest from the firebase
    $("#table-body").empty();

    var trainRef = database.ref();

    // Get one big snapshot first and then loop thru the children
    // Each child represents one train information
    trainRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();

        // Create Table Rows now
        addRowElement(childData.name, childData.destination, childData.ftt, childData.frequency);
      });
    });
  }

  // This function populates the table rows on the web page
  // This dynamically calculates the Next Train and Minutes Away from the ftt and frequency values
  function addRowElement(name, destination, ftt, frequency) {
    var nextTrainInfo = [];

    // Calculate the Next Train and Minutes Away dynamically
    nextTrainInfo = nextArrivalTime(ftt, frequency);

    var row = $("<tr>");
    row.attr('id', "table-row");
    var markup = "<td>" + name + "</td>" +
                  "<td>" + destination + "</td>" +
                  "<td>" + frequency + "</td>" +
                  "<td>" + nextTrainInfo[0] + "</td>" +
                  "<td>" + nextTrainInfo[1] + "</td>";
    row.html(markup);          
    $("#table-body").append(row);
  }

  // Click function for Submit Button
  function submitTrainInformation() {

    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var trainDest = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var trainFreq = $("#frequency").val().trim();

    // Error conditions
    if (trainName == "" || trainDest == "" || firstTrainTime == "" || trainFreq == "") {
      alert("Please enter all fields to add a train!")
      return;
    }

    if (isNaN(parseInt(trainFreq))) {
      alert("Please enter a number for train frequency!");
      return;
    }

    if (!validTimeString(firstTrainTime)) {
      alert("Please enter a valid time in military HH:MM format!");
      return;
    }

    // Store the data on firebase first
    database.ref().push({
      name: trainName,
      destination: trainDest, 
      ftt: firstTrainTime, 
      frequency: trainFreq,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Create Table Rows now
    addRowElement(trainName, trainDest, firstTrainTime, trainFreq);

    // Clear the form
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
  }

  // Populate table at the start and then listen for submit click events for further events.
  populateTable();
  // Install listener for Submit Button
  $("#submit-button").on("click", submitTrainInformation);
});