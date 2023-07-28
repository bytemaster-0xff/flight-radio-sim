import { Component, OnInit } from '@angular/core';

declare var webkitSpeechRecognition: any;
@Component({
  selector: 'app-untowered',
  templateUrl: './untowered.component.html',
  styleUrls: ['./untowered.component.css']
})
export class UntoweredComponent implements OnInit {

  recording: boolean = false;
  response: string | undefined;
  interim: string | undefined;
  speech: any | undefined;
  tailNumber: string = 'N110VP';
  airportDesignator: string = "Clearwater"
  pressed: boolean = false;

  synth = window.speechSynthesis;

  constructor() { }

  ngOnInit() {
    let voices = this.synth.getVoices();
    console.log(voices);

    window.speechSynthesis.onvoiceschanged = function() {
      let voices = window.speechSynthesis.getVoices();
      console.log(voices);
    };
  }

  translate() {
    console.log('starting now');
    this.response = '';
    this.pressed = true;

    if (!this.speech) {
      this.speech = new webkitSpeechRecognition();
      this.speech.interimResults = true;
      this.speech.maxAlternatives = 1;

      this.speech.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        this.interim = result.toString();
      };
    }

    this.recording = true;
    this.speech.start();
  }

  send() {
    this.pressed = false;
    window.setTimeout(() => { this.speech.stop();  this.recording = false; this.response = this.interim; }, 1000)
  }

  say() {
    const text = new SpeechSynthesisUtterance("November One One Zero Victor Papa");
    /*const selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (const voice of voices) {
      if (voice.name === selectedOption) {
        utterThis.voice = voice;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value; */
    this.synth.speak(text);
  }

}
