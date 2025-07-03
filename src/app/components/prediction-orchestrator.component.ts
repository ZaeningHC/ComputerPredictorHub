import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCase, PredictionResult, PredictionPayloadItem } from '../models/prediction.model';
import { PredictionOrchestratorService } from '../services/prediction-orchestrator.service';
import { parseJsonFileContent } from '../utils/file-utils';
import { mapResultsToPayload } from '../utils/prediction-mapper';

@Component({
  selector: 'app-prediction-orchestrator',
  templateUrl: './prediction-orchestrator.component.html',
  imports: [CommonModule],
})
export class PredictionOrchestratorComponent {
  testCases: TestCase[] = [];
  results: (PredictionResult & { showFeatures: boolean })[] = [];

  isPredicting = false;
  isSaving = false;
  dataSaved = false;

  constructor(private orchestrator: PredictionOrchestratorService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseJsonFileContent(reader.result as string);
      if (parsed) {
        this.testCases = parsed;
        this.results = [];
        this.dataSaved = false;
      } else {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }

  getFeatureKeys(features: any): string[] {
    return features ? Object.keys(features) : [];
  }

  async startPredictionEngines() {
    if (!this.testCases.length) return;

    this.isPredicting = true;
    this.dataSaved = false;
    try {
      const rawResults = await this.orchestrator.runPredictions(this.testCases);
      this.results = rawResults.map(r => ({
        ...r,
        showFeatures: false,
      }));
    } finally {
      this.isPredicting = false;
    }
  }

  async saveResults() {
    if (!this.results.length || this.dataSaved) return;

    const payload = mapResultsToPayload(this.results);

    this.isSaving = true;
    try {
      await this.orchestrator.saveResults(payload);
      alert('Data was persisted to database.');
      this.resetFileInput();
      this.dataSaved = true;
    } catch (error) {
      alert('Failed to save data. Please try again.');
    } finally {
      this.isSaving = false;
    }
  }

  resetFileInput() {
    this.testCases = [];
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  }
}
