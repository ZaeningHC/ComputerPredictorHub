import { PredictionResult, PredictionPayloadItem } from '../models/prediction.model';

export function mapResultsToPayload(results: PredictionResult[]): PredictionPayloadItem[] {
  return results.map(r => ({
    target: r.testCase.target,
    features: r.testCase.features,
    answer: r.testCase.answer?.toString() ?? null,
    csharpPrediction: r.csharpPrediction?.toString() ?? null,
    pythonPrediction: r.pythonPrediction?.toString() ?? null,
  }));
}