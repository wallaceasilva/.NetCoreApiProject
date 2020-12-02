import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Arquivo } from '../Models/arquivo';
import { ArquivoService } from '../services/arquivo.service';

@Component({
  selector: 'app-arquivos',
  templateUrl: './arquivos.component.html',
  styleUrls: ['./arquivos.component.css']
})
export class ArquivosComponent implements OnInit
{
  arquivos: Arquivo[] = [];
  colunas: any;
  menuItens: MenuItem[] = [];
  displayDialogNew: boolean = false;
  displayDialogEdit: boolean = false;
  arquivoNovo = {} as Arquivo;
  arquivoEdicao = {} as Arquivo;
  arquivoSelecionado = {} as Arquivo;

  uploadedFiles: any[] = [];

  constructor(private arquivoService: ArquivoService, 
              private messageService: MessageService,
              private confirmService: ConfirmationService)
  { }

  getArqs() {
    this.arquivoService.getArquivos().subscribe(
      (result: Arquivo[]) => {
        this.arquivos = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  onUpload(event: any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);

        var reader = new FileReader();
        var fileByteArray: Array<number> = [];
        reader.readAsArrayBuffer(file);
        reader.onloadend = function (evt: any) {
          if (evt.target.readyState == FileReader.DONE) {
            var arrayBuffer = <any>evt.target.result;
            var array = new Uint8Array(arrayBuffer);
            for (var i = 0; i < array.length; i++) {
              fileByteArray.push(array[i]);
            }
        }}

        if (this.displayDialogNew == true){
          this.arquivoNovo.nome = file.name;
          this.arquivoNovo.dtCriacao = new Date();
          this.arquivoNovo.file = fileByteArray;
        } else {
          this.arquivoEdicao.id = this.arquivoSelecionado.id;
          this.arquivoEdicao.nome = file.name;
          this.arquivoEdicao.dtCriacao = new Date();
          this.arquivoEdicao.file = fileByteArray;
        }
    }
  }

  onDownload(id: number, fileName: string) {
    return this.arquivoService.download(id).subscribe(res => {
      const blob = new Blob([res], { type: 'application/octet-stream'});
      const url= window.URL.createObjectURL(blob);
      //window.open(url);
      var anchor = document.createElement("a");
      anchor.download = fileName;
      anchor.href = url;
      anchor.click();
    });
  }

  onRemove(){
    this.uploadedFiles = [];
    this.arquivoNovo.file = [];
    this.arquivoEdicao.file = [];
  }

  showDialogNew(){
    this.displayDialogNew = true;
    this.displayDialogEdit = false;
    this.arquivoSelecionado = {} as Arquivo;
  }

  showDialogEdit(){
    if (this.arquivoSelecionado.id == null) {
      this.messageService.add({severity : 'warn', summary: "Advertencia!", detail: "Por favor selecione um registro!"});
      return;
    }
    this.displayDialogEdit = true;
    this.displayDialogNew = false;
    this.arquivoNovo = {} as Arquivo;
  }

  salve() {
    this.arquivoService.salvar(this.arquivoNovo).subscribe(
      (result: any) => {
        let novoArq = result as Arquivo;
        this.validarArquivo(novoArq);
        this.messageService.add({
          severity: 'success',
          summary: "Resultado",
          detail: "Arquivo salvo com sucesso!"
        });
        this.displayDialogNew = false;
        this.getArqs();
      },
      error => {
        console.log(error);
      }
    );
  }

  edit() {
    this.confirmService.confirm({
      message: "Deseja Alterar o arquivo existente?",
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept : () =>{
        this.arquivoSelecionado = this.arquivoEdicao;
        this.arquivoService.editar(this.arquivoSelecionado.id, this.arquivoSelecionado).subscribe(
          (result:any) =>{
            this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Arquivo alterado com sucesso!" });
            this.displayDialogEdit = false;
            this.getArqs();
          },
          error => {
            console.log(error);
          }
        )
      }
    })
  }

  delete(){
    if (this.arquivoSelecionado.id == null) {
      this.messageService.add({severity : 'warn', summary: "Advertencia!", detail: "Por favor selecione um registro!"});
      return;
    }
    this.confirmService.confirm({
      message: "Deseja excluir este arquivo?",
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept : () =>{
        this.arquivoService.deletar(this.arquivoSelecionado.id).subscribe(
          (result:any) =>{
            this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Arquivo excluido com sucesso!" });
            this.deleteObject(result.id);
            this.getArqs();
          }
        )
      }
    })
  }

  deleteObject(id:number){
    let index = this.arquivos.findIndex((e) => e.id == id);
    if(index != -1){
      this.arquivos.splice(index, 1);
    }
  }

  validarArquivo(pArquivo: Arquivo){
    let index = this.arquivos.findIndex((e) => e.id == pArquivo.id);

    if(index != -1){
      this.arquivos[index] = pArquivo;
    }else{
      this.arquivos.push(pArquivo);
    }
  }

  ngOnInit(): void {
    this.getArqs();
    this.colunas = [
      {field: "id", header: "ID"},
      {field: "nome", header: "Nome do Arquivo"},
      {field: "dtCriacao", header: "Data da Inclusão"},
      {field: "file", header: "Arquivo"},
    ];

    this.menuItens = [
      { label: 'Novo', icon: 'pi pi-fw pi-plus', command: ()=> this.showDialogNew()},
      { label: 'Editar', icon: 'pi pi-fw pi-pencil', command: ()=> this.showDialogEdit()},
      { label: 'Excluir', icon: 'pi pi-fw pi-times', command: ()=> this.delete()}
    ];
  }
}
