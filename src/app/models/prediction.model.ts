export interface Features {
  [key: string]: string | number | undefined;
  cpu_cores?: number;
  cpu_speed_ghz?: number;
  ram_gb?: number;
  storage_type?: string;
  storage_gb?: number;
  operating_system?: string;
  target_use_case?: string;
  price_usd?: number;
}

export interface TestCase {
  target: string;
  features: Features;
  answer?: string | number;
}

export interface PredictionResult {
  testCase: TestCase;
  csharpPrediction?: string | number;
  pythonPrediction?: string | number;
  csharpError?: string;
  pythonError?: string;
}

export interface StoredPredictionResult {
  id: number;
  sessionId: string;
  sequenceNumber: number;
  target: string;
  features: string;
  answer: string | null;
  csharpPrediction: string | null;
  pythonPrediction: string | null;
  createdAt: string;
}

export interface PredictionResponse {
  prediction: string | number;
}

export interface PredictionPayloadItem {
  target: string;
  features: Features;
  answer: string | null;
  csharpPrediction: string | null;
  pythonPrediction: string | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}