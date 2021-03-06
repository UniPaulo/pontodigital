import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],
})
export class RelatorioComponent implements OnInit {
  in_body: any;
  in_header: any;
  message_error: string = '';
  lightbox: boolean = false;
  resultado: boolean = false;
  response_api: any[] = [];

  max_data_inicio: Date | undefined;
  min_data_fim: Date | undefined;
  max_data_fim: Date | undefined;
  date_01_01_21: Date = new Date(moment('01/01/2021', 'DD/MM/YYYY').format());

  page = 1;
  pageSize = 10;

  constructor(
    private myCommon: CommonService,
    private fb: FormBuilder
  ) {
    this.formRelatorio = this.fb.group({
      filtro: ['', Validators.required],
      data_inicio: [
        moment().subtract(10, 'years').format(),
        Validators.required,
      ],
      data_fim: [moment().format(), Validators.required],
    });
  }

  formRelatorio: FormGroup;
  get fDadosCadastro() {
    return this.formRelatorio.controls;
  }

  modalVisible: boolean = false;
  modalVisibleSpinner: boolean = false;
  pagina: number = 1;
  maxSize: number = 9;

  ngOnInit(): void {
    if (sessionStorage.getItem('perfil') == 'F') {
      this.formRelatorio?.get('filtro')?.disable();
      this.formRelatorio
        ?.get('filtro')
        ?.setValue(sessionStorage.getItem('cpf'));
    }
  }

  buscar() {
    this.modalVisible = true;
    this.modalVisibleSpinner = true;
    let filtro: string;
    let dataInicio: string;
    let dataFim: string;
    filtro = this.formRelatorio.get('filtro')?.value;
    if (sessionStorage.getItem('perfil') == 'F') {
      filtro = this.myCommon.replaceAll(
        this.myCommon.replaceAll(filtro, '.', ''),
        '-',
        ''
      );
    }

    if(this.formRelatorio.get('filtro')?.value == null || this.formRelatorio.get('filtro')?.value == "" || this.formRelatorio.get('filtro')?.value == 'undefined')
    {
    this.message_error = 'Obrigat??rio informar Nome ou CPF no campo Filtro';
    this.lightbox = true;
    this.modalVisible = false;
    this.modalVisibleSpinner = false;
    return;
    }
    if (this.formRelatorio?.get('data_inicio')?.value == 'undefined/undefined/undefined' || this.formRelatorio?.get('data_fim')?.value == 'undefined/undefined/undefined') {
      this.message_error = 'Obrigat??rio informar os Filtros de Data In??cio e Data Final';
      this.lightbox = true;
      this.modalVisible = false;
      this.modalVisibleSpinner = false;
      return;
    }



    dataInicio = this.formRelatorio?.get('data_inicio')?.value.day == null || this.formRelatorio?.get('data_inicio')?.value.day == 'undefined' ?  this.date_01_01_21.toISOString(): `${this.formRelatorio?.get('data_inicio')?.value.year}-${this.formRelatorio?.get('data_inicio')?.value.month}-${(this.formRelatorio?.get('data_inicio')?.value.day.length == 1 ? "0"+this.formRelatorio?.get('data_inicio')?.value.day : this.formRelatorio?.get('data_inicio')?.value.day)}T00:00:00`;
    dataFim = this.formRelatorio?.get('data_fim')?.value.day == null || this.formRelatorio?.get('data_fim')?.value.day == 'undefined' ? new Date().toISOString(): `${this.formRelatorio?.get('data_fim')?.value.year}-${this.formRelatorio?.get('data_fim')?.value.month}-${(this.formRelatorio?.get('data_fim')?.value.day.length == 1 ? "0"+this.formRelatorio?.get('data_fim')?.value.day : this.formRelatorio?.get('data_fim')?.value.day)}T00:00:00`;

    if (filtro != '' && dataInicio != '' && dataFim != '') {
      if (dataInicio == 'Invalid date' || dataFim == 'Invalid date') {
        this.message_error = 'Obrigat??rio informar os Filtros de Data In??cio e Data Final';
        this.lightbox = true;
        this.modalVisible = false;
        this.modalVisibleSpinner = false;
        return;
      }
      this.myCommon
        .getRelatorio(
          filtro,
          dataInicio,
          dataFim,
          Number(sessionStorage.getItem('pj'))
        )
        .subscribe(
          (response) => {
            this.resultado = true;
            this.response_api = response as any[];
            this.modalVisible = false;
            this.modalVisibleSpinner = false;
          },
          (error) => {
            if (error.status == 0) {
              this.message_error =
                'Erro interno ao buscar informa????s do Relat??rio';
            } else {
              this.message_error = error.error;
            }
            this.resultado = false;
            this.lightbox = true;
            this.modalVisible = false;
            this.modalVisibleSpinner = false;
          }
        );
    } else {
      this.message_error = 'Obrigat??rio informar os Filtros';
      this.lightbox = true;
      this.modalVisible = false;
      this.modalVisibleSpinner = false;
    }
  }

  exportarExcel() {
    this.downloadLink(this.response_api[0].excel);
  }

  downloadLink(url: string) {
    let link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  limpar() {
    this.resultado = false;
    this.response_api = [];
    if (sessionStorage.getItem('perfil') == 'F') {
      this.formRelatorio?.get('filtro')?.disable();
      this.formRelatorio
        ?.get('filtro')
        ?.setValue(sessionStorage.getItem('cpf'));
    } else {
      this.formRelatorio?.get('filtro')?.setValue('');
      this.formRelatorio?.get('filtro')?.reset();
    }
    this.formRelatorio?.get('data_inicio')?.setValue('');
    this.formRelatorio?.get('data_inicio')?.reset();
    this.formRelatorio?.get('data_fim')?.setValue('');
    this.formRelatorio?.get('data_fim')?.reset();
  }

  closeLightbox() {
    this.lightbox = false;
  }
}
