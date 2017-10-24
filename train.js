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

  var database = firebase.database();


  database.ref().on("value", function(snapshot) {
    //populateTable();
  });

  function populateTable() {
    $("#table-body").empty();

    var trainRef = database.ref();

    trainRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        console.log("populate: " + childKey);
        // Create Table Rows now
        addRowElement(childKey, childData.destination, childData.ftt, childData.frequency);
      });
    });
  }

  function addRowElement(name, destination, ftt, frequency) {
    var nextTrainInfo = [];
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

  function submitTrainInformation() {

    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var trainDest = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var trainFreq = $("#frequency").val().trim();

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

    // Store the data on firebase first; Key is the train-name
    var trainRef = database.ref();
    var updates = {};
    updates[trainName] = {"destination": trainDest, "ftt": firstTrainTime, "frequency": trainFreq};
    trainRef.update(updates);
   
    // Add this row to the table
    addRowElement(trainName, trainDest, firstTrainTime, parseInt(trainFreq));

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
  }

  populateTable();
  $("#submit-button").on("click", submitTrainInformation);
});