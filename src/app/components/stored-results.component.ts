import { Component, OnInit } from '@angular/core';
import { PredictorApiService } from '../services/prediction-api.service';
import { StoredPredictionResult } from '../models/prediction.model';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stored-results',
  templateUrl: './stored-results.component.html',
  imports: [CommonModule, FormsModule],
})
export class StoredResultsComponent implements OnInit {

  results: StoredPredictionResult[] = [];
  sessionIdFilter: string = '';
  isLoading = false;

  page = 0;
  totalPages = 1;
  totalElements = 0;
  pageSize = 16;

  expandedRows = new Set<number>();

  constructor(private api: PredictorApiService) {}

  ngOnInit() {
    this.loadResults();
  }

  async loadResults() {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(
        this.api.getStoredResults(this.page, this.pageSize, this.sessionIdFilter)
      );
      if (response) {
        this.results = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.expandedRows.clear();
      } else {
        this.results = [];
        this.totalPages = 1;
        this.totalElements = 0;
        this.expandedRows.clear();
      }
    } finally {
      this.isLoading = false;
    }
  }

  async applyFilter() {
    this.page = 0;
    await this.loadResults();
  }

  async clearFilter() {
    this.sessionIdFilter = '';
    this.page = 0;
    await this.loadResults();
  }

  toggleFeatures(id: number) {
    if (this.expandedRows.has(id)) {
      this.expandedRows.delete(id);
    } else {
      this.expandedRows.add(id);
    }
  }

  isExpanded(id: number): boolean {
    return this.expandedRows.has(id);
  }

  getFeatureKeys(featuresJson: string, target: string): string[] {
    try {
      const obj = JSON.parse(featuresJson);
      return Object.keys(obj).filter(key => key !== target);
    } catch {
      return [];
    }
  }

  getFeatureValue(featuresJson: string, key: string): any {
    try {
      const obj = JSON.parse(featuresJson);
      return obj[key];
    } catch {
      return '-';
    }
  }

  async nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      await this.loadResults();
    }
  }

  async prevPage() {
    if (this.page > 0) {
      this.page--;
      await this.loadResults();
    }
  }

  async goToLastPage() {
  if (this.totalPages > 0 && this.page + 1 < this.totalPages) {
    this.page = this.totalPages - 1;
    await this.loadResults();
  }
}
}
