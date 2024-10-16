let FULL_URL = 'https://gn6pd70ag1.execute-api.ap-south-1.amazonaws.com/prod/';
let FULL_URL1 = 'https://gn6pd70ag1.execute-api.ap-south-1.amazonaws.com/prod/essencia';
let FULL_URL2 = 'https://gn6pd70ag1.execute-api.ap-south-1.amazonaws.com/prod/write';

let batchnames=[];
let agents =[];
let agents1 = [];
let scenariono = [];
let scenariocode = [];
let question= [];

let namelist = '';
let agent_id = '';
let self_id='';
const maxscenariosperday=40;
// email select dropdown element
const emailSelect = document.getElementById('namelist');
const selfemailSelect = document.getElementById('selflist');

// batch select dropdown element
const batchSelect = document.getElementById('list1');
let dropdownselect = ''

//timer for refresh
let timeout;

function refreshPage() {
  location.reload();
}

function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(refreshPage, 30*60 * 1000); // 30 minutes
}

function startTimer() {
  document.addEventListener("mousemove", resetTimer);
  document.addEventListener("keydown", resetTimer);
  document.addEventListener("scroll", resetTimer);
  resetTimer();
}

startTimer();
//refresh end

fetch(FULL_URL1)
    .then(response => response.json())
    .then(data => {

      batchnames = data.batch.map(item => item.batchname);
      agents = data.batch.map(item => item.agent);
      scenariono = data.scenario.map(item => item.scenariono);
      scenariocode = data.scenario.map(item => item.scenariocode);
      question = data.scenario.map(item => item.question);
  
      agents1 = agents.slice();
      agents1.sort();
      // console.log(agents);
      // console.log(agents1);


        for (let i = 0; i < agents1.length; i++) {
            namelist += '<option value="' + agents1[i] + '" />';
        }
        let x = document.getElementById("list");
        let x1 = document.getElementById("selflist1");
        x.innerHTML = namelist;
        x1.innerHTML = namelist;

    })


//Phone number check if blank
const phoneNumberField = document.getElementById("textInput");

phoneNumberField.addEventListener('blur', function () {
    const phoneNumber = this.value.trim();

    if (phoneNumber.length === 0) {
        alert('Please enter a phone number');
    } else if (phoneNumber.length !== 10) {
        alert('Please enter a 10-digit phone number');
    }
});



//*******************test*/
async function updateBatchSelect(email1) {

    for (let i = 0; i < agents.length; i++) {
        if (email1 === agents[i]) {
            dropdownselect = batchnames[i];
            // console.log(i)
        }
    }

    // update the batch select dropdown
    batchSelect.options.length = 0
    let option = document.createElement("option");
    option.text = dropdownselect;
    batchSelect.add(option);

    // console.log(dropdownselect)
}

// event listener for the email select dropdown
emailSelect.addEventListener('change', (event) => {
    let email1 = event.target.value;
    updateBatchSelect(email1);
});

//********************test end*/





async function handleSubmit(event) {
    event.preventDefault();
    let submitBtn = document.getElementById("submit");
    submitBtn.disabled = true; // disable the submit button
    submitBtn.style.backgroundColor = "#ccc"; // change the background color of the button
    submitBtn.style.cursor = "not-allowed"; // set the cursor to "not-allowed"
    submitBtn.innerText = "Submitting..."; // change the text on the button
    document.getElementById("op-text").innerHTML = "......"//reseting Output text   
    
    setTimeout(function() {
      submitBtn.disabled = false; // enable the submit button
      submitBtn.style.backgroundColor = ""; // reset the background color of the button
      submitBtn.style.cursor = ""; // reset the cursor to default
      submitBtn.innerText = "Submit"; // change the text on the button back to original
    }, 2500); // 5000 milliseconds = 5 seconds


    // console.log(document.getElementById("list").options[document.getElementById("list").selectedIndex].text);
    // document.getElementById("op-text").innerHTML = scenarioInput;
    let phno = document.getElementById("textInput").value;
    agent_id = document.getElementById("namelist").value;
    self_id = document.getElementById("selflist").value;
    
    const phoneNumber = document.getElementById("textInput");
    // console.log(agent_id)

    let batch1 = document.getElementById("list1").options[document.getElementById("list1").selectedIndex].text;

    // console.log("1")
    let exclude1 = [];
    let exclude = [];
    // console.log(exclude)
    // console.log(temparray)
    let response1 = await fetch(FULL_URL+agent_id+'/'+batch1 );
    let data1 = await response1.json();
    // console.log(data1)


    exclude1 = data1.main.map(item => item.reference);
    let daycount = data1.daycount;
    if(daycount<maxscenariosperday){
    document.getElementById("countermainelement").innerHTML = parseInt(daycount)+1;
    }
    else{
      document.getElementById("countermainelement").innerHTML = daycount;
    }

    // console.log(exclude1)
    exclude=[...exclude1];
    // console.log(exclude)
    // console.log("2")
  
    if (phoneNumber.value == '' || agents.indexOf(agent_id) == -1 || agents.indexOf(self_id) == -1) {
        alert('Please enter a phone number/email address');
    }
    else {
      if(daycount>=maxscenariosperday){
        let result = "Your 40 scenarios for the day are completed";
        document.getElementById("op-text").innerHTML = result

      }
      else{

        if (scenariono.length===exclude.length) {
            let result = "List completed";
            document.getElementById("op-text").innerHTML = result
            // console.log(result)
        }
        else {
          // console.log(scenariono.length)
            let result = Math.floor(Math.random() * scenariono.length + 1);
            let result1 = agent_id + "*" + (result+Number(scenariono[0])-1);

            while (exclude.includes(result1)) {
                result = Math.floor(Math.random() * scenariono.length + 1);
                result1 = agent_id + "*" + (result+Number(scenariono[0])-1);
            }
            // console.log(result1)
            // console.log(result)
            let scenariono1 = result+Number(scenariono[0])-1;
            // console.log(scenariono)

            let scenariocode1=scenariocode[result - 1]

            document.getElementById("op-text").innerHTML = question[result - 1];

          
            // console.log("4")
            let requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phonenumber: phno,
                agent: agent_id,
                batch: batch1,
                selfid: self_id,
                scenario: scenariono1,
                scenariocode: scenariocode1
              })
            };
            
            fetch(FULL_URL2, requestOptions)
              .then(response => response.json())
              .then(data => console.log(data))
              .catch(error => console.error(error));
            
        }
      }
    }

}
const copyBtn = document.querySelector("#copy-btn");
const opText = document.querySelector("#op-text");

copyBtn.addEventListener("click", function () {
    const range = document.createRange();
    range.selectNode(opText);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
});
