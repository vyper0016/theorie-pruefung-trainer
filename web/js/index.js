function handlePage(page) {
    eel.called_page(page);
  }

  eel.expose(redirect);
function redirect(page){
  window.location.href = page;
}

eel.expose(alertMsg)
function alertMsg(msg){
  alert(msg);
}

async function load_unseen(){
  const qu = document.getElementById('qs_unseen');
  qu.innerHTML = await eel.get_unseen()();
}