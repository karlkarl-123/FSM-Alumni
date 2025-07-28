
const helpBtn = document.getElementById('helpButton');
const helpPopup = document.getElementById('helpPopup');
const excelBtn = document.getElementById('excelHelpButton');

helpBtn.addEventListener('click', () => {
  helpPopup.classList.toggle('hidden');
  if (!helpPopup.classList.contains('hidden')) {
    excelBtn.classList.remove('hidden');
  } else {
    excelBtn.classList.add('hidden');
  }
});

document.getElementById('excelHelpButton').addEventListener('click', () => {
  document.getElementById('excelHelpPopup').classList.remove('hidden');
});

document.getElementById('closeExcelHelp').addEventListener('click', () => {
  document.getElementById('excelHelpPopup').classList.add('hidden');
});
