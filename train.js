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

    // console.log("value" + snapshot.val().name);

  });

  function populateTable() {
    var trainRef = database.ref();

    trainRef.once('value', function(snapshot){
      var count = 1;
      snapshot.forEach(function(childSnapshot){
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        console.log("populate: " + childKey);
        // Create Table Rows now
        var row = $("<tr>");
        row.attr('id', "table-row");
        var markup = "<td>" + childKey + "</td>" +
                  "<td>" + childData.destination+ "</td>" +
                  "<td>" + childData.frequency + "</td>" +
                  "<td>" + " " + "</td>" +
                  "<td>" + " " + "</td>";

        row.html(markup);
        $("#train-table").append(row);

        // var destination = "<tr><td>" + childData.destination + "</td></tr>";
        // $("#train-table").append(destination);
        count++;
      });
    });
  }

  function getTrainInformation() {
    var trainRef = database.ref();
    trainRef.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        // ...
        console.log("Database " + childKey + " " + childData.destination);
      });
    });
  }

  function submitTrainInformation() {

    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var trainDest = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var trainFreq = $("#frequency").val().trim();

    // Store the data on firebase first; Key is the train-name
    var trainRef = database.ref();
    var updates = {};
    updates[trainName] = {"destination": trainDest, "ftt": firstTrainTime, "frequency": trainFreq};
    trainRef.update(updates);
    
    
  }
  populateTable();
  $("#submit-button").on("click", submitTrainInformation);
});