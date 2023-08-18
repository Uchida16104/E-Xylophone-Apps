var Key = document.querySelectorAll("#piano li");
const btn = document.getElementById("btn");
const play = document.getElementById("play");
const stop = document.getElementById("stop");
var reverb = new Tone.Freeverb(0.8, 500).toMaster();
var loop = document.getElementById("loop");
var beat = document.getElementById("beat");
var tempo = document.getElementById("tempo");
var note = document.getElementById("note");
let opt = {
  envelope: {
    sustain: 0.0001
  },
  volume: 5
};

var synth = new Tone.MembraneSynth(opt).toMaster();
synth.connect(reverb);
for (let i = 0; i < Key.length; i++) {
  Key[i].addEventListener(
    "click",
    function () {
      var idName = this.id;
      stop.style.display = "none";
      let array = new Array();
      for (let j = 0; j <= 12; j++) {
        array.push(j);
      }
      let get = array[Math.floor(Math.random() * array.length)];
      let melodyLine = new Array();
      for (let k = 0; k < beat.value; k++) {
        melodyLine.push(
          ((idName + array[Math.floor(Math.random() * array.length)]) / 12) *
            440
        );
      }
      play.addEventListener(
        "click",
        function () {
          play.style.display = "none";
          stop.style.display = "block";
          function setPlay(time, note) {
            synth.triggerAttackRelease(note, parseInt(note.value), time);
          }

          var melody = new Tone.Sequence(setPlay, melodyLine);
          melody.start();
          melody.loop = parseInt(loop.value);
          Tone.Transport.bpm.value = parseInt(tempo.value) * 4;
          Tone.Transport.start();
        },
        false
      );
      stop.addEventListener(
        "click",
        function () {
          stop.style.display = "none";
          play.style.display = "block";
          Tone.Transport.stop();
          Tone.Transport.cancel();
        },
        false
      );
      synth.triggerAttackRelease(Math.pow(2, idName / 12) * 440, 2);
      var hydra = new Hydra({
        canvas: document.getElementById("myCanvas"),
        detectAudio: false
      });
      var videoValue = parseInt(idName);
      osc(
        melodyLine.map((x) => x / 400),
        2,
        300
      )
        .diff(
          gradient(videoValue / 66)
            .diff(
              solid(
                `st.x*st.y*float(${videoValue / 66})`,
                `st.x*st.y*float(${videoValue / 66})`,
                `st.x*st.y*float(${videoValue / 66})`,
                `st.x*st.y*float(${videoValue / 66})`
              )
            )
            .scale(0.1)
        )
        .hue(videoValue / 66)
        .invert()
        .rotate((Math.PI * 2 * videoValue) / 66)
        .pixelate(videoValue, videoValue)
        .diff(
          shape(4, 0, 1)
            .colorama()
            .repeat(videoValue, videoValue)
            .modulateScale(
              osc((Math.PI * Math.E * videoValue) / 66).thresh(
                videoValue / 12 - 5
              )
            )
        )
        .invert()
        .hue(videoValue / 66)
        .modulateScrollY(osc(Math.PI), videoValue / 66)
        .blend(o0, videoValue / 72)
        .out();
    },
    false
  );
}