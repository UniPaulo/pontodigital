import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../config/config.service";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  API_URL = environment.API_URL;
  in_body: any;
  in_header: any;

  constructor(private http: HttpClient) {}

  autenticar(in_body: any, in_header: any)
  {
    return this.http.post(`${this.API_URL}/Autenticar`, in_body, {
      headers: in_header,
    });
  }

  ponto(in_body: any, in_header: any)
  {
    return this.http.post(`${this.API_URL}/Ponto/RealizarPonto`, in_body, {
      headers: in_header,
    });
  }

  getEmpresas(in_header: any, cpf: string)
  {
    return this.http.get(`${this.API_URL}/PessoaJuridica/ListarEmpresas/${cpf}`, {
    });
  }
  getPessoaFisicaCPF(in_header: any, cpf: string)
  {
    return this.http.get(`${this.API_URL}/PessoaFisica/CPF/${cpf}`, {
    });
  }
  getRelatorio(in_header: any, filtro: string, dataInicio: string,dataFim: string, IdPessoaJuridica: Number)
  {
    return this.http.get(`${this.API_URL}/RelatorioPonto/${filtro}/${dataInicio}/${dataFim}/${IdPessoaJuridica}`, {
    });
  }
  salvarpessoa(in_body: any, in_header: any)
  {
    return this.http.post(`${this.API_URL}/PessoaFisica`, in_body, {
      headers: in_header,
    });
  }

  replaceAll(txTexto: string, search: string, replacement: string) {
    return txTexto.split(search).join(replacement);
  }

}
