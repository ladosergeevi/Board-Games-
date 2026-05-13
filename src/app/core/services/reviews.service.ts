import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, CreateReviewDto, Review } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly url = `${environment.apiUrl}/review`;
  constructor(private http: HttpClient) {}

  getAll()                   { return this.http.get<ApiResponse<Review[]>>(this.url); }
  create(dto: CreateReviewDto) { return this.http.post<ApiResponse<Review>>(this.url, dto); }
  delete(id: number)         { return this.http.delete<ApiResponse<null>>(`${this.url}/${id}`); }

  update(id: number, dto: { text: string; rating: number }) {
  return this.http.put<ApiResponse<Review>>(`${this.url}/${id}`, dto);
}

}
