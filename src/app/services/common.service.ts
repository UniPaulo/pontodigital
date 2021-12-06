import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../config/config.service";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  API_URL = environment.API_URL;
  in_body: any;
  in_header: any;
  tokenJWT: any;

  constructor(private http: HttpClient) {
    this.tokenJWT = sessionStorage.getItem("token");
    this.in_header = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization':  this.tokenJWT
  });
  }

  token( cpf: string)
  {
    return this.http.post(`${this.API_URL}/Token?CPF=${cpf}`, {
    });
  }
  autenticar(in_body: any)
  {
    this.in_header.Authorization = sessionStorage.getItem("token");
    return this.http.post(`${this.API_URL}/Autenticar`, in_body, {
      headers: this.in_header
    });
  }

  ponto(in_body: any)
  {
    this.in_header.Authorization = sessionStorage.getItem("token");
    return this.http.post(`${this.API_URL}/Ponto/RealizarPonto`, in_body, {
      headers: this.in_header
    });
  }

  getEmpresas(cpf: string)
  {
    this.in_header.Authorization = sessionStorage.getItem("token");
    return this.http.get(`${this.API_URL}/PessoaJuridica?CPF=${cpf}`, {
      headers: this.in_header
    });
  }
  getPessoaFisicaCPF(cpf: string)
  {
    this.in_header.Authorization = sessionStorage.getItem("token");
    return this.http.get(`${this.API_URL}/PessoaFisica/CPF/${cpf}`, {
      headers: this.in_header
    });
  }
  getRelatorio(filtro: string, dataInicio: string,dataFim: string, IdPessoaJuridica: Number)
  {
    this.in_header.Authorization = sessionStorage.getItem("token");
    return this.http.get(`${this.API_URL}/RelatorioPonto/${filtro}/${dataInicio}/${dataFim}/${IdPessoaJuridica}`, {
      headers: this.in_header
    });
  }
  salvarpessoa(in_body: any, in_header: any)
  {
    this.in_header.Authorization = sessionStorage.getItem("token");
    return this.http.post(`${this.API_URL}/PessoaFisica`, in_body, {
      headers: this.in_header,
    });
  }

  replaceAll(txTexto: string, search: string, replacement: string) {
    return txTexto.split(search).join(replacement);
  }

}
