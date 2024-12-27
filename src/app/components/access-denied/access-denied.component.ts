import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.css'
})
export class AccessDeniedComponent {
  
  constructor(private authService: AuthService,  private router: Router) {
  }

  goTOLoginPage(): void {
    
    this.router.navigate(['/login']);
  }
}
