// File: src/app/app.component.ts

import { Component } from '@angular/core';
import { DataTableComponent } from "./data-table/data-table.component";

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header>
        <h1>Data Table Application</h1>
      </header>
      <main>
        <app-data-table></app-data-table>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    
    h1 {
      color: #0c2d5e;
    }
  `],
  imports: [DataTableComponent]
})
export class AppComponent {
  title = 'data-table-app';
}