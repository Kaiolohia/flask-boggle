const $form = $('#input-form')
const $alertArea = $("#result")
const $score = $("#score")
const $time = $("#time")
const $endGame = $("#end")
const $highscore = $("#highscore")
$form.on("submit", formSubmission)
let submittedwords = []

async function formSubmission(evt) {
    // important data from res is at
    //res.data["result"]
    // this will show the response from the back end
    evt.preventDefault()
    const inputData = $("#user-input").val()
    if (submittedwords.includes(inputData)){
        $alertArea.text("Already used this word!")
        setTimeout(()=> {
            //clear msg
            $alertArea.empty()
        }, 1000)
        return
    }
    submittedwords.push(inputData)
    const res = await axios({
        url: `/word/${inputData}`,
        method: "POST",
    });
    console.log(res.data["result"])
    console.debug("Form submitted", evt)
    $("#user-input").val('')
    return updateUserOnSubmission(res.data["result"])
}
function updateUserOnSubmission(result) {
    if(result == "ok") { 
        $alertArea.text("Word Found!");
        updateScoreOnCorrect()
    }
    else if(result == "not-on-board") {
        $alertArea.text("Not on board...")
    } 
    else {
        $alertArea.text("Not an English word")
    }
    setTimeout(()=> {
        //clear msg
        $alertArea.empty()
    }, 1000)
}

function updateScoreOnCorrect() {
    $score.text(`${parseInt($score.text()) + 1}`)
}

async function endGameOnTimerEnd() {
    $form.hide()
    $endGame.show()
    //send data to the back end based on score
    const res = await axios({
        url: `/end/${parseInt($score.text())}`,
        method: "POST",
    });
    if (res.data["newhighscore"]){
        $("#nhighscore").show()
        $highscore.text($score.text())
    }
}
const timer = setInterval(() => {
    if($time.text() == "0") {
        clearInterval(timer)
        endGameOnTimerEnd()
        return
    }
    $time.text(`${parseInt($time.text()) - 1}`)
}, 1000);

async function getHighscore() {
    const res = await axios({
        url: `/data`,
        method: "GET"
    });
    $highscore.text(res.data['highscore'])
    $('#plays').text(res.data['plays'])
}

window.addEventListener('DOMContentLoaded', getHighscore);