document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    const candleCountDisplay = document.getElementById("candleCount");
    let candles = [];
    let audioContext;
    let analyser;
    let microphone;
    let audio = new Audio('audio.mp3');
  
    const messageDiv = document.getElementById("message"); // Mensaje "Pon las velas en el pastel"
    const blowMessageDiv = document.getElementById("blowMessage"); // Mensaje "Sopla"
  
    function updateCandleCount() {
      const activeCandles = candles.filter(
        (candle) => !candle.classList.contains("out")
      ).length;
      candleCountDisplay.textContent = activeCandles;
    }
  
    function addCandle(left, top) {
      const candle = document.createElement("div");
      candle.className = "candle";
      candle.style.left = left + "px";
      candle.style.top = top + "px";
  
      const flame = document.createElement("div");
      flame.className = "flame";
      candle.appendChild(flame);
  
      cake.appendChild(candle);
      candles.push(candle);
      updateCandleCount();
  
      // Al añadir la primera vela, cambia los mensajes con transición
      if (candles.length === 1) {
        messageDiv.style.opacity = "0"; // Desvanece "Pon las velas en el pastel"
        setTimeout(() => {
          messageDiv.style.display = "none"; // Oculta el mensaje después de la transición
          blowMessageDiv.style.display = "block"; // Muestra "Sopla"
          setTimeout(() => {
            blowMessageDiv.style.opacity = "1"; // Desvanece el nuevo mensaje
          }, 10); // Espera un breve momento para que el display:block tenga efecto
        }, 500); // Tiempo de la transición en CSS
      }
    }
  
    cake.addEventListener("click", function (event) {
      const rect = cake.getBoundingClientRect();
      const left = event.clientX - rect.left;
      const top = event.clientY - rect.top;
      addCandle(left, top);
    });
  
    function isBlowing() {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
  
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      let average = sum / bufferLength;
  
      return average > 50; //ETO CHANGEEEEEE
    }
  
    function blowOutCandles() {
      let blownOut = 0;
  
      // Solo se revisa si se está soplando si hay velas encendidas
      if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
        if (isBlowing()) {
          candles.forEach((candle) => {
            if (!candle.classList.contains("out") && Math.random() > 0.5) {
              candle.classList.add("out");
              blownOut++;
            }
          });
        }
  
        if (blownOut > 0) {
          updateCandleCount();
        }
  
        // Si todas las velas están apagadas, se dispara el confetti
        if (candles.every((candle) => candle.classList.contains("out"))) {
          setTimeout(function() {
            triggerConfetti();
            endlessConfetti(); // Start the endless confetti
          }, 200);
          audio.play();
        }
      }
    }
  
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          analyser.fftSize = 256;
          setInterval(blowOutCandles, 200);
        })
        .catch(function (err) {
          console.log("Unable to access microphone: " + err);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  });
  
  function triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
  
  function endlessConfetti() {
    setInterval(function() {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0 }
      });
    }, 1000);
  }
  