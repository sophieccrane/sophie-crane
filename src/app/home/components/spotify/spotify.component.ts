import { Component } from '@angular/core';
import {SpotifyService} from "../../services/spotify.service";
import {AccessToken, Artist, Artists, Playlist, Track, Tracks, UserProfile} from "../../types/spotify-payload.model";
import {forkJoin, map, Subject, switchMap, takeUntil, tap} from "rxjs";
import {PLAYLIST_IDS} from "../../../shared/constants";

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss']
})
export class SpotifyComponent {
  userProfile;
  userProfileDetails!: UserProfile;
  playlists;
  playlistDetails!: Playlist[];
  artists;
  artistDetails!: Artist[];
  tracks;
  trackDetails!: Track[];
  accessToken;
  private _destroy$ = new Subject<void>();

  constructor(private _spotifyService: SpotifyService) {
    this.accessToken = this.getAccessToken();
    this.userProfile = this.accessToken.pipe(
      switchMap((token: string) => this.getProfile(token))
    );
    this.playlists = this.accessToken.pipe(
      switchMap((token: string) =>
        forkJoin(PLAYLIST_IDS.map((playlistId: string) => this.getPlaylist(token, playlistId)))
      ));
    this.artists = this.accessToken.pipe(
      switchMap((token: string) =>
        this.getArtists(token))
    );
    this.tracks = this.accessToken.pipe(
      switchMap((token: string) =>
      this.getTracks(token))
    );
    this.setProfileDetails();
    this.setPlaylistDetails();
    this.setArtistDetails();
    this.setTrackDetails();
  }

  getProfile(accessToken: string) {
    return this._spotifyService.getUserProfileInfo(accessToken);
  }

  getPlaylist(accessToken: string, playlistId: string) {
    return this._spotifyService.getPlaylist(accessToken, playlistId);
  }

  getArtists(accessToken: string) {
    return this._spotifyService.getArtists(accessToken);
  }

  getTracks(accessToken: string) {
    return this._spotifyService.getTracks(accessToken);
  }

  getAccessToken() {
    return this._spotifyService.getAccessToken().pipe(
      map((token: AccessToken) => token.access_token)
    );
  }

  setPlaylistDetails() {
    return this.playlists.pipe(
      tap((playlists: Playlist[]) => {
        this.playlistDetails = playlists
      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  setProfileDetails() {
    return this.userProfile.pipe(
      tap((profile: UserProfile) => {
        this.userProfileDetails = {
          display_name: profile.display_name,
          external_urls: profile.external_urls,
          followers: profile.followers,
          href: profile.href,
          id: profile.id,
          images: profile.images,
          type: profile.type,
          uri: profile.uri
        }
      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  setArtistDetails() {
    return this.artists.pipe(
      tap((artists: Artists) => {
        this.artistDetails = artists.artists
      }),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  setTrackDetails() {
     return this.tracks.pipe(
       tap((tracks: Tracks) => {
         this.trackDetails = tracks.tracks
       }),
       takeUntil(this._destroy$)
     ).subscribe();
  }
}
