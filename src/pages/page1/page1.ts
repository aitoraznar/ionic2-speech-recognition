import {Component, ViewChild, ElementRef} from '@angular/core';

import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  private mic_off: any = {
    icon: 'mic',
    color: 'balance'
  };
  private mic_on: any = {
    icon: 'mic',
    color: 'danger'
  };
  private mic: any = this.mic_off;
  private recognition: any;
  private recognizing: Boolean;
  @ViewChild('recognitionResult') recognitionResult: ElementRef;

  constructor(public navCtrl: NavController) {
    this.recognition = null;
    this.recognizing = false;

    let _window = (<any>window);

    if (!('webkitSpeechRecognition' in window)) {
      alert('¡API no soportada!');
    } else {

      this.recognition = new _window.webkitSpeechRecognition();
      this.recognition.lang = "es-ES";
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        console.log('[SpeechRecognition]', 'start');
        this.recognizing = true;
        this.recognitionResult.nativeElement.innerText = '';
      };

      this.recognition.onresult = (event) => {
        let results = Array.prototype.slice.call(event.results);
        let result = results.find((e) => {
          return !!e.isFinal;
        });

        if (result) {
          let resultText = result[0].transcript;
          console.log('[SpeechRecognition]', 'result', resultText);
          this.recognitionResult.nativeElement.innerText = resultText;
        }
      };

      this.recognition.onerror = (event) => {
        console.error(event);
      };

      this.recognition.onend = () => {
        console.log('[SpeechRecognition]', 'end');
        this.recognizing = false;
        this.mic = this.mic_off;
      };

    }
  }

  processSpeech() {
    if (this.recognizing == false) {
      this.recognition.start();
      this.recognizing = true;
      this.mic = this.mic_on;
    } else {
      this.recognition.stop();
      this.recognizing = false;
      this.mic = this.mic_off;
    }
  }

}
