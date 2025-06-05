import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { CommonModule } from '@angular/common';

interface Row {
  id: number;
  first_name: string;
  email: string;
  nv: number;
  aggregatedRatio?: number;
  aggregatedPercentage?: number;
}

interface Group {
  name: string;
  rows: Row[];
  aggregatedRatio: number;
  aggregatedPercentage: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import CommonModule and FormsModule
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  groups: Group[] = [
    { name: 'Below-500', rows: [], aggregatedRatio: 0, aggregatedPercentage: 0 },
    { name: 'Above-500', rows: [], aggregatedRatio: 0, aggregatedPercentage: 0 }
  ];
  
  allRows: Row[] = [];
  filteredRows: Row[] = [];
  searchText: string = '';
  showSelectionModal: boolean = false;
  activeGroupIndex: number = -1;
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchData();
  }
  
  fetchData(): void {
    this.http.get<Row[]>('http://127.0.0.1:8000/api/rows').subscribe(
      (data) => {
        this.allRows = data;
        this.filteredRows = [...this.allRows]; // Initialize filtered rows with all rows
      },
      (error) => {
        console.error('Error fetching data:', error);
        // Your mock data remains as fallback
      }
    );
  }
  
  openSelectionModal(groupIndex: number): void {
    this.activeGroupIndex = groupIndex;
    this.filteredRows = this.allRows.filter(row => 
      (groupIndex === 0 && row.nv < 500) || (groupIndex === 1 && row.nv >= 500)
    );
    this.showSelectionModal = true;
  }
  
  searchRows(): void {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredRows = this.allRows.filter(row => 
      (row.first_name.toLowerCase().includes(searchTerm) || 
       row.email.toLowerCase().includes(searchTerm)) &&
      ((this.activeGroupIndex === 0 && row.nv < 500) || 
       (this.activeGroupIndex === 1 && row.nv >= 500))
    );
  }
  
  selectRow(row: Row): void {
    if (this.activeGroupIndex !== -1) {
      // Check if the row is already in the group
      const existingIndex = this.groups[this.activeGroupIndex].rows.findIndex(r => r.id === row.id);
      if (existingIndex === -1) {
        this.groups[this.activeGroupIndex].rows.push(row);
        this.calculateAggregates(this.activeGroupIndex);
      }
      this.showSelectionModal = false;
    }
  }
  
  calculateAggregates(groupIndex: number): void {
    const group = this.groups[groupIndex];
    if (group.rows.length > 0) {
      // Calculate aggregated ratio (sum of nv values)
      const totalNv = group.rows.reduce((sum, row) => sum + row.nv, 0);
      group.aggregatedRatio = totalNv;
      
      // Calculate aggregated percentage (average of nv values as percentage of max possible)
      const avgNv = totalNv / group.rows.length;
      group.aggregatedPercentage = (avgNv / 1000) * 100; // Assuming 1000 as max nv value
    } else {
      group.aggregatedRatio = 0;
      group.aggregatedPercentage = 0;
    }
  }
  
  addNewGroup(): void {
    const newGroupName = prompt('Enter new group name:');
    if (newGroupName && newGroupName.trim() !== '') {
      this.groups.push({
        name: newGroupName.trim(),
        rows: [],
        aggregatedRatio: 0,
        aggregatedPercentage: 0
      });
    }
  }
  
  exportToExcel(): void {
    const exportData: any[] = [];
    
    this.groups.forEach(group => {
      // Add group header
      exportData.push({
        'ID': group.name,
        'First Name': group.name,
        'Email': '',
        'NV': '',
        'Aggregated Ratio': group.aggregatedRatio,
        'Aggregated Percentage': group.aggregatedPercentage.toFixed(2) + '%'
      });
      
      // Add group rows
      group.rows.forEach(row => {
        exportData.push({
          'ID': row.id,
          'First Name': row.first_name,
          'Email': row.email,
          'NV': row.nv,
          'Aggregated Ratio': '',
          'Aggregated Percentage': ''
        });
      });
    });
    
    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Groups');
    
    // Generate and download file
    XLSX.writeFile(workbook, 'groups-export.xlsx');
  }
  
  cancelSelection(): void {
    this.showSelectionModal = false;
  }
}