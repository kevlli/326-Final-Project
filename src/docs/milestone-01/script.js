const UPDATE_PER_SECOND = 10;
const CO2_PER_UPDATE = 1337.724 / UPDATE_PER_SECOND;
let updateCount = 0;

const textBox = document.getElementById("carbonEmissions");
const button = document.getElementById("carbonButton");

button.addEventListener("click", function () {
  button.remove();
  textBox.innerHTML = `Since you've clicked the button,
  <strong><span id="carbon">0</span></strong> tons of CO2 have been
  released into the atmosphere.`;
  const carbon = document.getElementById("carbon");
  setInterval(() => {
    carbon.innerText = (
      Math.round(++updateCount * CO2_PER_UPDATE * 100) / 100
    ).toFixed(2);
  }, 1000 / UPDATE_PER_SECOND);
});
