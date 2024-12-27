import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  showPassword: boolean = false;

  ngOnInit() {
    // Reset email and password values if they are already pre-filled
    this.email = '';
    this.password = '';
  }

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']); // Navigate to the dashboard after successful login
      },
      error: err => {
        this.errorMessage = err.error?.message || 'An error occurred during login.';
        console.error(err); 
        alert(this.errorMessage); // Error alert
      }
    });
  }

  onSignUp(){
    this.router.navigate(['/signup']);
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
