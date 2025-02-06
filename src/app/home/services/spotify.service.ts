import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import {ARTIST_IDS, PLAYLIST_FIELDS_PARAM, TRACK_IDS} from "../../shared/constants";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AccessToken, Playlist, UserProfile, Artist, Artists, Tracks} from "../types/spotify-payload.model";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly _baseUrl: string;
  private readonly _accessTokenUrl: string;

  constructor(private _http: HttpClient) {
    this._baseUrl = 'https://api.spotify.com/v1';
    this._accessTokenUrl = "https://accounts.spotify.com";
  }

  getAccessToken() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })

    const clientCreds = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: environment.spotify_client_id,
      client_secret: environment.spotify_client_secret
    });

    return this._http.post<AccessToken>(
      `${this._accessTokenUrl}/api/token`,
      clientCreds,
      { headers }
    );
  }

  getUserProfileInfo(accessToken: string) {
    return this._http.get<UserProfile>(
          `${this._baseUrl}/users/sophie-saffron`,
          {
            headers: new HttpHeaders({
              Authorization: "Bearer " + accessToken
            })
          });
  }

  // Change this to utilize get user's playlist endpoint
  getPlaylist(accessToken: string, playlistId: string) {
    let fields = 'fields=' + PLAYLIST_FIELDS_PARAM;
    return this._http.get<Playlist>(
      `${this._baseUrl}/playlists/${playlistId}`,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + accessToken
        }),
        params: new HttpParams(
          {
            fromString: fields
          }
        )
      },

    )
  }

  getArtists(accessToken: string) {
    let artistIds = 'ids=' + ARTIST_IDS.join(",");
    return this._http.get<Artists>(
      `${this._baseUrl}/artists`,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + accessToken
        }),
        params: new HttpParams(
          {
         fromString: artistIds
          }
        )
      }
    );
  }

  getTracks(accessToken: string) {
    let trackIds = 'ids=' + TRACK_IDS.join(",");
    return this._http.get<Tracks>(
      `${this._baseUrl}/tracks`,
      {
        headers: new HttpHeaders({
          Authorization: "Bearer " + accessToken
        }),
        params: new HttpParams(
          {
            fromString: trackIds
          }
        )
      }
    )
  }
}
