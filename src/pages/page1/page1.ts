import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
//import {SpeechRecognition} from "ionic-native";

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

  private initializeRecognition = () => {
    if (!this.recognition) {
      return;
    }

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
        return !!e.isFinal || !!e[0].final;
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
  };

  constructor(public navCtrl: NavController, public platform: Platform) {
    this.recognition = null;
    this.recognizing = false;

    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      let _window = (<any>window);

      if (this.platform.is('mobile')) {
        this.recognition = new _window.SpeechRecognition();
        this.initializeRecognition();
      } else {
        if (!('webkitSpeechRecognition' in window)) {
          alert('¡API SpeechRecognition no soportada!');
          return;
        }

        this.recognition = new _window.webkitSpeechRecognition();
        this.initializeRecognition();
      }
    });
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
