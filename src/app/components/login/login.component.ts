import { Component, NgModule, OnInit } from '@angular/core';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  in_body: any;
  in_header: any;
  modalVisible: boolean = false;
  modalVisibleSpinner: boolean = false;
  message_error: string = '';
  lightbox: boolean = false;
  existe: boolean = false;
  ok: boolean = false;
  lista_empresas: any;
  response_api: any;

  constructor(
    private myCommon: CommonService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formGroupLogin = this.fb.group({
      cpf: ['', Validators.required],
      senha: ['', Validators.required],
      empresa: ['', Validators.required],
    });
  }

  formGroupLogin: FormGroup;
  get fDadosLogin() {
    return this.formGroupLogin.controls;
  }

  ngOnInit(): void {
  }

  autenticar() {


    var hasErros = false;

    if (this.formGroupLogin.invalid) {
      Object.keys(this.formGroupLogin.controls).forEach((field) => {
        const control = this.formGroupLogin.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      hasErros = true;
    }

    if (hasErros) {
      this.message_error = "Verifique os campos obrigatórios";
      this.lightbox = true;
      return this.rollPageToFirstError();
    }

    this.modalVisible = true;
    this.modalVisibleSpinner = true;

    this.in_body = { cpf: this.formGroupLogin?.get("cpf")?.value, senha: this.formGroupLogin?.get("senha")?.value, idPessoaJuridica: Number(this.formGroupLogin?.get("empresa")?.value) };
    this.myCommon.autenticar(this.in_body).subscribe(
      (response) => {
        this.response_api = response;
        this.modalVisible = false;
        this.modalVisibleSpinner = false;
        sessionStorage.setItem("cpf", this.response_api.cpf);
        sessionStorage.setItem("perfil", this.response_api.codigoPerfil == 1 ? "F" : "A");
        sessionStorage.setItem("pf", this.response_api.idPessoaFisica);
        sessionStorage.setItem("pj", this.response_api.idPessoaJuridica);
        sessionStorage.setItem("nome", this.response_api.nome);
        sessionStorage.setItem("tday", this.response_api.hoje);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        if(error.status == 0){
          this.message_error = "Erro interno ao fazer autenticação";
        }
        else
        {
          this.message_error = error.error;
        }
        this.lightbox = true;
        this.modalVisible = false;
        this.modalVisibleSpinner = false;
      }
    );
  }

  closeLightbox() {
    this.lightbox = false;
  }

  rollPageToFirstError() {
    setTimeout(() => {
      var element = document.getElementsByClassName(
        "form-control ng-invalid ng-touched"
      )[0];
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 400);
  }

  buscaEmpresas() {
    let cpf: string;
    cpf = this.formGroupLogin.get('cpf')?.value;
    if (cpf.length == 11) {
      this.myCommon.token(this.formGroupLogin?.get("cpf")?.value).subscribe(
        (response) => {
          this.response_api = response;
          if(this.response_api?.token != null)
          {
            this.modalVisible = false;
            this.modalVisibleSpinner = false;
            sessionStorage.setItem("token", this.response_api.token);
            this.myCommon.getPessoaFisicaCPF(cpf).subscribe(
              (response_1) => {
                this.response_api = response_1;
                if(this.response_api.cpf != null)
                {
                  this.myCommon.getEmpresas(cpf).subscribe(
                    (response_2) => {
                      this.existe = true;
                      this.formGroupLogin.get('empresa')?.enable();
                      this.lista_empresas = response_2;
                      this.ok = true;
                    },
                    (error) => {
                      if(error.status == 0){
                        this.message_error = "Erro interno ao buscar empresas vinculadas ao CPF informado";
                      }
                      else
                      {
                        this.message_error = error.error;
                      }
                      this.existe = false;
                      this.lightbox = true;
                      this.modalVisible = false;
                      this.modalVisibleSpinner = false;
                      this.formGroupLogin.get('empresa')?.disable();
                    }
                  );
                }
                else
                {
                  this.message_error = "CPF não encontrado na base dados.";
                }
              },
              (error) => {
                if(error.status == 0){
                  this.message_error = "Erro interno ao buscar informações do CPF";
                }
                else
                {
                  this.message_error = "CPF não encontrado na base dados.";
                }
                this.lightbox = true;
                this.modalVisible = false;
                this.modalVisibleSpinner = false;
              }
            );
          }
          else
          {
            this.message_error = "Erro interno ao gerar token";
          }
        },
        (error) => {
          if(error.status == 0){
            this.message_error = "Erro interno ao gerar token";
          }
          else
          {
            this.message_error = error.error;
          }
          this.lightbox = true;
          this.modalVisible = false;
          this.modalVisibleSpinner = false;
        }
        );
    }
    else
    {
      this.existe = false;
      this.ok = false;
    }
  }
}
