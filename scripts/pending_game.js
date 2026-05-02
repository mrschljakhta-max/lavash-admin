// FIXED HOTKEYS
document.addEventListener('keydown', (e) => {
  switch(e.key.toLowerCase()) {
    case 'a':
      actionConfirm();
      break;
    case 's':
      actionReject();
      break;
    case 'd':
      actionIgnore();
      break;
  }
});

function actionConfirm(){ console.log('CONFIRM'); }
function actionReject(){ console.log('REJECT'); }
function actionIgnore(){ console.log('IGNORE'); }
