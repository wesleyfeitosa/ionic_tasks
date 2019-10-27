import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Usado para guarda de rotas das rotas principais da aplicação
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthState(state.url);
  }

  // Usado para guarda de rotas de rotas filhas
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

  // Usado para o guarda de rotas em caso de uso de lazy loading 
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const url = segments.map(s => `/${s}`).join('');
    // pipe() é usado para encapsular e executar os operadores do rxjs
    // take() escuta um determinado número de vezes os valores de um observable, nesse caso é escutado somente a primeira vez.
    return this.checkAuthState(url).pipe(take(1));
  }

  // Executa a lógica de verificação da autenticação do usuário na aplicação.
  private checkAuthState(redirect: string): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      tap(is => {
        if (!is) {
          this.router.navigate(['/login'], {
            queryParams: { redirect } // url que o usuário tentou acessar sem estar logado, 
            // e que será redirecionado de volta depois de fazer o login.
          })
        }
      })
    )
  }

}
