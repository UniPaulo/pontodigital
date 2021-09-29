import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../../../assets/css/main.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  Nome: any = "";
  CPF: any = "";
  Perfil: any = "";
  func: boolean = true;


  ngOnInit(): void {
    if(sessionStorage.getItem("perfil") == "" || sessionStorage.getItem("perfil") == null)
    {
      this.router.navigate(['']);
    }
    else
    {
      this.Nome = sessionStorage.getItem("nome");
      this.CPF = sessionStorage.getItem("cpf");
      this.Perfil = sessionStorage.getItem("perfil");
      this.func = this.Perfil == "F" ? false : true;
    }
  }

  sair()
  {
    sessionStorage.removeItem("cpf");
    sessionStorage.removeItem("perfil");
    sessionStorage.removeItem("pf");
    sessionStorage.removeItem("pj");
    sessionStorage.removeItem("nome");
    sessionStorage.removeItem("tday");
  }

}
