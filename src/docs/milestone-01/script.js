const UPDATE_PER_SECOND = 10;
const CO2_PER_UPDATE = 1337.724 / UPDATE_PER_SECOND;
let updateCount = 0;

const carbon = document.getElementById("carbon");

setInterval(() => {
  carbon.innerText = (
    Math.round(++updateCount * CO2_PER_UPDATE * 100) / 100
  ).toFixed(2);
}, 1000 / UPDATE_PER_SECOND);
