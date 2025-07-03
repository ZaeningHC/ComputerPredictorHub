import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Features,
  PredictionResponse,
  PredictionPayloadItem,
  StoredPredictionResult,
  Page
} from '../models/prediction.model';

@Injectable({ providedIn: 'root' })
export class PredictorApiService {
  private readonly csharpApiUrl = environment.csharpApiUrl;
  private readonly pythonApiUrl = environment.pythonApiUrl;
  private readonly storageApiUrl = environment.storageApiUrl;

  constructor(private http: HttpClient) {}

  predictCSharp(target: string, features: Features): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.csharpApiUrl, { target, features });
  }

  predictPython(target: string, features: Features): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.pythonApiUrl, { target, features });
  }

  saveResults(results: PredictionPayloadItem[]): Observable<string> {
    return this.http.post(this.storageApiUrl, results, { responseType: 'text' });
  }

  getStoredResults(page: number, size: number, sessionId?: string): Observable<Page<StoredPredictionResult>> {
    let url = `${this.storageApiUrl}?page=${page}&size=${size}`;
    if (sessionId) {
      url += `&sessionId=${sessionId}`;
    }
    return this.http.get<Page<StoredPredictionResult>>(url);
  }
}