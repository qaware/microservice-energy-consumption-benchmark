import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as process from 'node:process';
import { BackendOpera } from './api/backend.opera';
import { BackendPlanet } from './api/backend.planet';
import { BackendJournal } from './api/backend.journal';

@Injectable()
export class BackendService {
  constructor(private readonly httpService: HttpService) {}

  async fetchSmall(token: string, id: string): Promise<BackendOpera> {
    const { data } = await firstValueFrom(
      this.httpService.get<BackendOpera>(
        process.env.BACKEND_FETCH_URL + '/api/fetch/' + id + '/small',
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    return data;
  }

  async fetchMedium(token: string, id: string): Promise<BackendPlanet> {
    const { data } = await firstValueFrom(
      this.httpService.get<BackendPlanet>(
        process.env.BACKEND_FETCH_URL + '/api/fetch/' + id + '/medium',
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    return data;
  }

  async fetchLarge(token: string, id: string): Promise<BackendJournal> {
    const { data } = await firstValueFrom(
      this.httpService.get<BackendJournal>(
        process.env.BACKEND_FETCH_URL + '/api/fetch/' + id + '/large',
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    return data;
  }

  async pushSmall(
    token: string,
    id: string,
    body: BackendOpera,
  ): Promise<BackendOpera> {
    const { data } = await firstValueFrom(
      this.httpService.post<BackendOpera>(
        process.env.BACKEND_PUSH_URL + '/api/push/' + id + '/small',
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    return data;
  }

  async pushMedium(
    token: string,
    id: string,
    body: BackendPlanet,
  ): Promise<BackendPlanet> {
    const { data } = await firstValueFrom(
      this.httpService.post<BackendPlanet>(
        process.env.BACKEND_PUSH_URL + '/api/push/' + id + '/medium',
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    return data;
  }

  async pushLarge(
    token: string,
    id: string,
    body: BackendJournal,
  ): Promise<BackendJournal> {
    const { data } = await firstValueFrom(
      this.httpService.post<BackendJournal>(
        process.env.BACKEND_PUSH_URL + '/api/push/' + id + '/large',
        body,
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );
    return data;
  }
}
