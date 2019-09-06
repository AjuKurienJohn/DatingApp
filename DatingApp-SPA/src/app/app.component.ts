import { Component } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  JwtHelper = new JwtHelperService();

  constructor(public authService: AuthService) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!this.JwtHelper.isTokenExpired(token)) {
      this.authService.decodedToken  = this.JwtHelper.decodeToken(token);
    }
  }
}
