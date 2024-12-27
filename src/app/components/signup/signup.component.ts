import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterUser, User } from '../../../models/user.model';
import { ResponseModel } from '../../../models/reponse.model';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';
  role: string = 'User';
  showPassword: boolean = false;

  constructor(private signupService: AuthService,   private router: Router, private http: HttpClient) {}

  validatePasswords(): void {
    if (this.password !== this.confirmPassword) {
      alert('Both passwords do not match!');
      
    } else {
      this.onSignUp();
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignUp(): void {
 
    const userData: RegisterUser = { email: this.email, password: this.password , role: this.role};

    this.signupService.signup(userData).subscribe({
      next: (response: ResponseModel<any>) => {
      
    
        if (response.statusCode === 201) {
          // Show success message
          alert('Signup successful!');
          this.router.navigate(['/login']);  // Redirect to login page after successful signup
        } else {
          // Show the error message from the API response
          alert(response.message);  // Display the error message received from the backend
        }
      },
      error: (err: HttpErrorResponse) => {

        // Check if there is a specific error message from the API
        const errorMessage = err.error?.message || 'An unexpected error occurred. Please try again.';
        alert(errorMessage);  // Show a generic or specific error message
      }
    });
    
  }
}
