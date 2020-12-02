import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Arquivo } from '../Models/arquivo';

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {

  backUrl:string = "http://localhost:52251/api/Arquivo/"

  constructor(private http:HttpClient) { }

  getArquivos() : Observable<Arquivo[]>{
    return this.http.get<Arquivo[]>(this.backUrl);
  }

  download(id: number) : Observable<any> {
    return this.http.get(this.backUrl + "file/" + id, { responseType: 'arraybuffer' });
  }

  salvar(arquivo: Arquivo): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.backUrl, JSON.stringify(arquivo), {headers: headers});
  }

  editar(id: number, arquivo: Arquivo): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put(this.backUrl + id, JSON.stringify(arquivo), {headers: headers});
  }

  deletar(id: number) : Observable<any>{
    return this.http.delete(this.backUrl + id);
  }
}
