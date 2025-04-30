import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'client';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Vérifier l'authentification au démarrage
    if (!this.isLoggedIn()) {
      this.handleUnauthorizedAccess();
    }
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  login(username: string, password: string): boolean {
    let user: User | null = null;

    // Simulation d'authentification (à remplacer par un appel API)
    if (username === 'admin' && password === 'admin') {
      user = { id: 1, username: 'admin', role: 'admin' };
    } else if (username === 'client' && password === 'client') {
      user = { id: 2, username: 'client', role: 'client' };
    }

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      // Redirection selon le rôle
      if (user.role === 'admin') {
        this.router.navigate(['/listesproduits']);
      } else {
        this.router.navigate(['/products']);
      }
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.handleUnauthorizedAccess();
  }

  private handleUnauthorizedAccess() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/admin')) {
      this.router.navigate(['/admin/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  isClient(): boolean {
    return this.currentUserSubject.value?.role === 'client';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 