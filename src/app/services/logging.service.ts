import { Injectable } from '@angular/core';
import { EventCode } from '../models/event-code.enum';
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  //Added for demo purposes, real implementation should send logs to a remote server
  logSuccess(message: string, eventCode: EventCode) {
    console.log(
      '%c🚀 Success:',
      'color: green; font-weight: bold;',
      eventCode,
      message
    );
  }

  logWarning(message: string, eventCode: EventCode) {
    console.log(
      '%c⚠️ Warning:',
      'color: orange; font-weight: bold;',
      eventCode,
      message
    );
  }

  logError(message: string, eventCode: EventCode) {
    console.log(
      '%c❌ Error:',
      'color: red; font-weight: bold;',
      eventCode,
      message
    );
  }
}
