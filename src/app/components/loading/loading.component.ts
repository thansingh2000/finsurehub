import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="flex items-center justify-center min-h-[400px]">
      <mat-spinner [diameter]="60"></mat-spinner>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoadingComponent {}
