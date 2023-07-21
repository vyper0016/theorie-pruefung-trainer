let current_question;

async function getNextPage(){
current_question = await eel.get_next_question()();
console.log(current_question);
return Promise.resolve();
}


const dataIds = {
    qct: 'total',
    qc: 'current',
    asw1: 'asw_1',
    asw2: 'asw_2',
    asw3: 'asw_3',
    text: 'text',
    asw_pretext: 'asw_pretext',
    points: 'points',
    category: 'category',
    ts: 'times_seen',
    tr: 'times_right',
    ls: 'last_seen',
    qinfo: 'info',
    qid: 'number',
    stvo: 'stvo',
  };

function fillQuestion(){
    for (const key in dataIds) {
        const elements = document.querySelectorAll(`#${key}`);
          elements.forEach(element => {
            element.innerHTML = current_question[dataIds[key]];
          });
      }
      fillMedia();
}


function fillMedia(){
    const image = document.getElementById("image");
    image.style.width = '0px';
    image.style.height = '0px';    

    if(current_question['type'] != 'video'){
        if(current_question['picture'] != ''){
            console.log('here')
            image.style.width = '500px';
            image.style.height = '300px';     
            image.src = './assets/img/' + current_question['picture']; // Replace "new_image.jpg" with the desired image source
        }
    }else{
        console.log('video')
    }
}

window.onload = () => {
    getNextPage().then(function(){
    fillQuestion();
    });

  };