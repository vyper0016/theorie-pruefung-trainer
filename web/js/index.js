function handlePage(page) {
    eel.called_page(page)
  }

  eel.expose(redirect);
function redirect(page){
  window.location.href = page;
}
