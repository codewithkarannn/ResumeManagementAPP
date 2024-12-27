import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterUser, User } from '../models/user.model';
import { map } from 'rxjs/operators';  // Import map operator
import { ResponseModel } from '../models/reponse.model';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string;
  role: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7011/api'; // Replace with your API endpoint
  private tokenKey = '1f8ac10f23c5b5bc1167bda84b833e5c57da664b2d2bfa8c56c815a5dcef00f9b3d4b965f1e92f3df5ebd9a5b0fbf5ef2dc9f65bfcc7f2b8438ffb68c24a74c3';

  private userRole: string | null = null;
  router: any;


  constructor(private http: HttpClient) {
    // Initialize the role from local storage if token exists
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.setRoleFromToken(token);
    }

  }

  login(loginData: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/auth/login`, loginData).subscribe({
        next: (response) => {
          const token = response.data;

          this.saveToken(token);
          this.setRoleFromToken(token);

          observer.next(response);
          observer.complete();
          alert('Successfully Login')

        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }


  private saveToken(token: string): void {
    localStorage.setItem("auth", token);
  }

  signup(userData: RegisterUser): Observable<ResponseModel<any>> {
    return this.http.post<ResponseModel<any>>(`${this.apiUrl}/auth/register`, userData);
  }
  private setRoleFromToken(token: string): void {
    const decodedToken = jwtDecode<any>(token);

    this.userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    if (this.userRole != null) {
      localStorage.setItem("role", this.userRole ?? null);
    }

  }

  logout(): void {
    localStorage.removeItem("auth");
    localStorage.removeItem("role");
    
  }


  getToken(): string | null {
    return localStorage.getItem("auth");
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp > currentTime; // Check if token is still valid
  }

  getRole(): string | null {
    return this.userRole || localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }
}
