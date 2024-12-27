import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AddOrEditCandidate, Candidate } from '../../../models/addoreditcandidate.model';
import { FormsModule } from '@angular/forms';
import { City, Country } from '../../../models/country.model';
import { CandidateService } from '../../../services/candidate.service';
import { ResponseModel } from '../../../models/reponse.model';
import { Status } from '../../../models/status.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule , CommonModule],
  providers : [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  isAdmin: boolean = false;
  isFormVisible : boolean= false;
  isEditFormVisible : boolean= false;
  isViewCandidate : boolean= false;
  countries: Country[] = [];
  cities: City[] = [];
  statuses: Status[] = [];
  selectedCountryId: number = 0;
  cvFile: File | null = null;
  interviewDate?: Date; // Original Date Object
  formattedDate: string | null = null;
  searchQuery: string = '';
  

  candidate: AddOrEditCandidate = {
    candidateId: null, 
    name: '', 
    email: '',
    mobile: '', 
    ctc: undefined, 
    expectedCtc: undefined, 
    interviewDate: undefined, 
    interviewFeedback: '', 
    statusId: 0, 
    cityId: 0, 
    createdAt: undefined, 
  };

  viewCandidate: Candidate = {
    candidateId: null, 
    name: '', 
    email: '',
    mobile: '', 
    ctc: undefined, 
    expectedCtc: undefined, 
    interviewDate: undefined, 
    interviewFeedback: '', 
    statusId: 0, 
    cityId: 0, 
    cityName : '',
    statusName :'',
    createdAt: undefined, 
    cvFileName : ''
  };
  
candidates  :  Candidate[] =[];
filteredCandidates : Candidate[]=[];
  constructor(private authService: AuthService,  private router: Router, private candidateService: CandidateService, private datePipe: DatePipe) {
  }


  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
     // Fetch countries on component initialization
    this.getCountries();
    this.getStatuses();
    this.getAllCandidates();
   
    // Format the date to dd/MM/yyyy
    if (this.candidate.interviewDate) {
      this.formattedDate = this.datePipe.transform(this.candidate.interviewDate, 'dd/MM/yyyy');
    }
    console.log(this.countries)
  }
  OnLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  closeForm(){
    this.isFormVisible = false;
  }
  closeViewCandidate(){
    this.isViewCandidate = false;
  }
  openForm(){
    this.isFormVisible = true;
  } 
  openViewCandidate(selectedCandidate : Candidate){
    if(selectedCandidate.candidateId != null)
    {
      this.getCandidateByCandidateID(selectedCandidate.candidateId)
    }
    this.isViewCandidate = true;
  } 
  onSubmit() {
   
    this.candidateService.addNewCandidate(this.candidate).subscribe({
      next: (response) => {
        this.candidate =  response.data;
        
        this.closeForm();
        if(this.candidate.candidateId != null && this.cvFile != null)
        {
          this.candidateService.uploadcv(this.candidate.candidateId , this.cvFile).subscribe({
            next: (response) => {
              this.candidate =  response.data;
              alert('Candidate added successfully!');
            },
            error: (err) => {
              alert(err.error?.message || 'Failed to add candidate.');
            }
            });
        }
        
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to add candidate.');
      },
    });
  }

  onEditSubmit(existingcandidate : Candidate) {
   
    
 
    this.candidateService.editCandidate(this.candidate).subscribe({
      next: (response) => {
        this.candidate =  response.data;
        
        this.closeForm();
        if(this.candidate.candidateId != null && this.cvFile != null)
        {
          this.candidateService.uploadcv(this.candidate.candidateId , this.cvFile).subscribe({
            next: (response) => {
              this.candidate =  response.data;
              alert('Candidate added successfully!');
            },
            error: (err) => {
              alert(err.error?.message || 'Failed to add candidate.');
            }
            });
        }
        
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to add candidate.');
      },
    });
  }
   getCountries() {
    this.candidateService.getCountries().subscribe({
      next: (response) => {
        if (response.statusCode == 201 && response.data) {
          this.countries = response.data; 
          
        } 
      }
    });
   }
     // Method to handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.cvFile = input.files[0];
      console.log('File selected:', this.cvFile.name);
    } else {
      this.cvFile = null;
    }
  }


    // Fetch cities based on the selected country ID
  getCities(countryId: number) {
    this.candidateService.getCities(countryId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.cities = response.data; // Store cities based on selected country
        }
    
    }  });
  }

  getStatuses() {
    this.candidateService.getStatuses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.statuses = response.data; // Store cities based on selected country
        }
    
    }  });
  }
  // Handle country selection
  onCountryChange(countryId: number | null) {
    if(countryId)
    {
      this.selectedCountryId = countryId;
      this.getCities(countryId); 
    }
 
  }

  // Optionally, if you want to handle the change of the date picker:
  onDateChange(event: any) {
    const date = event.target.value;
    console.log('Selected Date:', date);
  }

  getAllCandidates(){
    this.candidateService.getAllCandidates().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.candidates = response.data; // Store cities based on selected country
          this.filteredCandidates = response.data;
        }
        console.log(this.candidates);
    }  });;
  }

  
  
   // Method to handle input changes in the search box
   onSearch() {
    if(this.searchQuery != null || this.searchQuery != '')
    {
      this.filteredCandidates = this.candidates.filter(c =>
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.mobile?.toLowerCase().includes(this.searchQuery.toLowerCase())||
        c.cityName.toLowerCase().includes(this.searchQuery.toLowerCase())||
        c.statusName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    console.log(this.filteredCandidates);
    
  }

  // Method to handle form submission
  onSearchSubmit() {
    console.log('Search submitted with query:', this.searchQuery);
    this.onSearch();  // Apply the search logic when the submit button is clicked
  }

  viewCV(candidateId: string) {
    this.candidateService.getcvbycandidateID(candidateId).subscribe(blob => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL); // Open in a new browser tab/window
    }, error => {
      console.error('Error fetching CV:', error);
    });
  }

  getStatusClass(statusName: string): string {
    switch (statusName) {
      case 'Hold':
        return 'border-gray-400 text-gray-400';
      case 'Reject':
        return 'border-red-500 text-red-500';
      case 'Shortlist':
        return 'border-green-500 text-green-500';
      case 'Offered':
        return 'border-blue-500 text-blue-500';
      case 'Joined':
        return 'border-green-600 text-green-600';
      case 'Not Joined':
        return 'border-gray-500 text-gray-500';
      default:
        return ''; 
    }
  }

  getCandidateByCandidateID(candidateID : string) {
   
    this.candidateService.getCandidateByCandidateID(candidateID).subscribe({
      next: (response) => {
        this.viewCandidate =  response.data;
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to fetch  candidate.');
      },
    });
  }

}
