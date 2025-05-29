// src/app/couchdb-connector.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CouchDbConnectorService {
  private c_url: string = 'http://localhost:5984';
  private databaseName: string = 'fitness';
  private couchUsername: string = 'ashwin';
  private couchPassword: string = 'Ashwin@06';

  constructor(private http: HttpClient) {}

  private headers = new HttpHeaders({
    Authorization: 'Basic ' + btoa(this.couchUsername + ':' + this.couchPassword),
    'Content-type': 'application/json'
  });
  getById(id: string) {
  const url = `${this.c_url}/${this.databaseName}/${encodeURIComponent(id)}`;
  return this.http.get(url, { headers: this.headers });
}


  create(doc: any) {
    const url = `${this.c_url}/${this.databaseName}`;
    return this.http.post(url, doc, { headers: this.headers });
  }

  read(view_name: string, key: string) {
  const url = `${this.c_url}/${this.databaseName}/_design/user/_view/${view_name}`;
  return this.http.get(url, { headers: this.headers });
}

  update(_id: string, _rev: string, doc: any) {
  const url = `${this.c_url}/${this.databaseName}/${encodeURIComponent(_id)}?rev=${encodeURIComponent(_rev)}`;
  return this.http.put(url, doc, { headers: this.headers });
}

  getWorkoutView() {
  const url = `${this.c_url}/${this.databaseName}/_design/user/_view/workout`;
  return this.http.get(url, { headers: this.headers });
}

}
