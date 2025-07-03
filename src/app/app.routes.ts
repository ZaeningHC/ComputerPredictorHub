import { Routes } from '@angular/router';
import { PredictionOrchestratorComponent } from './components/prediction-orchestrator.component';
import { StoredResultsComponent } from './components/stored-results.component';

export const routes: Routes = [
  { path: '', component: PredictionOrchestratorComponent },
  { path: 'stored-results', component: StoredResultsComponent },
];
