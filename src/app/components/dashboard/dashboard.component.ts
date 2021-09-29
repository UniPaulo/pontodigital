import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../assets/css/main.css']
})
export class DashboardComponent implements OnInit {
  formGroupDashboard:FormGroup;
  in_body: any;
  in_header: any;
  message_error: string = '';
  lightbox: boolean = false;
  response_api: any;

  max_data_inicio: Date;
  min_data_fim: Date;
  max_data_fim: Date;
  Hoje: any;


  constructor( private fb: FormBuilder,    private myCommon: CommonService) {

    this.formGroupDashboard = this.fb.group({
      data: [moment(new Date().toLocaleDateString()).format('DD/MM/YYYY') , Validators.required],});


  this.max_data_inicio = new Date(moment('12/02/2021', 'DD/MM/YYYY').format())
  this.max_data_fim = new Date(moment('12/02/2021', 'DD/MM/YYYY').format())
  this.min_data_fim = new Date(this.formGroupDashboard?.get('data')?.value)
  }



  modalVisible: boolean = false;
  modalVisibleSpinner: boolean = false;
  ngOnInit(): void {
    this.Hoje = sessionStorage.getItem("tday");
  }

  baterPonto()
  {

    this.modalVisible = true;
    this.modalVisibleSpinner = true;
    this.lightbox = true;

    this.in_body = { idPessoaFisica: Number(sessionStorage.getItem("pf")), idPessoaJuridica: Number(sessionStorage.getItem("pj")) };

    this.myCommon.ponto(this.in_body, this.in_header).subscribe(
      (response) => {
        this.response_api = response;
        this.modalVisible = false;
        this.modalVisibleSpinner = false;
        this.message_error =  this.response_api.mensagem;
      },
      (error) => {
        this.modalVisible = false;
        this.modalVisibleSpinner = false;
        if(error.status == 0){
          this.message_error = "Erro interno ao bater o ponto";
        }
        else
        {
          this.message_error = error.error;
        }
      }
    );
  }
  closeLightbox() {
    this.lightbox = false;
  }


}
