import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  in_body: any;
  in_header: any;
  message_error: string = '';
  Perfil: string = '';
  lightbox: boolean = false;
  response_api: any;


  constructor(
    private myCommon: CommonService,
    private fb: FormBuilder,
    private location: Location) {
    this.formCadastro = this.fb.group({
      cpf: ['', Validators.required],
      nome: ['', Validators.required],
      ocupacao: [''],
      status: ['', Validators.required],
      inicioExpediente: ['', Validators.required],
      inicioIntervalo: ['', Validators.required],
      fimIntervalo: ['', Validators.required],
      fimExpediente: ['', Validators.required],
      senha: ['', Validators.required],
      adm: [''],
    });
  }

  formCadastro: FormGroup;
  get fDadosCadastro() {
    return this.formCadastro.controls;
  }

  modalVisible: boolean = false;
  modalVisibleSpinner: boolean = false;

  ngOnInit(): void {

    if(sessionStorage.getItem("perfil") == "F")
    {
      this.modalVisible = true;
      this.modalVisibleSpinner = true;
      this.message_error = "Acesso restrito";
      this.lightbox = true;
      this.modalVisible = false;
      this.modalVisibleSpinner = false;
      this.location.back();
    }
  }

  buscarCPF()
  {
    this.modalVisible = true;
    this.modalVisibleSpinner = true;
    let cpf: string;
    cpf = this.formCadastro.get('cpf')?.value;
    if (cpf.length == 11) {
      this.myCommon.getPessoaFisicaCPF(this.in_header, cpf).subscribe(
        (response) => {
          this.response_api = response;
          this.formCadastro?.get("nome")?.setValue(this.response_api.nome);
          this.formCadastro?.get("cpf")?.setValue(this.response_api.cpf);
          this.formCadastro?.get("cpf")?.disable();
          this.formCadastro?.get("ocupacao")?.setValue(this.response_api.ocupacao);
          this.formCadastro?.get("status")?.setValue(this.response_api.status);
          this.formCadastro?.get("inicioExpediente")?.setValue(this.response_api.dataHoraInicioExpediente);
          this.formCadastro?.get("inicioIntervalo")?.setValue(this.response_api.dataHoraInicioIntervalo);
          this.formCadastro?.get("fimIntervalo")?.setValue(this.response_api.dataHoraFimIntervalo);
          this.formCadastro?.get("fimExpediente")?.setValue(this.response_api.dataHoraFimExpediente);
          this.formCadastro?.get("senha")?.setValue(this.response_api.senha);
          this.formCadastro?.get("adm")?.setValue((this.response_api.codigoPerfil == 1 ? false : true));
          this.modalVisible = false;
          this.modalVisibleSpinner = false;
        },
        (error) => {
          if(error.status == 0){
            this.message_error = "Erro interno ao buscar informações do CPF";
          }
          else
          {
            this.message_error = "CPF não encontrado. Preencha os dados manualmente";
          }
          this.lightbox = true;
          this.modalVisible = false;
          this.modalVisibleSpinner = false;
        }
      );
    }
    this.modalVisible = false;
    this.modalVisibleSpinner = false;
  }

  salvar()
  {
    var hasErros = false;

    if (this.formCadastro.invalid) {
      Object.keys(this.formCadastro.controls).forEach((field) => {
        const control = this.formCadastro.get(field);
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
    this.lightbox = true;
    this.in_body =
    {
     nome: this.formCadastro?.get("nome")?.value,
     cpf: this.formCadastro?.get("cpf")?.value,
     ocupacao: this.formCadastro?.get("ocupacao")?.value,
     dataHoraInicioExpediente: this.formCadastro?.get("inicioExpediente")?.value == "" ? null : `${this.formCadastro?.get("inicioExpediente")?.value.slice(0, 2)}:${this.formCadastro?.get("inicioExpediente")?.value.slice(2)}`,
     dataHoraInicioIntervalo: this.formCadastro?.get("inicioIntervalo")?.value == "" ? null :`${this.formCadastro?.get("inicioIntervalo")?.value.slice(0, 2)}:${this.formCadastro?.get("inicioIntervalo")?.value.slice(2)}`,
     dataHoraFimIntervalo: this.formCadastro?.get("fimIntervalo")?.value == "" ? null :`${this.formCadastro?.get("fimIntervalo")?.value.slice(0, 2)}:${this.formCadastro?.get("fimIntervalo")?.value.slice(2)}`,
     dataHoraFimExpediente: this.formCadastro?.get("fimExpediente")?.value == "" ? null :`${this.formCadastro?.get("fimExpediente")?.value.slice(0, 2)}:${this.formCadastro?.get("fimExpediente")?.value.slice(2)}`,
     idPessoaJuridica: Number(sessionStorage.getItem("pj")),
     status: this.formCadastro?.get("status")?.value,
     codigoPerfil: this.formCadastro?.get("adm")?.value ? 2 : 1,
     senha: this.formCadastro?.get("senha")?.value,
    };

    this.myCommon.salvarpessoa(this.in_body, this.in_header).subscribe(
      (response) => {
        this.response_api = response;
        this.message_error = "Funcionário cadastrado com sucesso.";
        this.lightbox = true;
        this.modalVisible = false;
        this.modalVisibleSpinner = false;
        this.limpar();
      },
      (error) => {
        if(error.status == 0){
          this.message_error = "Erro interno ao realizar o cadastro do funcionário";
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

  limpar()
  {
    this.formCadastro?.get("cpf")?.enable();
    this.formCadastro?.get("cpf")?.setValue("");
    this.formCadastro?.get("cpf")?.reset();
    this.formCadastro?.get("nome")?.setValue("");
    this.formCadastro?.get("nome")?.reset();
    this.formCadastro?.get("ocupacao")?.setValue("");
    this.formCadastro?.get("ocupacao")?.reset();
    this.formCadastro?.get("status")?.setValue("");
    this.formCadastro?.get("status")?.reset();
    this.formCadastro?.get("inicioExpediente")?.setValue("");
    this.formCadastro?.get("inicioExpediente")?.reset();
    this.formCadastro?.get("inicioIntervalo")?.setValue("");
    this.formCadastro?.get("inicioIntervalo")?.reset();
    this.formCadastro?.get("fimIntervalo")?.setValue("");
    this.formCadastro?.get("fimIntervalo")?.reset();
    this.formCadastro?.get("fimExpediente")?.setValue("");
    this.formCadastro?.get("fimExpediente")?.reset();
    this.formCadastro?.get("senha")?.setValue("");
    this.formCadastro?.get("senha")?.reset();
    this.formCadastro?.get("adm")?.setValue(false);
    this.formCadastro?.get("adm")?.reset();
  }

  closeLightbox()
  {
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
}
