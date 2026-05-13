import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse, Game, GameFormDto, PagedResult } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private readonly url = `${environment.apiUrl}/games`;
  constructor(private http: HttpClient) {}

  getAll()          { return this.http.get<ApiResponse<Game[]>>(this.url); }
  getById(id: number) { return this.http.get<ApiResponse<Game>>(`${this.url}/${id}`); }

  getPaged(page = 1, pageSize = 12) {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<PagedResult<Game>>>(`${this.url}/paged`, { params });
  }

  create(dto: GameFormDto) { return this.http.post<ApiResponse<Game>>(this.url, dto); }
  update(id: number, dto: GameFormDto) { return this.http.put<ApiResponse<Game>>(`${this.url}/${id}`, dto); }
  delete(id: number) { return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`); }
}
