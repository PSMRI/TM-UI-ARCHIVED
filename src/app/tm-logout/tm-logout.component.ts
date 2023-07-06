import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../app-modules/core/services/auth.service";
@Component({
  selector: 'app-tm-logout',
  templateUrl: './tm-logout.component.html',
  styleUrls: ['./tm-logout.component.css']
})
export class TmLogoutComponent implements OnInit {

  constructor(private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login'])

  }
  
}
