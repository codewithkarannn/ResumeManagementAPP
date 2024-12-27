import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City, Country } from '../models/country.model';
import { ResponseModel } from '../models/reponse.model';
import { AddOrEditCandidate, Candidate } from '../models/addoreditcandidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

 
  private apiUrl = 'https://localhost:7011/api/candidate'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}


  getCountries(): Observable<ResponseModel<any>> {
    return this.http.get<ResponseModel<any>>(`${this.apiUrl}/GetAllCountries`);
  }

  getCities(countryId: number): Observable<ResponseModel<any>> {
    return this.http.get<ResponseModel<any>>(`${this.apiUrl}/GetAllCities?countryID=${countryId}`);
  }
  getStatuses(): Observable<ResponseModel<any>> {
    return this.http.get<ResponseModel<any>>(`${this.apiUrl}/GetAllStatuses`);
  }
  addNewCandidate(candidate: AddOrEditCandidate): Observable<ResponseModel<any>> {
     
    return this.http.post<ResponseModel<any>>(`${this.apiUrl}/addcandidate`, candidate);
  }
  uploadcv(candidateID: string , cvFIle: File ): Observable<ResponseModel<any>> {
    const formData = new FormData();
    formData.append('candidateID', candidateID);

    formData.append('cvFile', cvFIle,cvFIle.name);
    return this.http.put<ResponseModel<any>>(`${this.apiUrl}/UploadCV`,formData);
  }
  getAllCandidates(): Observable<ResponseModel<any>> {
    return this.http.get<ResponseModel<any>>(`${this.apiUrl}/GetAllCandidates`);
  }

  getcvbycandidateID(candidateID : string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/getCV?candidateId=${candidateID}`, {
      responseType: 'blob' // Set response type to blob
    });
  }
  getCandidateByCandidateID(candidateID : string): Observable<ResponseModel<any>> {
    return this.http.get<ResponseModel<any>>(`${this.apiUrl}/GetCandidateByCandidateID?candidateId=${candidateID}`);
  }

  editCandidate(candidate: AddOrEditCandidate): Observable<ResponseModel<any>> {
     
    return this.http.post<ResponseModel<any>>(`${this.apiUrl}/editCandidate`, candidate);
  }
}
