import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  private readonly _user = signal<{ name: string; email: string } | null>(null);
  readonly user = this._user.asReadonly();

  constructor(private router: Router) {
    const stored = sessionStorage.getItem('auth_user');
    if (stored) {
      this._user.set(JSON.parse(stored));
      this._isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): boolean {
    if (email === 'admin@core.com' && password === 'admin123') {
      const user = { name: 'Admin User', email: 'admin@core.com' };
      this._user.set(user);
      this._isAuthenticated.set(true);
      sessionStorage.setItem('auth_user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
    sessionStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }
}
