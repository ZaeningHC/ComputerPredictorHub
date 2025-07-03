import { Injectable } from '@angular/core';
import { PredictorApiService } from './prediction-api.service';
import {TestCase,PredictionResult,PredictionPayloadItem } from '../models/prediction.model';
import { forkJoin, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PredictionOrchestratorService {
  constructor(private predictorApi: PredictorApiService) {}

  async runPredictions(testCases: TestCase[]): Promise<PredictionResult[]> {
    const results: PredictionResult[] = [];

    for (const testCase of testCases) {

      let csharpPrediction: string | number | undefined;
      let pythonPrediction: string | number | undefined;
      let csharpError: string | undefined;
      let pythonError: string | undefined;

      try {
        const [csharpResp, pythonResp] = await firstValueFrom(
          forkJoin([
            this.predictorApi.predictCSharp(testCase.target, testCase.features),
            this.predictorApi.predictPython(testCase.target, testCase.features),
          ])
        );

        console.log('C# API response:', csharpResp);
        console.log('Python API response:', pythonResp);

        csharpPrediction = csharpResp.prediction;
        pythonPrediction = pythonResp.prediction;
      } catch (error: any) {
        if (error instanceof HttpErrorResponse) {
          csharpError = `HTTP ${error.status}: ${error.message}`;
          pythonError = `HTTP ${error.status}: ${error.message}`;
        } else {
          csharpError = pythonError = 'Unknown error';
        }
      }

      results.push({
        testCase,
        csharpPrediction,
        pythonPrediction,
        csharpError,
        pythonError,
      });
      
    }

    return results;
  }

  async saveResults(payload: PredictionPayloadItem[]): Promise<void> {
    await firstValueFrom(this.predictorApi.saveResults(payload));
  }
}
